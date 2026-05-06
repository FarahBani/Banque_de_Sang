import styles from './DonorPage.module.css';

export default function DonorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Devenir Donneur</h1>
        <p className={styles.subtitle}>Rejoignez notre communauté et sauvez des vies</p>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <h3>Inscrivez-vous</h3>
          <p>Créez votre profil donneur en quelques minutes</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <h3>Prise de Sang</h3>
          <p>Effectuez une prise de sang simple et rapide</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <h3>Sauvez des Vies</h3>
          <p>Votre sang aide des patients en besoin urgent</p>
        </div>
      </div>

      <div className={styles.requirements}>
        <h2>Conditions pour Donner</h2>
        <ul>
          <li>✓ Âge: 18-65 ans</li>
          <li>✓ Poids: au minimum 50 kg</li>
          <li>✓ Bonne santé générale</li>
          <li>✓ Identité valide</li>
          <li>✓ Pas de maladie infectieuse</li>
        </ul>
      </div>

      <button className={styles.btnStart}>Commencer l'Inscription</button>
    </div>
  );
}
