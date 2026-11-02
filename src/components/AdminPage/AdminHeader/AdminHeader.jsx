import styles from './styles.module.scss';

function AdminHeader({ pageTitle }) {
  const { topbar } = styles;
  return (
    <header className={topbar}>
      <strong>{pageTitle}</strong>
      <a href='/'>Về trang chủ</a>
    </header>
  );
}
export default AdminHeader;
