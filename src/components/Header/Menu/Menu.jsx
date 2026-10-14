import { useContext } from 'react';
import styles from '../styles.module.scss';
import { SideBarContext } from '../../../contexts/SideBarProvide';

function Menu({ content, href }) {
  const { menu } = styles;
  const { setIsOpen, setType } = useContext(SideBarContext);
  const handleClickShowLogin = () => {
    if (content?.trim().toLowerCase() === 'sign in') {
      setIsOpen(true);
      setType('login');
    }
  };
  return (
    <div className={menu} onClick={handleClickShowLogin}>
      {content}
    </div>
  );
}

export default Menu;
