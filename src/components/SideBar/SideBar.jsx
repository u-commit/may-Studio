import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvide';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { IoClose } from 'react-icons/io5';
import LogIn from '../ContentSideBar/Login/Login';
function SideBar() {
  const { container, overlay, sideBar, slideSideBar, boxIcon } = styles;
  const { isOpen, setIsOpen } = useContext(SideBarContext);
  const handleToggle = () => {
    setIsOpen(!isOpen);
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
        <LogIn />
      </div>
    </div>
  );
}

export default SideBar;
