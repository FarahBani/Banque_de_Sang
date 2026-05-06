import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DonorPageNew.module.css';

interface EligibilityResult {
  eligible: boolean;
  message: string;
  issues: string[];
}

export default function DonorPageNew() {
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    healthStatus: 'bon',
  });
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    const issues: string[] = [];

    if (age < 18) issues.push('Vous devez avoir au moins 18 ans');
    if (age > 65) issues.push('Vous avez dépassé l\'âge maximum (65 ans)');
    if (weight < 50) issues.push('Vous devez peser au moins 50 kg');
    if (formData.healthStatus !== 'bon') {
      issues.push('Votre état de santé actuel n\'est pas compatible avec le don');
    }

    const eligible = issues.length === 0;
    setEligibilityResult({
      eligible,
      message: eligible
        ? '✅ Félicitations! Vous êtes éligible pour donner votre sang.'
        : '❌ Malheureusement, vous ne pouvez pas donner pour le moment.',
      issues,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ age: '', weight: '', healthStatus: 'bon' });
    setEligibilityResult(null);
    setShowEligibilityChecker(false);
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>💉 Faire un Don de Sang</h1>
        <p className={styles.headerSubtitle}>
          Découvrez les conditions d'éligibilité et les étapes pour devenir donneur
        </p>
      </header>

      {/* ELIGIBILITY CONDITIONS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Conditions d'Éligibilité</h2>
        <div className={styles.conditionsGrid}>
          <div className={styles.conditionCard}>
            <div className={styles.conditionIcon}>👤</div>
            <h3>Âge</h3>
            <p>Vous devez avoir entre 18 et 65 ans</p>
          </div>
          <div className={styles.conditionCard}>
            <div className={styles.conditionIcon}>⚖️</div>
            <h3>Poids</h3>
            <p>Poids minimum: 50 kg pour garantir votre sécurité</p>
          </div>
          <div className={styles.conditionCard}>
            <div className={styles.conditionIcon}>❤️</div>
            <h3>Santé Générale</h3>
            <p>Vous devez être en bonne santé générale</p>
          </div>
          <div className={styles.conditionCard}>
            <div className={styles.conditionIcon}>🩸</div>
            <h3>Antécédents</h3>
            <p>Pass certain nombre de jours depuis le dernier don (56 jours minimum)</p>
          </div>
        </div>
      </section>

      {/* CONTRAINDICATIONS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contre-indications au Don</h2>
        <div className={styles.contraindicationsContent}>
          <div className={styles.contraColumn}>
            <h3 className={styles.contraTitle}>🚫 Raisons Permanentes</h3>
            <ul className={styles.contraList}>
              <li>Antécédents de certaines maladies transmissibles par le sang</li>
              <li>VIH positif</li>
              <li>Hépatite B ou C positive</li>
              <li>Syphilis</li>
              <li>Certaines maladies cardiaques graves</li>
              <li>Chirurgies importantes non cicatrisées</li>
            </ul>
          </div>
          <div className={styles.contraColumn}>
            <h3 className={styles.contraTitle}>⏱️ Raisons Temporaires</h3>
            <ul className={styles.contraList}>
              <li>Fièvre ou infection en cours</li>
              <li>Vaccin reçu dans les 2 dernières semaines</li>
              <li>Extraction dentaire dans les 15 jours</li>
              <li>Grossesse (attendre 6 mois post-accouchement)</li>
              <li>Allaitement en cours</li>
              <li>Traitement antibiotique en cours</li>
              <li>Chirurgie mineure (attendre 48 heures)</li>
              <li>Grip, rhume, toux persistante</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY CHECKER */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vérifier Mon Éligibilité</h2>
        <div className={styles.checkerContainer}>
          {!showEligibilityChecker ? (
            <button
              className={styles.btnChecker}
              onClick={() => setShowEligibilityChecker(true)}
            >
              🔍 Lancer le Test Rapide
            </button>
          ) : (
            <div className={styles.checkerForm}>
              <div className={styles.formGroup}>
                <label htmlFor="age">Votre Âge *</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Entrez votre âge"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  max="120"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weight">Votre Poids (kg) *</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  placeholder="Entrez votre poids en kg"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  max="300"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="healthStatus">État de Santé Général *</label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                >
                  <option value="bon">Bon</option>
                  <option value="moyen">Moyen (rhume, fatigue légère)</option>
                  <option value="mauvais">Mauvais (fièvre, infection)</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnSubmit} onClick={checkEligibility}>
                  Vérifier
                </button>
                <button className={styles.btnCancel} onClick={handleReset}>
                  Annuler
                </button>
              </div>

              {eligibilityResult && (
                <div className={`${styles.result} ${eligibilityResult.eligible ? styles.eligible : styles.notEligible}`}>
                  <h4>{eligibilityResult.message}</h4>
                  {eligibilityResult.issues.length > 0 && (
                    <ul className={styles.issuesList}>
                      {eligibilityResult.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  {eligibilityResult.eligible && (
                    <p className={styles.resultInfo}>
                      Contactez un centre de collecte proche de chez vous pour prendre rendez-vous
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* DOCUMENTS REQUIRED */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Documents à Apporter</h2>
        <div className={styles.documentsGrid}>
          <div className={styles.documentCard}>
            <div className={styles.docIcon}>📋</div>
            <h3>Pièce d'Identité</h3>
            <p>Carte d'identité nationale, passeport ou permis de conduire valide</p>
          </div>
          <div className={styles.documentCard}>
            <div className={styles.docIcon}>💳</div>
            <h3>Carte CNI ou CNSS</h3>
            <p>Pour la vérification de vos antécédents médicaux</p>
          </div>
          <div className={styles.documentCard}>
            <div className={styles.docIcon}>📄</div>
            <h3>Antécédents Médicaux</h3>
            <p>Listez vos vaccinations et traitements récents</p>
          </div>
          <div className={styles.documentCard}>
            <div className={styles.docIcon}>🏥</div>
            <h3>Attestation (si applicable)</h3>
            <p>Certificat médical si vous avez des conditions spéciales</p>
          </div>
        </div>
      </section>

      {/* DIETARY RECOMMENDATIONS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommandations Alimentaires</h2>
        <div className={styles.recommendationsContainer}>
          <div className={styles.recommendationCategory}>
            <h3 className={styles.recTitle}>✅ À Faire Avant le Don</h3>
            <ul className={styles.recList}>
              <li>Manger un repas complet et équilibré au moins 2 heures avant le don</li>
              <li>Boire beaucoup d'eau (au moins 1,5 litres) le jour du don</li>
              <li>Éviter les boissons alcoolisées 24 heures avant</li>
              <li>Dormir suffisamment (7-8 heures) la nuit précédente</li>
              <li>Consommer des aliments riches en fer (viande rouge, épinards, légumineuses)</li>
              <li>Prendre un petit-déjeuner léger le matin du don</li>
            </ul>
          </div>

          <div className={styles.recommendationCategory}>
            <h3 className={styles.recTitle}>❌ À Éviter Avant le Don</h3>
            <ul className={styles.recList}>
              <li>Les graisses saturées et les repas trop lourds</li>
              <li>L'alcool et les boissons caféinées en excès</li>
              <li>Les repas épicés ou très salés</li>
              <li>Fumer intensément le jour du don</li>
              <li>L'exercice physique intense</li>
              <li>Les fruits de mer crus</li>
            </ul>
          </div>

          <div className={styles.recommendationCategory}>
            <h3 className={styles.recTitle}>🍎 Après le Don</h3>
            <ul className={styles.recList}>
              <li>Rester assis 15-30 minutes après le don</li>
              <li>Boire de l'eau et des jus de fruit</li>
              <li>Manger des aliments légers et riches en sucre</li>
              <li>Augmenter l'apport en fer les jours suivants</li>
              <li>Éviter l'exercice physique pendant 24 heures</li>
              <li>Rester hydraté pendant plusieurs jours</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DONATION PROCESS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Processus de Don</h2>
        <div className={styles.processSteps}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Accueil & Entretien</h3>
            <p>Entrevue préalable avec un professionnel de santé, vérification des antécédents</p>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Tests Préliminaires</h3>
            <p>Mesure de la tension, prise de température, test sanguin rapide</p>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Prélèvement</h3>
            <p>Donation de 450 ml de sang en environ 10-15 minutes</p>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Repos & Rafraîchissements</h3>
            <p>Repos obligatoire, boissons et collations gratuits</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Questions Fréquentes</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem}>
            <h4>💛 Combien de sang est prélevé ?</h4>
            <p>Une donation standard est de 450 ml (environ une pinte), ce qui représente moins de 15% de la circulation sanguine totale.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>⏰ Combien de temps dure un don ?</h4>
            <p>Le processus complet prend environ 30-45 minutes, dont 10-15 minutes de prélèvement effectif.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>🔄 Combien de fois puis-je donner ?</h4>
            <p>Les hommes peuvent donner 4 fois par an, les femmes 3 fois par an, avec au minimum 8 semaines entre chaque don.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>💪 Vais-je me sentir faible après ?</h4>
            <p>Certains donneurs ressentent une légère fatigue, mais celle-ci disparaît généralement en quelques jours avec une bonne hydratation.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>🧪 Le don de sang est-il dangereux ?</h4>
            <p>Non, le don de sang est sûr. Une seule aiguille stérile est utilisée et elle est immédiatement jetée après.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>🏥 Et si j'ai une condition médicale ?</h4>
            <p>Toutes les conditions médicales sont examinées individuellement. Informez l'équipe médicale de tout problème de santé ou médicament.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <h2>Prêt à Donner ?</h2>
        <p>Procédez à la prise de rendez-vous dès maintenant dans un centre de collecte proche de vous</p>
        <Link to="/appointment/new" className={styles.ctaButton}>
          📅 Prendre un Rendez-vous Maintenant
        </Link>
      </section>

      {/* CENTERS INFO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Trouvez un Centre Proche</h2>
        <p className={styles.centersInfo}>
          Besoin de localiser un centre de collecte ? <Link to="/centers" className={styles.link}>Consultez notre carte des centres</Link>
        </p>
      </section>
    </div>
  );
}
