import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './AppointmentConfirmationNew.module.css';
import { rdvApi } from '../../api/rdvApi';
import { formatGroupe } from '../../utils/groupeSanguin';
import type { RendezVous } from '../../types/RendezVous';
import type { Donneur } from '../../types/Donneur';

interface CentreInfo {
  id: number;
  nom: string;
  adresse: string;
  telephone?: string | null;
  horaires?: string | null;
}

interface LocationState {
  rdv?: RendezVous;
  centre?: CentreInfo;
  donneur?: Donneur;
}

export default function AppointmentConfirmationNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) ?? {};
  const { rdv, centre, donneur } = state;

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si on arrive ici sans données (ex: refresh de la page), on redirige vers le dashboard
  if (!rdv || !donneur) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.confirmationCard}>
            <h2>Aucun rendez-vous à afficher</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Cette page affiche la confirmation d'un rendez-vous qui vient d'être créé.
              Si vous avez rafraîchi la page, les informations ont été perdues.
            </p>
            <Link to="/donor/dashboard" className={styles.btnDashboard}>
              → Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dateRdv = new Date(rdv.dateHeure);
  const formattedDate = dateRdv.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dateRdv.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const appointmentId = `RDV-${String(rdv.id).padStart(6, '0')}`;

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    try {
      setIsCancelling(true);
      setError(null);
      await rdvApi.annuler(rdv.id);
      setCancelled(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'annulation.";
      setError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  // Vue après annulation réussie
  if (cancelled) {
    return (
      <div className={styles.page}>
        <section className={styles.successHeader} style={{ background: '#fef2f2' }}>
          <div className={styles.successIcon} style={{ background: '#dc2626' }}>
            ✕
          </div>
          <h1 className={styles.title}>Rendez-vous Annulé</h1>
          <p className={styles.subtitle}>
            Votre rendez-vous {appointmentId} a bien été annulé.
          </p>
        </section>
        <div className={styles.container}>
          <div className={styles.actionsContainer}>
            <Link to="/appointment/new" className={styles.btnDashboard}>
              📅 Prendre un nouveau RDV
            </Link>
            <Link to="/donor/dashboard" className={styles.btnHome}>
              🏠 Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.successHeader}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>Rendez-vous Confirmé !</h1>
        <p className={styles.subtitle}>
          Votre réservation a été enregistrée avec succès
        </p>
      </section>

      <div className={styles.container}>
        <div className={styles.confirmationCard}>
          <div className={styles.cardHeader}>
            <h2>Récapitulatif de Votre Rendez-vous</h2>
            <p className={styles.confirmationId}>ID : {appointmentId}</p>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailSection}>
              <h3>👤 Vos Informations</h3>
              <div className={styles.detail}>
                <span className={styles.label}>Nom Complet :</span>
                <span className={styles.value}>
                  {donneur.prenom} {donneur.nom}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Email :</span>
                <span className={styles.value}>{donneur.email}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Téléphone :</span>
                <span className={styles.value}>{donneur.telephone ?? '—'}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Groupe Sanguin :</span>
                <span className={styles.bloodType}>
                  {formatGroupe(donneur.groupeSanguin)}
                </span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>📅 Détails du Rendez-vous</h3>
              <div className={styles.detail}>
                <span className={styles.label}>Centre :</span>
                <span className={styles.value}>{centre?.nom ?? rdv.adresse ?? '—'}</span>
              </div>
              {centre?.adresse && (
                <div className={styles.detail}>
                  <span className={styles.label}>Adresse :</span>
                  <span className={styles.value}>{centre.adresse}</span>
                </div>
              )}
              <div className={styles.detail}>
                <span className={styles.label}>Date :</span>
                <span className={styles.value}>{formattedDate}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Heure :</span>
                <span className={styles.value}>{formattedTime}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Statut :</span>
                <span className={styles.value}>{rdv.statut}</span>
              </div>
              {rdv.notes && (
                <div className={styles.detail}>
                  <span className={styles.label}>Notes :</span>
                  <span className={styles.value}>{rdv.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.importantSection}>
            <h3>⚠️ Informations Importantes</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.checkmark}>✓</span>
                <p>Votre rendez-vous est enregistré avec l'ID <strong>{appointmentId}</strong></p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.checkmark}>✓</span>
                <p>Arrivez 15 minutes avant l'heure prévue</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.checkmark}>✓</span>
                <p>Apportez une pièce d'identité valide</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.checkmark}>✓</span>
                <p>Restez hydraté et bien alimenté avant le don</p>
              </div>
            </div>
          </div>

          <div className={styles.whatToExpectSection}>
            <h3>📋 À Quoi S'attendre</h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Accueil</h4>
                <p>Enregistrement et vérification de vos informations</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>Tests</h4>
                <p>Mesure TA, température et test sanguin rapide</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>Prélèvement</h4>
                <p>Donation (environ 10-15 minutes)</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h4>Repos</h4>
                <p>Repos et collations gratuits</p>
              </div>
            </div>
          </div>

          <div className={styles.cancellationSection}>
            <h3>❌ Modifier ou Annuler</h3>
            <p>
              Vous pouvez annuler ce rendez-vous directement ici. Pour le modifier,
              annulez-le puis créez-en un nouveau.
            </p>
            {error && (
              <p style={{ color: '#dc2626', marginTop: '0.75rem' }}>❌ {error}</p>
            )}
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: isCancelling ? 'not-allowed' : 'pointer',
                opacity: isCancelling ? 0.6 : 1,
                fontWeight: 600,
              }}
            >
              {isCancelling ? '⏳ Annulation...' : '✕ Annuler ce rendez-vous'}
            </button>
          </div>
        </div>

        <div className={styles.actionsContainer}>
          <Link to="/donor/dashboard" className={styles.btnDashboard}>
            → Aller au Tableau de Bord
          </Link>
          <button className={styles.btnPrint} onClick={() => window.print()}>
            🖨️ Imprimer
          </button>
          <Link to="/" className={styles.btnHome}>
            🏠 Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
