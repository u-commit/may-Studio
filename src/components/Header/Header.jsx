import BoxIcon from './Boxicon/Boxicon';
import { dataBoxicon, dataMenu } from './constants';
import Menu from './Menu/Menu';
import styles from './styles.module.scss';
const { module } = styles;
import logo from '@icons/images/logo.png';
import { TfiReload } from 'react-icons/tfi';
import { CiHeart } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import useScrollHandling from '../../hoocks/useScrollHanding';
import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SideBarContext } from '../../contexts/SideBarProvide';
import SearchOverlay from './SearchOverlay/SearchOverlay';
import { CART_EVENT, CART_STORAGE_KEY, getCartItems } from '@/utils/cartStore';

function getCartCount(items) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function MyHeader({ products = [], categories = [], search = '', category = 'all', onSearch, transparent = true }) {
  const {
    containerBoxIcon,
    containerMenu,
    containerHeader,
    containerBox,
    container,
    topheader,
    fixHeader,
    heroHeader,
    solidHeader,
    brandLogo,
    utilityIcons,
    rightMenu,
  } = styles;
  const { scrollPosition } = useScrollHandling();
  const [fixedPosition, setFixedPosition] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCartCount(getCartItems()));
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
  useEffect(() => {
    const handleCartChange = (event) => {
      setCartCount(
        getCartCount(Array.isArray(event.detail) ? event.detail : getCartItems())
      );
    };
    const handleStorage = (event) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        setCartCount(getCartCount(getCartItems()));
      }
    };

    window.addEventListener(CART_EVENT, handleCartChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CART_EVENT, handleCartChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  return (
    <>
    <div
      className={classNames(container, {
        [topheader]: transparent,
        [fixHeader]: fixedPosition,
        [heroHeader]: transparent && !fixedPosition,
        [solidHeader]: !transparent && !fixedPosition,
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
          <img src={logo} alt='Mây Studio' className={brandLogo} />
        </div>
        <div className={containerBox}>
          <div className={`${containerMenu} ${rightMenu}`}>
            {dataMenu.slice(3, dataMenu.length).map((item) => {
              return <Menu content={item.content} href={item.href} onSearchClick={() => setSearchOpen(true)} />;
            })}
          </div>
          <div className={`${containerBoxIcon} ${utilityIcons}`}>
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
            <button
              type='button'
              className={styles.cartIconButton}
              aria-label={`Giỏ hàng (${cartCount} sản phẩm)`}
              onClick={() => handleOpenSideBar('cart')}
            >
              <PiShoppingCartThin style={{ fontSize: '25px' }} />
              {cartCount > 0 && (
                <span className={styles.cartBadge} aria-hidden='true'>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    <SearchOverlay
      open={searchOpen}
      products={products}
      categories={categories}
      currentSearch={search}
      currentCategory={category}
      onClose={() => setSearchOpen(false)}
      onSearch={(query, selectedCategory) => {
        onSearch?.(query, selectedCategory);
        setSearchOpen(false);
      }}
    />
    </>
  );
}

export default MyHeader;
