import { useContext } from 'react';
import styles from '../styles.module.scss';
import { SideBarContext } from '../../../contexts/SideBarProvide';
import { useAuth } from '../../../contexts/useAuth';
import { FiUser } from 'react-icons/fi';

function Menu({ content, href, onSearchClick }) {
  const { menu, accountMenu, accountAvatar } = styles;
  const { setIsOpen, setType } = useContext(SideBarContext);
  const { user } = useAuth();
  const isAccountMenu = content?.trim().toLowerCase() === 'sign in';
  const isCustomerAccount = isAccountMenu && Boolean(user);
  const isSearchMenu = content?.trim().toLowerCase() === 'search';
  const handleClickShowLogin = () => {
    if (isSearchMenu) {
      onSearchClick?.();
      return;
    }
    if (isAccountMenu) {
      setIsOpen(true);
      setType(user ? 'account' : 'login');
    }
  };
  return (
    <div
      className={`${menu} ${isCustomerAccount ? accountMenu : ''}`}
      onClick={handleClickShowLogin}
      role={isCustomerAccount ? 'button' : undefined}
      tabIndex={isCustomerAccount ? 0 : undefined}
      aria-label={isCustomerAccount ? 'Tài khoản khách hàng' : undefined}
      onKeyDown={(event) => {
        if (isCustomerAccount && (event.key === 'Enter' || event.key === ' ')) handleClickShowLogin();
      }}
    >
      {isCustomerAccount ? <span className={accountAvatar}><FiUser /></span> : content}
    </div>
  );
}

export default Menu;
