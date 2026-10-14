import BoxIcon from './Boxicon/Boxicon';
import { dataBoxicon, dataMenu } from './constants';
import Menu from './Menu/Menu';
import styles from './styles.module.scss';
import logo from '@icons/images/logo.png';
import { TfiReload } from 'react-icons/tfi';
import { CiHeart } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import useScrollHandling from '../../hoocks/useScrollHanding';
import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SideBarContext } from '../../contexts/SideBarProvide';
function MyHeader() {
  const {
    containerBoxIcon,
    containerMenu,
    containerHeader,
    containerBox,
    container,
    topheader,
    fixHeader,
  } = styles;
  const { scrollPosition } = useScrollHandling();
  const [fixedPosition, setFixedPosition] = useState(false);
  const { setIsOpen, setType } = useContext(SideBarContext);
  const handleOpenSideBar = (type) => {
    setIsOpen(true);
    setType(type);
  };
  useEffect(() => {
    // if (scrollPosition > 100) {
    //   setFixedPosition(true);
    // } else {
    //   setFixedPosition(false);
    // }
    setFixedPosition(scrollPosition > 100);
  }, [scrollPosition]);
  return (
    <div
      className={classNames(container, topheader, {
        [fixHeader]: fixedPosition,
      })}
    >
      <div className={containerHeader}>
        <div className={containerBox}>
          <div className={containerBoxIcon}>
            {dataBoxicon.map((item) => {
              return <BoxIcon type={item.type} href={item.href} />;
            })}
          </div>
          <div className={containerMenu}>
            {dataMenu.slice(0, 3).map((item) => {
              return <Menu content={item.content} href={item.href} />;
            })}
          </div>
        </div>
        <div>
          <img
            src={logo}
            alt='logo'
            style={{ width: '153px', height: '53px' }}
          />
        </div>
        <div className={containerBox}>
          <div className={containerMenu}>
            {dataMenu.slice(3, dataMenu.length).map((item) => {
              return <Menu content={item.content} href={item.href} />;
            })}
          </div>
          <div className={containerBoxIcon}>
            <TfiReload
              style={{
                fontSize: '20px',
              }}
              onClick={() => handleOpenSideBar('compare')}
            />
            <CiHeart
              style={{
                fontSize: '25px',
              }}
              onClick={() => handleOpenSideBar('wishlist')}
            />
            <PiShoppingCartThin
              style={{
                fontSize: '25px',
              }}
              onClick={() => handleOpenSideBar('cart')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
