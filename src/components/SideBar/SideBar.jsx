import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvide';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { IoClose } from 'react-icons/io5';
import LogIn from '../ContentSideBar/Login/Login';
import Compare from '../ContentSideBar/Compare/Compare';
function SideBar() {
  const { container, overlay, sideBar, slideSideBar, boxIcon } = styles;
  const { isOpen, setIsOpen, type } = useContext(SideBarContext);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleRenderContent = () => {
    switch (type) {
      case 'login':
        return <LogIn />;
      case 'compare':
        return <Compare />;
        z;
      case 'wishlist':
        return 'wishlist';
      case 'cart':
        return 'cart';
      default:
        break;
    }
  };
  return (
    <div className={container}>
      <div
        className={classNames({
          [overlay]: isOpen,
        })}
        onClick={handleToggle}
      />

      <div
        className={classNames(sideBar, {
          [slideSideBar]: isOpen,
        })}
      >
        {isOpen && (
          <div className={boxIcon} onClick={handleToggle}>
            <IoClose />
          </div>
        )}
        {handleRenderContent()}
      </div>
    </div>
  );
}

export default SideBar;
