import { useState } from 'react';
import styles from './AboutPageNew.module.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
  icon: string;
}

const teamMembers: TeamMember[] = [
  { id: 1, name: 'Dr. Karim Messaoud', role: 'Co-Fondateur & Directeur Général', specialty: 'Hématologue', icon: '👨‍⚕️' },
  { id: 2, name: 'Samira Ben Slimane', role: 'Directrice Médicale', specialty: 'Transfusiologue', icon: '👩‍⚕️' },
  { id: 3, name: 'Ahmed Oueslati', role: 'Directeur Technique', specialty: 'Ingénierie Logicielle', icon: '👨‍💻' },
  { id: 4, name: 'Fatima Gharbi', role: 'Responsable Opérations', specialty: 'Gestion Logistique', icon: '👩‍💼' },
];

export default function AboutPageNew() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>💉 Sauver des Vies, Ensemble</h1>
          <p className={styles.heroSubtitle}>
            SaveLife est la plateforme leader de gestion des dons de sang en Tunisie
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <p className={styles.statNum}>10,000+</p>
              <p className={styles.statLabel}>Donneurs Actifs</p>
            </div>
            <div className={styles.heroStat}>
              <p className={styles.statNum}>30,000+</p>
              <p className={styles.statLabel}>Vies Sauvées</p>
            </div>
            <div className={styles.heroStat}>
              <p className={styles.statNum}>120</p>
              <p className={styles.statLabel}>Centres Partenaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className={styles.section}>
        <div className={styles.contentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Notre Mission</h3>
            <p>
              Transformer le secteur du don de sang en Tunisie en créant une plateforme digitale
              innovante qui facilite la connexion entre donneurs volontaires et hôpitaux. Nous nous
              engageons à sauver des millions de vies par la donation régulière et responsable.
            </p>
          </div>

          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>🌟</div>
            <h3>Notre Vision</h3>
            <p>
              Devenir la plateforme de référence en Afrique du Nord pour la gestion des dons de sang,
              en utilisant la technologie pour garantir que chaque patient qui a besoin de sang peut
              y avoir accès rapidement et en toute sécurité.
            </p>
          </div>

          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>❤️</div>
            <h3>Nos Valeurs</h3>
            <p>
              <strong>Solidarité:</strong> Nous croyons en l'entraide humaine.<br/>
              <strong>Transparence:</strong> Traçabilité complète de chaque don.<br/>
              <strong>Innovation:</strong> Technologie au service de la santé.
            </p>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notre Historique</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}>📱</div>
            <div className={styles.timelineContent}>
              <h4>2024 - Création</h4>
              <p>SaveLife est fondée avec une vision claire: moderniser le don de sang en Tunisie</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}>🚀</div>
            <div className={styles.timelineContent}>
              <h4>2024 - Lancement Beta</h4>
              <p>Lancement de la plateforme avec 5 centres pilotes et les premiers 1000 donneurs</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}>📈</div>
            <div className={styles.timelineContent}>
              <h4>2025 - Expansion</h4>
              <p>Expansion à 50 centres partenaires et 5000+ donneurs actifs enregistrés</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}>🏆</div>
            <div className={styles.timelineContent}>
              <h4>2026 - Leader du Marché</h4>
              <p>Présence nationale avec 120 centres et 10000+ donneurs sauvant 30000+ vies</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notre Équipe</h2>
        <div className={styles.teamGrid}>
          {teamMembers.map(member => (
            <div
              key={member.id}
              className={styles.teamCard}
              onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
            >
              <div className={styles.teamAvatar}>{member.icon}</div>
              <h4>{member.name}</h4>
              <p className={styles.teamRole}>{member.role}</p>
              {expandedMember === member.id && (
                <p className={styles.teamSpecialty}>Spécialité: {member.specialty}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* WHY SAVELIFE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pourquoi Choisir SaveLife?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>⚡</div>
            <h4>Plateforme Rapide</h4>
            <p>Inscription simple en moins de 5 minutes. Prise de rendez-vous instantanée.</p>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🔒</div>
            <h4>100% Sécurisé</h4>
            <p>Données cryptées et conformes aux standards internationaux de santé.</p>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📍</div>
            <h4>Centres Partout</h4>
            <p>120 centres partenaires répartis sur tout le territoire tunisien.</p>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>👥</div>
            <h4>Communauté Active</h4>
            <p>Rejoignez 10,000+ donneurs qui font la différence chaque jour.</p>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📊</div>
            <h4>Suivi Transparent</h4>
            <p>Voyez l'impact de vos donations et les vies que vous sauvez.</p>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🎁</div>
            <h4>Récompenses</h4>
            <p>Gagnez des badges et certificats pour vos contributions.</p>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className={styles.impactSection}>
        <h2 className={styles.sectionTitle}>Notre Impact en Chiffres</h2>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>30,000+</div>
            <p>Vies Sauvées</p>
            <small>grâce aux donations coordonnées</small>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>150,000</div>
            <p>Litres de Sang</p>
            <small>collectés et distribués</small>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>50,000+</div>
            <p>Patients Aidés</p>
            <small>dans les hôpitaux partenaires</small>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>320</div>
            <p>Jours 24/7</p>
            <small>service continu toute l'année</small>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nos Partenaires</h2>
        <div className={styles.partnersGrid}>
          <div className={styles.partnerCard}>🏥 Ministère de la Santé</div>
          <div className={styles.partnerCard}>🏥 Hôpital Central Tunis</div>
          <div className={styles.partnerCard}>🏥 Université de Tunis El Manar</div>
          <div className={styles.partnerCard}>🏥 Ordre des Médecins Tunisiens</div>
          <div className={styles.partnerCard}>🏥 Croissant Rouge Tunisien</div>
          <div className={styles.partnerCard}>🏥 ONU Tunisie</div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2>Prêt à Faire la Différence?</h2>
        <p>Rejoignez notre communauté de donneurs et sauvez des vies</p>
        <a href="/donor/inscription" className={styles.ctaButton}>
          🎯 Devenir Donneur Maintenant
        </a>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Questions Fréquentes</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4>Qui peut devenir donneur?</h4>
            <p>Toute personne entre 18 et 65 ans en bonne santé peut devenir donneur. Consultez nos critères d'éligibilité détaillés.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>Combien gagne-t-on en donnant?</h4>
            <p>Le don de sang est bénévole et gratuit. Vous recevrez une collation et des badges de reconnaissance.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>Est-ce dangereux de donner son sang?</h4>
            <p>Non, le don de sang est complètement sûr. Une seule aiguille stérile est utilisée et nos équipes sont qualifiées.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>Combien de fois puis-je donner par an?</h4>
            <p>Vous pouvez donner jusqu'à 4 fois par an (hommes) ou 3 fois par an (femmes), avec au minimum 56 jours d'intervalle.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>Comment SaveLife protège mes données?</h4>
            <p>SaveLife utilise le chiffrement de bout en bout et respecte les normes RGPD et les standards de santé internationaux.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>Puis-je voir l'impact de mes dons?</h4>
            <p>Oui! Votre tableau de bord personnel affiche le nombre de vies sauvées grâce à vos contributions.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contactSection}>
        <h2>Nous Contacter</h2>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <div>
              <h4>Adresse</h4>
              <p>123 Avenue Habib Bourguiba, Tunis</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <div>
              <h4>Téléphone</h4>
              <p>+216 71 123 456 (24/7)</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <div>
              <h4>Email</h4>
              <p>contact@savelife.tn</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
