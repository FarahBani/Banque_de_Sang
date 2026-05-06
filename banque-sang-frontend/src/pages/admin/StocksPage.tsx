import { useEffect, useMemo, useState } from 'react';
import styles from './StocksPage.module.css';
import { stockApi } from '../../api/stockApi';
import { formatGroupe } from '../../utils/groupeSanguin';
import { calculerNiveau } from '../../types/Stock';
import type { Stock, NiveauStock } from '../../types/Stock';
import type { GroupeSanguin } from '../../types/Donneur';

const NIVEAU_MAP: Record<NiveauStock, { label: string; className: string }> = {
  OK: { label: 'Disponible', className: 'tagGreen' },
  FAIBLE: { label: 'Faible', className: 'tagOrange' },
  CRITIQUE: { label: 'Critique', className: 'tagRed' },
};

const ALL_GROUPES: GroupeSanguin[] = [
  'A_PLUS', 'A_MOINS',
  'B_PLUS', 'B_MOINS',
  'AB_PLUS', 'AB_MOINS',
  'O_PLUS', 'O_MOINS',
];

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState({
    groupeSanguin: 'O_PLUS' as GroupeSanguin,
    quantiteDisponible: 0,
    seuilMinimum: 10,
    localisation: '',
  });
  const [savingNew, setSavingNew] = useState(false);

  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getAll();
      setStocks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stocks;
    return stocks.filter((s) => {
      const formatted = formatGroupe(s.groupeSanguin).toLowerCase();
      return (
        formatted.includes(q) ||
        s.groupeSanguin.toLowerCase().includes(q) ||
        (s.localisation ?? '').toLowerCase().includes(q)
      );
    });
  }, [stocks, search]);

  const handleAdjust = async (stock: Stock, delta: number) => {
    try {
      await stockApi.ajusterQuantite(stock.id, delta);
      await fetchStocks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async (stock: Stock) => {
    if (!confirm(`Supprimer le stock ${formatGroupe(stock.groupeSanguin)} (${stock.quantiteDisponible} unités) ?`)) return;
    try {
      await stockApi.delete(stock.id);
      await fetchStocks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingNew(true);
      await stockApi.create({
        groupeSanguin: newStock.groupeSanguin,
        quantiteDisponible: Number(newStock.quantiteDisponible),
        seuilMinimum: Number(newStock.seuilMinimum),
        estCritique: 0,
        localisation: newStock.localisation || null,
      });
      setShowAddModal(false);
      setNewStock({
        groupeSanguin: 'O_PLUS',
        quantiteDisponible: 0,
        seuilMinimum: 10,
        localisation: '',
      });
      await fetchStocks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingNew(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStock) return;
    try {
      setSavingEdit(true);
      await stockApi.update(editingStock.id, {
        groupeSanguin: editingStock.groupeSanguin,
        quantiteDisponible: editingStock.quantiteDisponible,
        seuilMinimum: editingStock.seuilMinimum,
        localisation: editingStock.localisation,
        estCritique: editingStock.estCritique,
      });
      setEditingStock(null);
      await fetchStocks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingEdit(false);
    }
  };

  const totalUnits = stocks.reduce((sum, s) => sum + s.quantiteDisponible, 0);
  const stocksCritiques = stocks.filter((s) => calculerNiveau(s) === 'CRITIQUE').length;
  const stocksFaibles = stocks.filter((s) => calculerNiveau(s) === 'FAIBLE').length;
  const stocksOk = stocks.filter((s) => calculerNiveau(s) === 'OK').length;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestion des Stocks</h1>
        </div>
        <p style={{ padding: '2rem', textAlign: 'center' }}>Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestion des Stocks</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>❌ {error}</p>
          <button onClick={fetchStocks} className={styles.btnAdd}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestion des Stocks</h1>
          <p className={styles.subtitle}>Suivi des unités de sang disponibles</p>
        </div>
        <button className={styles.btnAdd} onClick={() => setShowAddModal(true)}>
          + Ajouter un stock
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>Total unités</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{totalUnits}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>🟢 Disponibles</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{stocksOk}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>🟡 Faibles</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{stocksFaibles}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>🔴 Critiques</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: stocksCritiques > 0 ? '#dc2626' : undefined }}>
            {stocksCritiques}
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Rechercher par groupe ou localisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        {filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Aucun stock {search && 'ne correspond à votre recherche'}.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Unités disponibles</th>
                <th>Seuil minimum</th>
                <th>Localisation</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock) => {
                const niveau = calculerNiveau(stock);
                const niveauInfo = NIVEAU_MAP[niveau];
                return (
                  <tr key={stock.id}>
                    <td>
                      <span className={styles.bloodBadge}>{formatGroupe(stock.groupeSanguin)}</span>
                    </td>
                    <td className={styles.units}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAdjust(stock, -1)}
                          disabled={stock.quantiteDisponible <= 0}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            cursor: stock.quantiteDisponible <= 0 ? 'not-allowed' : 'pointer',
                            opacity: stock.quantiteDisponible <= 0 ? 0.4 : 1,
                          }}
                        >
                          −
                        </button>
                        <strong style={{ minWidth: 60, textAlign: 'center' }}>
                          {stock.quantiteDisponible} unités
                        </strong>
                        <button
                          onClick={() => handleAdjust(stock, 1)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className={styles.date}>{stock.seuilMinimum ?? '—'}</td>
                    <td>{stock.localisation ?? '—'}</td>
                    <td>
                      <span className={`${styles.tag} ${styles[niveauInfo.className] ?? ''}`}>
                        {niveauInfo.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => setEditingStock({ ...stock })}>
                          Modifier
                        </button>
                        <button className={styles.btnDelete} onClick={() => handleDelete(stock)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreate}
            style={{ background: 'white', padding: '2rem', borderRadius: 12, minWidth: 400, maxWidth: 500 }}
          >
            <h2 style={{ marginTop: 0 }}>Ajouter un stock</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Groupe sanguin *</label>
              <select
                value={newStock.groupeSanguin}
                onChange={(e) => setNewStock({ ...newStock, groupeSanguin: e.target.value as GroupeSanguin })}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                {ALL_GROUPES.map((g) => (
                  <option key={g} value={g}>{formatGroupe(g)}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Quantité disponible (unités) *</label>
              <input
                type="number"
                min="0"
                value={newStock.quantiteDisponible}
                onChange={(e) => setNewStock({ ...newStock, quantiteDisponible: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Seuil minimum *</label>
              <input
                type="number"
                min="0"
                value={newStock.seuilMinimum}
                onChange={(e) => setNewStock({ ...newStock, seuilMinimum: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Localisation (optionnel)</label>
              <input
                type="text"
                value={newStock.localisation}
                onChange={(e) => setNewStock({ ...newStock, localisation: e.target.value })}
                placeholder="Ex: Frigo A"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={savingNew}
                style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={savingNew}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: savingNew ? 'not-allowed' : 'pointer',
                  opacity: savingNew ? 0.6 : 1,
                  fontWeight: 600,
                }}
              >
                {savingNew ? 'Création...' : 'Créer le stock'}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingStock && (
        <div
          onClick={() => setEditingStock(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEdit}
            style={{ background: 'white', padding: '2rem', borderRadius: 12, minWidth: 400, maxWidth: 500 }}
          >
            <h2 style={{ marginTop: 0 }}>Modifier le stock — {formatGroupe(editingStock.groupeSanguin)}</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Groupe sanguin *</label>
              <select
                value={editingStock.groupeSanguin}
                onChange={(e) => setEditingStock({ ...editingStock, groupeSanguin: e.target.value as GroupeSanguin })}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                {ALL_GROUPES.map((g) => (
                  <option key={g} value={g}>{formatGroupe(g)}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Quantité disponible *</label>
              <input
                type="number"
                min="0"
                value={editingStock.quantiteDisponible}
                onChange={(e) => setEditingStock({ ...editingStock, quantiteDisponible: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Seuil minimum *</label>
              <input
                type="number"
                min="0"
                value={editingStock.seuilMinimum ?? 10}
                onChange={(e) => setEditingStock({ ...editingStock, seuilMinimum: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Localisation</label>
              <input
                type="text"
                value={editingStock.localisation ?? ''}
                onChange={(e) => setEditingStock({ ...editingStock, localisation: e.target.value })}
                placeholder="Ex: Frigo A"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setEditingStock(null)}
                disabled={savingEdit}
                style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: savingEdit ? 'not-allowed' : 'pointer',
                  opacity: savingEdit ? 0.6 : 1,
                  fontWeight: 600,
                }}
              >
                {savingEdit ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}