import React, { useState, useEffect } from 'react';
import styles from './DonorDashboard.module.css';

// Interface qui correspond exactement à ton entité Donneur Java
interface Donneur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  groupeSanguin: string;
  dateNaissance: string;
  poids: number;
  adresse: string;
  badge: string;
  eligible: boolean;
  dons: Array<{
    id: number;
    dateDon: string;
    quantite: number;
    statut: string;
    lieu: string;
  }>;
}

export default function DonorDashboard() {
  const [donneur, setDonneur] = useState<Donneur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/donneurs/1')
      .then(response => {
        if (!response.ok) throw new Error("Donneur introuvable");
        return response.json();
      })
      .then((data: Donneur) => {
        setDonneur(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

const dons = donneur?.dons ?? [];
const totalDons = dons.length;

const dernierDon = dons.length > 0
  ? new Date(dons[dons.length - 1].dateDon).toLocaleDateString('fr-FR')
  : 'Aucun don';

const prochainDon = dons.length > 0
  ? (() => {
      const last = new Date(dons[dons.length - 1].dateDon);
      last.setMonth(last.getMonth() + 3);
      return last.toLocaleDateString('fr-FR');
    })()
  : 'Dès maintenant';

  const initiales = donneur
    ? `${donneur.nom[0]}${donneur.prenom[0]}`
    : '...';

  // États de chargement et erreur
  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>Chargement...</div>;
  if (error)   return <div style={{padding: '2rem', color: 'red'}}>Erreur : {error}</div>;
  if (!donneur) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mon Tableau de Bord</h1>
          <p className={styles.subtitle}>Suivi de vos dons et rendez-vous</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Profil Donneur */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{initiales}</div>
            <div>
              <h2 className={styles.profileName}>{donneur.prenom} {donneur.nom}</h2>
              <p className={styles.profileBlood}>
                Groupe sanguin : <span>{donneur.groupeSanguin ?? '-'}</span>
              </p>
              <p>Badge : <span>{donneur.badge ?? '-'}</span></p>
              <p>Éligible : <span>{donneur.eligible ? '✅ Oui' : '❌ Non'}</span></p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💉</div>
            <div>
              <div className={styles.statLabel}>Total de Dons</div>
              <div className={styles.statValue}>{totalDons}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <div className={styles.statLabel}>Dernier Don</div>
              <div className={styles.statValue}>{dernierDon}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div>
              <div className={styles.statLabel}>Prochain Don possible</div>
              <div className={styles.statValue}>{prochainDon}</div>
            </div>
          </div>
        </div>

        {/* Historique des dons */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Historique de Vos Dons</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Lieu</th>
                <th>Quantité (ml)</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {donneur.dons && donneur.dons.length > 0 ? (
                donneur.dons.map(don => (
                  <tr key={don.id}>
                    <td>{new Date(don.dateDon).toLocaleDateString('fr-FR')}</td>
                    <td>{don.lieu ?? '-'}</td>
                    <td>{don.quantite ?? '-'}</td>
                    <td>
                      <span className={
                        don.statut === 'VALIDE'
                          ? styles.tagSuccess
                          : styles.tagSecondary
                      }>
                        {don.statut}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{textAlign: 'center', padding: '1rem'}}>
                    Aucun historique de don disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className={styles.actionsGrid}>
          <button className={styles.btnPrimary}>📋 Prendre un Rendez-vous</button>
          <button className={styles.btnSecondary}>🏥 Centres de Collecte</button>
          <button className={styles.btnSecondary}>❓ Questions FAQ</button>
        </div>
      </div>
    </div>
  );
}