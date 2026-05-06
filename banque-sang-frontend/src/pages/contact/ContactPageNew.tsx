import { useState } from 'react';
import styles from './ContactPageNew.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
}

export default function ContactPageNew() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.subject) newErrors.subject = 'Le sujet est requis';
    if (!formData.message) newErrors.message = 'Le message est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Submitting contact form:', formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
      });
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>📞 Nous Contacter</h1>
        <p className={styles.heroSubtitle}>
          Nous sommes ici pour répondre à vos questions et vos préoccupations
        </p>
      </section>

      <div className={styles.container}>
        <div className={styles.contentGrid}>
          {/* CONTACT INFO */}
          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Informations de Contact</h2>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📍</div>
              <h3>Adresse</h3>
              <p>123 Avenue Habib Bourguiba<br/>1000 Tunis, Tunisie</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📞</div>
              <h3>Téléphone</h3>
              <p>+216 71 123 456<br/><small>Lun-Ven: 09h-18h</small></p>
              <p>+216 71 987 654<br/><small>24/7 Urgences</small></p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>✉️</div>
              <h3>Email</h3>
              <p>contact@savelife.tn<br/>support@savelife.tn</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>🕐</div>
              <h3>Horaires</h3>
              <p>Lun-Ven: 09h00 - 18h00<br/>Sam: 10h00 - 14h00<br/>Dim: Fermé</p>
            </div>

            {/* SOCIAL MEDIA */}
            <div className={styles.socialSection}>
              <h3>Suivez-nous</h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} title="Facebook">f</a>
                <a href="#" className={styles.socialLink} title="Twitter">𝕏</a>
                <a href="#" className={styles.socialLink} title="LinkedIn">in</a>
                <a href="#" className={styles.socialLink} title="Instagram">📸</a>
              </div>
            </div>
          </section>

          {/* CONTACT FORM */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Envoyez-nous un Message</h2>

            {submitted && (
              <div className={styles.successMessage}>
                ✓ Message envoyé avec succès! Nous vous répondrons dans les 24 heures.
              </div>
            )}

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nom Complet *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.formRow}>
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

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Catégorie *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">Demande Générale</option>
                    <option value="support">Support Technique</option>
                    <option value="feedback">Retour/Suggestion</option>
                    <option value="partnership">Partenariat</option>
                    <option value="media">Médias</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Sujet *</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Sujet du message"
                    className={errors.subject ? styles.inputError : ''}
                  />
                  {errors.subject && <span className={styles.error}>{errors.subject}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Votre message détaillé..."
                  rows={6}
                  className={errors.message ? styles.inputError : ''}
                />
                {errors.message && <span className={styles.error}>{errors.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn}>
                📨 Envoyer le Message
              </button>
            </form>

            <div className={styles.formInfo}>
              <p>💡 Nous vous répondrons dans les 24 heures. Pour les urgences médicales, appelez le +216 71 987 654</p>
            </div>
          </section>
        </div>
      </div>

      {/* DEPARTMENTS */}
      <section className={styles.departmentsSection}>
        <h2 className={styles.sectionTitle}>Nos Départements</h2>
        <div className={styles.departmentsGrid}>
          <div className={styles.department}>
            <h4>🏥 Support Médical</h4>
            <p>Questions sur votre santé ou l'éligibilité</p>
            <p>medical@savelife.tn</p>
          </div>

          <div className={styles.department}>
            <h4>💻 Support Technique</h4>
            <p>Problèmes avec l'application ou le site</p>
            <p>tech@savelife.tn</p>
          </div>

          <div className={styles.department}>
            <h4>🤝 Partenariats</h4>
            <p>Intégrations hôpitaux et centres</p>
            <p>partnerships@savelife.tn</p>
          </div>

          <div className={styles.department}>
            <h4>📰 Relations Médias</h4>
            <p>Interviews et communications</p>
            <p>media@savelife.tn</p>
          </div>

          <div className={styles.department}>
            <h4>📊 Ressources Humaines</h4>
            <p>Opportunités de carrière</p>
            <p>hr@savelife.tn</p>
          </div>

          <div className={styles.department}>
            <h4>⚖️ Légal & Conformité</h4>
            <p>Questions légales et réglementaires</p>
            <p>legal@savelife.tn</p>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>Localisation</h2>
        <div className={styles.mapContainer}>
          <iframe
            title="SaveLife Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3235.0832892765576!2d10.181517!3d36.806504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzYuODA2NTA0LCAxMC4xODE1MTc!5e0!3m2!1sen!2stn!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: 'var(--radius)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Questions Fréquentes</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4>🕐 Quels sont vos horaires de contact?</h4>
            <p>Nous sommes disponibles du lundi au vendredi de 9h à 18h. Pour les urgences, appelez notre ligne 24/7.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>⏱️ Combien de temps pour une réponse?</h4>
            <p>Nous répondons généralement dans les 24 heures. Les urgences médicales sont traitées en priorité.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>🌍 Comment puis-je accéder à SaveLife?</h4>
            <p>SaveLife est disponible 24/7 sur notre site web et notre application mobile pour iOS et Android.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>🔒 Comment signalez-vous un problème de sécurité?</h4>
            <p>Contactez notre équipe de sécurité à security@savelife.tn avec les détails du problème.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>📝 Je souhaite écrire un article sur SaveLife</h4>
            <p>Contactez notre département relations médias à media@savelife.tn pour discuter des opportunités.</p>
          </div>

          <div className={styles.faqItem}>
            <h4>💼 Comment puis-je rejoindre SaveLife?</h4>
            <p>Consultez notre page carrières ou envoyez votre CV à hr@savelife.tn pour les opportunités actuelles.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
