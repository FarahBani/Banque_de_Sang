import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DonorRegistrationNew.module.css';
import { donneurApi } from '../../api/donneurApi';
import { useAuth } from '../../context/AuthContext';
import { parseGroupe } from '../../utils/groupeSanguin';
import type { DonneurCreatePayload, GroupeSanguin } from '../../types/Donneur';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  hasChronicDiseases: string;
  chronicDiseasesDetails: string;
  hasMedicines: string;
  medicinesDetails: string;
  weight: string;
  height: string;
  smoker: string;
  alcoholConsumption: string;
  lastDonationDate: string;
  allergies: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  password: string;
  passwordConfirm: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  bloodType: 'O+',
  hasChronicDiseases: 'non',
  chronicDiseasesDetails: '',
  hasMedicines: 'non',
  medicinesDetails: '',
  weight: '',
  height: '',
  smoker: 'non',
  alcoholConsumption: 'modere',
  lastDonationDate: '',
  allergies: '',
  address: '',
  city: '',
  zipCode: '',
  country: 'Tunisie',
  password: '',
  passwordConfirm: '',
};

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const cities = ['Tunis', 'Ben Arous', 'Ariana', 'Sfax', 'Sousse', 'Monastir', 'Kasserine', 'Gafsa', 'Kébili', 'Tataouine'];

const TOTAL_STEPS = 5;

export default function DonorRegistrationNew() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
      if (!formData.email) newErrors.email = "L'email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
      if (!formData.gender) newErrors.gender = 'Le genre est requis';
    }

    if (step === 2) {
      if (!formData.bloodType) newErrors.bloodType = 'Le groupe sanguin est requis';
      if (formData.hasChronicDiseases === 'oui' && !formData.chronicDiseasesDetails) {
        newErrors.chronicDiseasesDetails = 'Veuillez décrire la maladie chronique';
      }
      if (formData.hasMedicines === 'oui' && !formData.medicinesDetails) {
        newErrors.medicinesDetails = 'Veuillez décrire les médicaments';
      }
    }

    if (step === 3) {
      if (!formData.weight) newErrors.weight = 'Le poids est requis';
      if (!formData.height) newErrors.height = 'La taille est requise';
    }

    if (step === 4) {
      if (!formData.address) newErrors.address = "L'adresse est requise";
      if (!formData.city) newErrors.city = 'La ville est requise';
      if (!formData.zipCode) newErrors.zipCode = 'Le code postal est requis';
    }

    if (step === 5) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 4) {
        newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
      }
      if (!formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Veuillez confirmer le mot de passe';
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas';
      }
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
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const groupe: GroupeSanguin | null = parseGroupe(formData.bloodType);

      const adresseComplete = [
        formData.address,
        formData.city,
        formData.zipCode,
        formData.country,
      ]
        .filter(Boolean)
        .join(', ');

      const payload: DonneurCreatePayload & { actif?: boolean; eligible?: boolean } = {
        nom: formData.lastName.trim(),
        prenom: formData.firstName.trim(),
        email: formData.email.trim().toLowerCase(),
        motDePasse: formData.password,
        telephone: formData.phone.trim(),
        groupeSanguin: groupe ?? undefined,
        dateNaissance: formData.dateOfBirth,
        poids: formData.weight ? Number(formData.weight) : undefined,
        adresse: adresseComplete,
        actif: true,
        eligible: true,
      };

      await donneurApi.create(payload);

      try {
        await login({
          email: payload.email,
          password: formData.password,
          role: 'DONNEUR',
        });
        navigate('/donor/dashboard', { replace: true, state: { newDonor: true } });
      } catch {
        navigate('/auth/login', {
          state: { registered: true, email: payload.email },
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription.";

      const lower = message.toLowerCase();
      if (lower.includes('409') || lower.includes('existe') || lower.includes('exist')) {
        setErrors({ submit: 'Cet email est déjà utilisé. Utilisez-en un autre ou connectez-vous.' });
      } else {
        setErrors({ submit: message });
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return '';
    const age = new Date().getFullYear() - new Date(dateString).getFullYear();
    return age >= 18 ? '✓ Éligible' : '✗ Trop jeune';
  };

  const stepLabels = ['Personnel', 'Médical', 'Santé', 'Adresse', 'Sécurité'];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>💉 Inscription Donneur</h1>
        <p className={styles.subtitle}>Rejoignez notre communauté de donneurs</p>
      </header>

      <div className={styles.container}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
          <div className={styles.progressSteps}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`${styles.progressStep} ${
                  step <= currentStep ? styles.completed : ''
                } ${step === currentStep ? styles.active : ''}`}
              >
                <div className={styles.stepCircle}>{step}</div>
                <div className={styles.stepLabel}>{stepLabels[step - 1]}</div>
              </div>
            ))}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Informations Personnelles</h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre prénom"
                    className={errors.firstName ? styles.inputError : ''}
                  />
                  {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre nom"
                    className={errors.lastName ? styles.inputError : ''}
                  />
                  {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre.email@exemple.com"
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Téléphone *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+216 XX XXX XXX"
                    className={errors.phone ? styles.inputError : ''}
                  />
                  {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dateOfBirth">Date de Naissance *</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? styles.inputError : ''}
                  />
                  {errors.dateOfBirth && (
                    <span className={styles.error}>{errors.dateOfBirth}</span>
                  )}
                  {formData.dateOfBirth && (
                    <span className={styles.hint}>{calculateAge(formData.dateOfBirth)}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">Genre *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? styles.inputError : ''}
                >
                  <option value="">Sélectionnez votre genre</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
                {errors.gender && <span className={styles.error}>{errors.gender}</span>}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Historique Médical</h2>

              <div className={styles.formGroup}>
                <label htmlFor="bloodType">Groupe Sanguin *</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className={errors.bloodType ? styles.inputError : ''}
                >
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.bloodType && <span className={styles.error}>{errors.bloodType}</span>}
              </div>

              <div className={styles.questionGroup}>
                <label>Avez-vous une maladie chronique ? *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasChronicDiseases"
                      value="non"
                      checked={formData.hasChronicDiseases === 'non'}
                      onChange={handleInputChange}
                    />
                    Non
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasChronicDiseases"
                      value="oui"
                      checked={formData.hasChronicDiseases === 'oui'}
                      onChange={handleInputChange}
                    />
                    Oui
                  </label>
                </div>
              </div>

              {formData.hasChronicDiseases === 'oui' && (
                <div className={styles.formGroup}>
                  <label htmlFor="chronicDiseasesDetails">Veuillez décrire *</label>
                  <textarea
                    id="chronicDiseasesDetails"
                    name="chronicDiseasesDetails"
                    value={formData.chronicDiseasesDetails}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre maladie chronique..."
                    rows={3}
                    className={errors.chronicDiseasesDetails ? styles.inputError : ''}
                  />
                  {errors.chronicDiseasesDetails && (
                    <span className={styles.error}>{errors.chronicDiseasesDetails}</span>
                  )}
                </div>
              )}

              <div className={styles.questionGroup}>
                <label>Prenez-vous des médicaments régulièrement ? *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasMedicines"
                      value="non"
                      checked={formData.hasMedicines === 'non'}
                      onChange={handleInputChange}
                    />
                    Non
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="hasMedicines"
                      value="oui"
                      checked={formData.hasMedicines === 'oui'}
                      onChange={handleInputChange}
                    />
                    Oui
                  </label>
                </div>
              </div>

              {formData.hasMedicines === 'oui' && (
                <div className={styles.formGroup}>
                  <label htmlFor="medicinesDetails">Veuillez décrire *</label>
                  <textarea
                    id="medicinesDetails"
                    name="medicinesDetails"
                    value={formData.medicinesDetails}
                    onChange={handleInputChange}
                    placeholder="Listez les médicaments que vous prenez..."
                    rows={3}
                    className={errors.medicinesDetails ? styles.inputError : ''}
                  />
                  {errors.medicinesDetails && (
                    <span className={styles.error}>{errors.medicinesDetails}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Habitudes de Santé</h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="weight">Poids (kg) *</label>
                  <input
                    id="weight"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Ex: 70"
                    min="40"
                    max="200"
                    className={errors.weight ? styles.inputError : ''}
                  />
                  {errors.weight && <span className={styles.error}>{errors.weight}</span>}
                  {formData.weight && (
                    <span className={styles.hint}>
                      {parseInt(formData.weight) >= 50
                        ? '✓ Poids acceptable'
                        : '✗ Poids minimum: 50kg'}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="height">Taille (cm) *</label>
                  <input
                    id="height"
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Ex: 175"
                    min="140"
                    max="220"
                    className={errors.height ? styles.inputError : ''}
                  />
                  {errors.height && <span className={styles.error}>{errors.height}</span>}
                </div>
              </div>

              <div className={styles.questionGroup}>
                <label>Êtes-vous fumeur ? *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="smoker"
                      value="non"
                      checked={formData.smoker === 'non'}
                      onChange={handleInputChange}
                    />
                    Non
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="smoker"
                      value="oui"
                      checked={formData.smoker === 'oui'}
                      onChange={handleInputChange}
                    />
                    Oui
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="alcoholConsumption">Consommation d'alcool *</label>
                <select
                  id="alcoholConsumption"
                  name="alcoholConsumption"
                  value={formData.alcoholConsumption}
                  onChange={handleInputChange}
                >
                  <option value="jamais">Jamais</option>
                  <option value="rarement">Rarement</option>
                  <option value="modere">Modéré</option>
                  <option value="regulier">Régulier</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastDonationDate">Date du dernier don (si applicable)</label>
                <input
                  id="lastDonationDate"
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleInputChange}
                />
                {formData.lastDonationDate && (
                  <span className={styles.hint}>
                    {new Date().getTime() - new Date(formData.lastDonationDate).getTime() >
                    56 * 24 * 60 * 60 * 1000
                      ? '✓ Vous pouvez donner à nouveau'
                      : '✗ Vous devez attendre 56 jours avant de redonner'}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="allergies">Allergies connues</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Listez vos allergies (si aucune, laissez vide)"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Adresse</h2>

              <div className={styles.formGroup}>
                <label htmlFor="address">Adresse *</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rue, numéro..."
                  className={errors.address ? styles.inputError : ''}
                />
                {errors.address && <span className={styles.error}>{errors.address}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">Ville *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? styles.inputError : ''}
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && <span className={styles.error}>{errors.city}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="zipCode">Code Postal *</label>
                  <input
                    id="zipCode"
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Ex: 1000"
                    className={errors.zipCode ? styles.inputError : ''}
                  />
                  {errors.zipCode && <span className={styles.error}>{errors.zipCode}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country">Pays *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="Tunisie">Tunisie</option>
                  <option value="Algérie">Algérie</option>
                  <option value="Maroc">Maroc</option>
                  <option value="France">France</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5 - SECURITE (NOUVEAU) */}
          {currentStep === 5 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>Sécurité du compte</h2>

              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Choisissez un mot de passe pour vous connecter à votre espace donneur.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="password">Mot de passe *</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Au moins 4 caractères"
                  autoComplete="new-password"
                  className={errors.password ? styles.inputError : ''}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="passwordConfirm">Confirmer le mot de passe *</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Retapez le mot de passe"
                  autoComplete="new-password"
                  className={errors.passwordConfirm ? styles.inputError : ''}
                />
                {errors.passwordConfirm && (
                  <span className={styles.error}>{errors.passwordConfirm}</span>
                )}
              </div>

              <div className={styles.reviewSection}>
                <h3>Récapitulatif de votre inscription :</h3>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <strong>Nom complet :</strong> {formData.firstName} {formData.lastName}
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>Email :</strong> {formData.email}
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>Téléphone :</strong> {formData.phone}
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>Groupe sanguin :</strong> {formData.bloodType}
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>Poids :</strong> {formData.weight} kg
                  </div>
                  <div className={styles.reviewItem}>
                    <strong>Adresse :</strong> {formData.address}, {formData.city} (
                    {formData.zipCode}), {formData.country}
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div
              className={styles.submitError}
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                marginTop: '1rem',
              }}
            >
              ❌ {errors.submit}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className={styles.btnPrevious}
            >
              ← Précédent
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button type="button" onClick={handleNext} className={styles.btnNext}>
                Suivant →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.btnSubmit}
              >
                {isSubmitting ? '⏳ Inscription en cours...' : "✓ Terminer l'Inscription"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}