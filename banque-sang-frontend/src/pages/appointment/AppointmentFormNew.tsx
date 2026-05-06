import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AppointmentFormNew.module.css';
import { useAuth } from '../../context/AuthContext';
import { donneurApi } from '../../api/donneurApi';
import { rdvApi } from '../../api/rdvApi';
import apiClient from '../../config/axios';
import { formatGroupe } from '../../utils/groupeSanguin';
import type { Donneur } from '../../types/Donneur';

interface CentreDon {
  id: number;
  nom: string;
  adresse: string;
  telephone: string | null;
  horaires: string | null;
  actif: boolean | null;
}

interface FormData {
  centreId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

const initialFormData: FormData = {
  centreId: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
};

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export default function AppointmentFormNew() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [donneur, setDonneur] = useState<Donneur | null>(null);
  const [centres, setCentres] = useState<CentreDon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const [donneurData, centresData] = await Promise.all([
          donneurApi.getById(Number(user.id)),
          apiClient.get<CentreDon[]>('/centres-don').then((r) => r.data),
        ]);

        if (cancelled) return;
        setDonneur(donneurData);
        setCentres(centresData.filter((c) => c.actif !== false));
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Erreur de chargement.';
        setLoadError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (stepNum === 1) {
      if (!formData.centreId) newErrors.centreId = 'Veuillez sélectionner un centre';
      if (!formData.preferredDate) newErrors.preferredDate = 'Veuillez sélectionner une date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Veuillez sélectionner une heure';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!donneur) {
      setErrors({ submit: 'Donneur introuvable.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const selectedCentre = centres.find((c) => c.id === Number(formData.centreId));
      const dateHeure = `${formData.preferredDate}T${formData.preferredTime}:00`;

      const payload = {
        dateHeure,
        adresse: selectedCentre?.adresse ?? undefined,
        notes: formData.notes || undefined,
        statut: 'EN_ATTENTE' as const,
        donneur: { id: donneur.id },
        centreDon: { id: Number(formData.centreId) },
      };

      const created = await rdvApi.create(payload);

      navigate('/appointment/confirmation', {
        state: {
          rdv: created,
          centre: selectedCentre,
          donneur,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la prise de rendez-vous.';
      setErrors({ submit: message });
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>Connexion requise</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Vous devez être connecté en tant que donneur pour prendre un rendez-vous.
            </p>
            <Link to="/auth/login" className={styles.btnNext}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>Chargement…</h2>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !donneur) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h2 className={styles.stepTitle}>❌ Erreur</h2>
            <p style={{ textAlign: 'center' }}>
              {loadError ?? 'Donneur introuvable.'}
            </p>
            <Link to="/donor/dashboard" className={styles.btnPrevious}>
              ← Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedCentre = centres.find((c) => c.id === Number(formData.centreId));
  const selectedDate = formData.preferredDate
    ? new Date(formData.preferredDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📅 Prendre un Rendez-vous</h1>
        <p className={styles.subtitle}>
          Bonjour {donneur.prenom}, choisissez votre créneau
        </p>
      </header>

      <div className={styles.container}>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
          <div className={styles.progressSteps}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.stepNum}>1</div>
              <span>Date & Heure</span>
            </div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNum}>2</div>
              <span>Vérifier</span>
            </div>
            <div className={`${styles.progressStep}`}>
              <div className={styles.stepNum}>✓</div>
              <span>Confirmé</span>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Choisir un Créneau</h2>

              <div className={styles.formGroup}>
                <label htmlFor="centreId">Centre de Collecte *</label>
                {centres.length === 0 ? (
                  <p style={{ color: '#dc2626' }}>
                    Aucun centre disponible. Contactez l'administrateur.
                  </p>
                ) : (
                  <select
                    id="centreId"
                    name="centreId"
                    value={formData.centreId}
                    onChange={handleInputChange}
                    className={errors.centreId ? styles.inputError : ''}
                  >
                    <option value="">Sélectionnez un centre...</option>
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom} — {c.adresse}
                      </option>
                    ))}
                  </select>
                )}
                {errors.centreId && <span className={styles.error}>{errors.centreId}</span>}
              </div>

              {selectedCentre && (
                <div className={styles.centerInfo}>
                  <h4>📍 {selectedCentre.nom}</h4>
                  <p>{selectedCentre.adresse}</p>
                  {selectedCentre.horaires && <p>Horaires : {selectedCentre.horaires}</p>}
                  {selectedCentre.telephone && <p>Tél : {selectedCentre.telephone}</p>}
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="preferredDate">Date Préférée *</label>
                  <input
                    id="preferredDate"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className={errors.preferredDate ? styles.inputError : ''}
                  />
                  {errors.preferredDate && (
                    <span className={styles.error}>{errors.preferredDate}</span>
                  )}
                  {formData.preferredDate && (
                    <span className={styles.hint}>📅 {selectedDate}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="preferredTime">Heure Préférée *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className={errors.preferredTime ? styles.inputError : ''}
                  >
                    <option value="">Sélectionnez...</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <span className={styles.error}>{errors.preferredTime}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes / Demandes Spéciales (optionnel)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ex : problèmes d'accès, allergie connue, etc."
                  rows={4}
                />
              </div>

              <div className={styles.infoBox}>
                <p>
                  ⏱️ <strong>Important :</strong> Le créneau peut être réservé à partir
                  de 3 jours à l'avance et jusqu'à 90 jours.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Vérifier Votre Rendez-vous</h2>

              <div className={styles.reviewBox}>
                <div className={styles.reviewSection}>
                  <h4>👤 Vos Informations</h4>
                  <div className={styles.reviewItem}>
                    <span>Nom complet :</span>
                    <strong>{donneur.prenom} {donneur.nom}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Email :</span>
                    <strong>{donneur.email}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Téléphone :</span>
                    <strong>{donneur.telephone ?? '—'}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Groupe Sanguin :</span>
                    <strong>{formatGroupe(donneur.groupeSanguin)}</strong>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <h4>📅 Détails du Rendez-vous</h4>
                  <div className={styles.reviewItem}>
                    <span>Centre :</span>
                    <strong>{selectedCentre?.nom ?? '—'}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Adresse :</span>
                    <strong>{selectedCentre?.adresse ?? '—'}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Date :</span>
                    <strong>{selectedDate}</strong>
                  </div>
                  <div className={styles.reviewItem}>
                    <span>Heure :</span>
                    <strong>{formData.preferredTime}</strong>
                  </div>
                  {formData.notes && (
                    <div className={styles.reviewItem}>
                      <span>Notes :</span>
                      <strong>{formData.notes}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.confirmationInfo}>
                <h4>✅ Avant de Confirmer</h4>
                <ul>
                  <li>Assurez-vous d'être en bonne santé et bien hydraté</li>
                  <li>Apportez une pièce d'identité valide</li>
                  <li>Arrivez 15 minutes avant votre rendez-vous</li>
                </ul>
              </div>

              {errors.submit && <div className={styles.submitError}>❌ {errors.submit}</div>}
            </div>
          )}

          <div className={styles.buttonGroup}>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className={styles.btnPrevious}
                disabled={isSubmitting}
              >
                ← Précédent
              </button>
            )}

            {step < 2 ? (
              <button type="button" onClick={handleNext} className={styles.btnNext}>
                Suivant →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.btnSubmit}
              >
                {isSubmitting ? '⏳ Confirmation en cours...' : '✓ Confirmer le Rendez-vous'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
