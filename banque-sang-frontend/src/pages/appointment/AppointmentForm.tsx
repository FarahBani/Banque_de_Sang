import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppointmentForm.module.css';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    bloodType: 'O+',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simule la soumission
    navigate('/appointment/confirmation', { state: formData });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Prendre un Rendez-vous</h1>
        <p className={styles.subtitle}>Remplissez le formulaire pour fixer votre rendez-vous de don</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nom Complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Votre nom"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+216 XX XXX XXX"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Groupe Sanguin</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Heure</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.btn}>Confirmer le Rendez-vous</button>
        </form>
      </div>
    </div>
  );
}
