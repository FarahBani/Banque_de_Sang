import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>À Propos de SaveLife</h1>
        <p className={styles.subtitle}>Notre mission : sauver des vies par le don de sang</p>
      </div>

      <section className={styles.section}>
        <h2>Notre Mission</h2>
        <p>
          SaveLife est une plateforme innovante dédiée à faciliter le don de sang et à sauver des vies.
          Nous connectons les donneurs généreux avec les patients en besoin urgent de sang.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Pourquoi le Don de Sang?</h2>
        <ul>
          <li>💉 <strong>Urgence Vitale</strong> - Selon l'OMS, 4.5 millions de personnes décèdent chaque année faute de transfusion sanguine</li>
          <li>❤️ <strong>Simple et Rapide</strong> - Un seul don peut sauver jusqu'à 3 vies</li>
          <li>🏥 <strong>Pas de Risque</strong> - Processus 100% sûr avec équipement stérile</li>
          <li>🌍 <strong>Impact Global</strong> - Votre don aide immédiatement des patients locaux</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Nos Valeurs</h2>
        <div className={styles.values}>
          <div className={styles.value}>
            <h3>Solidarité</h3>
            <p>Unir les donneurs pour une cause commune</p>
          </div>
          <div className={styles.value}>
            <h3>Transparence</h3>
            <p>Processus clair et sécurisé</p>
          </div>
          <div className={styles.value}>
            <h3>Innovation</h3>
            <p>Technologie pour améliorer le service</p>
          </div>
        </div>
      </section>

      <section className={styles.contact}>
        <h2>Nous Contacter</h2>
        <p>Email: <a href="mailto:contact@savelife.tn">contact@savelife.tn</a></p>
        <p>Téléphone: <a href="tel:+21671234567">+216 71 234 567</a></p>
      </section>
    </div>
  );
}
