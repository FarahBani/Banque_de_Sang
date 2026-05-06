import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePageNew.module.css';

export default function HomePageNew() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div className={styles.logoCircle}>💉</div>
          <span className={styles.navBrand}>SaveLife</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Accueil</Link>
          <Link to="/don" className={styles.navLink}>Faire un don</Link>
          <Link to="/centers" className={styles.navLink}>Centres</Link>
          <Link to="/about" className={styles.navLink}>À propos</Link>
        </div>
        <div className={styles.navButtons}>
          <Link to="/auth/login" className={styles.navCta}>Se connecter</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Sauvez des vies,<br />
            <span className={styles.heroAccent}>Donnez votre sang</span>
          </h1>
          <p className={styles.heroText}>
            Rejoignez notre communauté de donneurs et faites une vraie différence.
            Chaque don sauve jusqu'à 3 vies. C'est simple, rapide et gratuit.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/appointment/new" className={styles.btnPrimary}>
              📅 Prendre un Rendez-vous
            </Link>
            <Link to="/don" className={styles.btnOutline}>
              En savoir plus
            </Link>
          </div>
          <div className={styles.badge}>
            ⚡ Don rapide - Seulement 10 minutes
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="#dc2626" opacity="0.2">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className={styles.statsSection}>
        <h2>Nos Chiffres</h2>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statValue}>10,000+</div>
            <div className={styles.statLabel}>Donneurs Actifs</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>❤️</div>
            <div className={styles.statValue}>30,000+</div>
            <div className={styles.statLabel}>Vies Sauvées</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>🏥</div>
            <div className={styles.statValue}>120</div>
            <div className={styles.statLabel}>Centres de Collecte</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>🕐</div>
            <div className={styles.statValue}>24/7</div>
            <div className={styles.statLabel}>Service Disponible</div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className={styles.howSection}>
        <h2>Comment ça marche ?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Vérification Médicale</h3>
            <p>Test sanguin pour déterminer votre groupe sanguin et vérifier votre éligibilité</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Prélèvement</h3>
            <p>Environ 10 minutes dans un environnement sécurisé et stérile</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Certificat & Badge</h3>
            <p>Recevez un certificat officiel et des badges selon vos contributions</p>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className={styles.benefitsSection}>
        <h2>Pourquoi donner son sang ?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>✅</div>
            <h3>100% Gratuit</h3>
            <p>Aucun frais, aucune charge</p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🔒</div>
            <h3>Entièrement Sécurisé</h3>
            <p>Équipement stérile et procédures médicales strictes</p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>😊</div>
            <h3>Rapide & Simple</h3>
            <p>Seulement 10 minutes pour sauver 3 vies</p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🏆</div>
            <h3>Récompenses</h3>
            <p>Badges et certificats de reconnaissance</p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🌍</div>
            <h3>Impact Global</h3>
            <p>Aide immédiatement des patients en besoin</p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📱</div>
            <h3>Plateforme Moderne</h3>
            <p>Gestion en ligne de vos rendez-vous</p>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className={styles.testimonialsSection}>
        <h2>Témoignages</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"Donner mon sang a changé ma perception du bénévolat. C'est simple et vraiment utile."</p>
            <p className={styles.author}>— Ahmed K., Donneur</p>
          </div>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"Grâce aux donneurs, j'ai pu recevoir un traitement vital. Merci à tous."</p>
            <p className={styles.author}>— Fatima B., Patiente</p>
          </div>
          <div className={styles.testimonial}>
            <p className={styles.quote}>"SaveLife a rendu la gestion des stocks beaucoup plus efficace."</p>
            <p className={styles.author}>— Dr. Ali, Médecin Hôpital</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.ctaSection}>
        <h2>Prêt à sauver des vies ?</h2>
        <p>Rejoignez des milliers de donneurs qui font la différence</p>
        <Link to="/donor/inscription" className={styles.ctaBtn}>
          Commencer l'Inscription
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>SaveLife</h4>
            <p>La plateforme de don de sang la plus moderne</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liens</h4>
            <Link to="/about">À propos</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Légal</h4>
            <Link to="/mentions">Mentions légales</Link>
            <Link to="/privacy">Confidentialité</Link>
            <Link to="/terms">Conditions</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: contact@savelife.tn</p>
            <p>Tel: +216 71 234 567</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 SaveLife. Tous droits réservés.</p>
        </div>
      </footer>

      {/* CHATBOT FLOTTANT */}
      <div className={styles.chatbotContainer}>
        <button
          className={styles.chatbotBtn}
          onClick={() => setChatOpen(!chatOpen)}
        >
          💬
        </button>
        {chatOpen && (
          <div className={styles.chatbotBox}>
            <div className={styles.chatbotHeader}>
              <h4>SaveLife Bot</h4>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className={styles.chatbotMessages}>
              <p>Bonjour! 👋 Comment puis-je vous aider ?</p>
              <p className={styles.suggestion}>Quelques questions populaires:</p>
              <button className={styles.chatbotSuggestion}>Suis-je éligible ?</button>
              <button className={styles.chatbotSuggestion}>Où donner près de moi ?</button>
              <button className={styles.chatbotSuggestion}>Conseils avant don</button>
              <button className={styles.chatbotSuggestion}>Mes résultats</button>
            </div>
            <div className={styles.chatbotInput}>
              <input type="text" placeholder="Votre question..." />
              <button>Envoyer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
