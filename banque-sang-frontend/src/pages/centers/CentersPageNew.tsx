import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { centreDonApi } from '../../api/centreDonApi';
import type { CentreDon } from '../../types/CentreDon';
import styles from './CentersPageNew.module.css';

interface Center {
  id: number;
  name: string;
  address: string;
  phone: string;
  horaires: string;
  services: string[];
  isActive: boolean;
}

const toCenter = (centre: CentreDon): Center => ({
  id: centre.id,
  name: centre.nom,
  address: centre.adresse?.trim() || 'Adresse non renseignee',
  phone: centre.telephone?.trim() || 'Telephone non renseigne',
  horaires: centre.horaires?.trim() || 'Horaires non renseignes',
  services: ['Don de sang', 'Plasma', 'Plaquettes'],
  isActive: Boolean(centre.actif),
});

export default function CentersPageNew() {
  const [centersData, setCentersData] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConvention, setSelectedConvention] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  useEffect(() => {
    const loadCentresDon = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const centres = await centreDonApi.getAll();
        setCentersData(centres.map(toCenter));
      } catch {
        setErrorMessage("Impossible de charger les centres. Verifiez que le backend est demarre.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCentresDon();
  }, []);

  const filteredCenters = useMemo(() => {
    return centersData.filter(center => {
      const matchesSearch =
        searchTerm === '' ||
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesConvention =
        selectedConvention === '' ||
        (selectedConvention === 'true' && center.isActive) ||
        (selectedConvention === 'false' && !center.isActive);

      return matchesSearch && matchesConvention;
    });
  }, [centersData, searchTerm, selectedConvention]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedConvention('');
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>🏥 Nos Centres de Collecte</h1>
        <p className={styles.headerSubtitle}>
          Trouvez le centre le plus proche de vous et venez donner votre sang
        </p>
      </header>

      {/* SEARCH AND FILTERS */}
      <section className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Rechercher par nom ou adresse..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="convention">Statut:</label>
            <select
              id="convention"
              value={selectedConvention}
              onChange={e => setSelectedConvention(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tous</option>
              <option value="true">Centres actifs</option>
              <option value="false">Centres inactifs</option>
            </select>
          </div>

          {(searchTerm || selectedConvention) && (
            <button onClick={resetFilters} className={styles.btnReset}>
              ✕ Effacer les filtres
            </button>
          )}
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grille
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            ☰ Liste
          </button>
        </div>
      </section>

      {/* RESULTS COUNT */}
      <section className={styles.resultsSection}>
        <p className={styles.resultsCount}>
          {isLoading
            ? 'Chargement des centres...'
            : `${filteredCenters.length} centre${filteredCenters.length !== 1 ? 's' : ''} trouve${filteredCenters.length !== 1 ? 's' : ''}`}
        </p>
      </section>

      {/* CENTERS DISPLAY */}
      <section className={`${styles.centersSection} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
        {errorMessage ? (
          <div className={styles.noResults}>
            <p className={styles.noResultsIcon}>⚠️</p>
            <p className={styles.noResultsText}>{errorMessage}</p>
          </div>
        ) : isLoading ? (
          <div className={styles.noResults}>
            <p className={styles.noResultsIcon}>⏳</p>
            <p className={styles.noResultsText}>Chargement en cours...</p>
          </div>
        ) : filteredCenters.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.centersGrid : styles.centersList}>
            {filteredCenters.map(center => (
              <div key={center.id} className={styles.centerCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.centerName}>{center.name}</h3>
                  <span className={styles.cityBadge}>
                    {center.isActive ? 'Centre actif' : 'Centre inactif'}
                  </span>
                </div>

                <div className={styles.centerDetails}>
                  <div className={styles.detail}>
                    <span className={styles.detailIcon}>📍</span>
                    <div>
                      <p className={styles.detailLabel}>Adresse</p>
                      <p className={styles.detailValue}>{center.address}</p>
                    </div>
                  </div>

                  <div className={styles.detail}>
                    <span className={styles.detailIcon}>📞</span>
                    <div>
                      <p className={styles.detailLabel}>Téléphone</p>
                      <p className={styles.detailValue}>{center.phone}</p>
                    </div>
                  </div>

                  <div className={styles.detail}>
                    <span className={styles.detailIcon}>🕒</span>
                    <div>
                      <p className={styles.detailLabel}>Horaires</p>
                      <p className={styles.detailValue}>{center.horaires}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.servicesList}>
                  <p className={styles.servicesLabel}>Services disponibles:</p>
                  <div className={styles.serviceTags}>
                    {center.services.map((service, idx) => (
                      <span key={idx} className={styles.serviceTag}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <Link to="/appointment/new" className={styles.btnAppointment}>
                    📅 Prendre RDV
                  </Link>
                  <button className={styles.btnInfo} onClick={() => {
                    alert(`${center.name}\n${center.address}\n\nTelephone: ${center.phone}\nHoraires: ${center.horaires}`);
                  }}>
                    ℹ️ Plus d'info
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p className={styles.noResultsIcon}>🔍</p>
            <p className={styles.noResultsText}>
              Aucun centre ne correspond à votre recherche
            </p>
            <button onClick={resetFilters} className={styles.btnResetNoResults}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* INFO SECTION */}
      <section className={styles.infoSection}>
        <h2 className={styles.infoTitle}>Informations Pratiques</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>⏱️</div>
            <h3>Durée</h3>
            <p>Un don prend environ 30 à 45 minutes au total. Le prélèvement lui-même dure 10 à 15 minutes.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎁</div>
            <h3>Avantages</h3>
            <p>Vous recevrez une collation après le don et un certificat officiel de donneur de sang.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>👥</div>
            <h3>Équipe</h3>
            <p>Nos équipes médicales qualifiées vous accueilleront dans un environnement sûr et stérile.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🔄</div>
            <h3>Fréquence</h3>
            <p>Vous pouvez donner votre sang jusqu'à 4 fois par an, avec un intervalle minimum de 8 semaines.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <h2>Pas Sûr de Votre Éligibilité?</h2>
        <p>Consultez notre page dédiée pour connaître toutes les conditions requises</p>
        <Link to="/don" className={styles.ctaLink}>
          📋 Vérifier mon éligibilité
        </Link>
      </section>
    </div>
  );
}
