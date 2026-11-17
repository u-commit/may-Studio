import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../contexts/useAuth';
import { SideBarContext } from '../../../contexts/SideBarProvide';
import styles from './styles.module.scss';
const { module } = styles;

function Account() {
  const { user, signOut } = useAuth();
  const { setIsOpen } = useContext(SideBarContext);
  const navigate = useNavigate();
  const name =
    user?.name ??
    user?.fullName ??
    user?.username ??
    user?.email ??
    'Khách hàng';
  const Identifier = user?.email ?? user?.username ?? '';

  function handleSignOut() {
    signOut();
    setIsOpen(false);
    navigate('/');
  }
  const { account, avatar, eyebrow, identifier, status, signOutButton } =
    styles;
  return (
    <section className={account}>
      <div className={avatar}>
        <FiUser />
      </div>
      <p className={eyebrow}>TÀI KHOẢN KHÁCH HÀNG</p>
      <h2>{name}</h2>
      {Identifier && <p className={identifier}>{Identifier}</p>}
      <span className={status}>Đang hoạt động</span>
      <button className={signOutButton} type='button' onClick={handleSignOut}>
        <FiLogOut /> Đăng xuất
      </button>
    </section>
  );
}

export default Account;
