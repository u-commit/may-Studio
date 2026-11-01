import { ADMIN_NAV_ITEMS } from '../constants';
import styles from '../styles.module.scss';
import componentStyles from './styles.module.scss';

function AdminSidebar({ activePage, onNavigate }) {
  return (
    <aside className={`${styles.sidebar} ${componentStyles.sidebar}`}>
      <a href="/" className={styles.brand}><span className={styles.brandMark}>m.</span><span>MÂY <small>STUDIO ADMIN</small></span></a>
      <span className={styles.navCaption}>MENU QUẢN TRỊ</span>
      <nav>
        {ADMIN_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.navItem} ${activePage === id ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon aria-hidden="true" />{label}
          </button>
        ))}
      </nav>
      <div className={styles.sidebarFooter}><span className={styles.avatar}>MA</span><span><strong>Mai Anh</strong><small>Quản trị viên</small></span></div>
    </aside>
  );
}

export default AdminSidebar;
