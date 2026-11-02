import { ADMIN_NAV_ITEMS } from '../constants';
import styles from './styles.module.scss';

function AdminSidebar({ activePage, onNavigate }) {
  const {
    brand,
    sidebar,
    navCaption,
    navItem,
    navItemActive,
    sidebarFooter,
    avatar,
  } = styles;
  return (
    <aside className={sidebar}>
      <a href='/' className={brand}>
        <span>MÂY STUDIO ADMIN</span>
      </a>
      <span className={navCaption}>MENU QUẢN TRỊ</span>
      <nav>
        {ADMIN_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type='button'
            className={[navItem, activePage === id && navItemActive]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onNavigate(id)}
          >
            <Icon aria-hidden='true' />
            {label}
          </button>
        ))}
      </nav>
      <div className={sidebarFooter}>
        <span className={avatar}>MA</span>
        <span>
          <strong>Mai Anh</strong>
          <small>Quản trị viên</small>
        </span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
