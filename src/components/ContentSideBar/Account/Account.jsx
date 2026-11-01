import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../contexts/useAuth';
import { SideBarContext } from '../../../contexts/SideBarProvide';
import styles from './styles.module.scss';

function Account() {
  const { user, signOut } = useAuth();
  const { setIsOpen } = useContext(SideBarContext);
  const navigate = useNavigate();
  const name = user?.name ?? user?.fullName ?? user?.username ?? user?.email ?? 'Khách hàng';
  const identifier = user?.email ?? user?.username ?? '';

  function handleSignOut() {
    signOut();
    setIsOpen(false);
    navigate('/');
  }

  return (
    <section className={styles.account}>
      <div className={styles.avatar}><FiUser /></div>
      <p className={styles.eyebrow}>TÀI KHOẢN KHÁCH HÀNG</p>
      <h2>{name}</h2>
      {identifier && <p className={styles.identifier}>{identifier}</p>}
      <span className={styles.status}>Đang hoạt động</span>
      <button className={styles.signOutButton} type="button" onClick={handleSignOut}>
        <FiLogOut /> Đăng xuất
      </button>
    </section>
  );
}

export default Account;
