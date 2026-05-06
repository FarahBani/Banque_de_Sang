import { NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => isActive ? styles.active : ''}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/stocks"
          className={({ isActive }) => isActive ? styles.active : ''}
        >
          Stocks
        </NavLink>
        <NavLink
          to="/admin/donneurs"
          className={({ isActive }) => isActive ? styles.active : ''}
        >
          Donneurs
        </NavLink>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
