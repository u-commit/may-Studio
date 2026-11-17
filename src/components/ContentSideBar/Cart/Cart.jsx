import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
const { module } = styles;
import { CiShoppingCart } from 'react-icons/ci';
import HeaderSideBar from '../components/HeaderSideBar/HeaderSideBar';
import ItemProduct from '../components/itemProduct/itemProduct';
import Button from '../../Button/Button';
import { SideBarContext } from '@/contexts/SideBarProvide';
import { CART_EVENT, getCartItems } from '@/utils/cartStore';

function formatPrice(value) {
  return `${(Number(value) || 0).toLocaleString('vi-VN')} ₫`;
}

function Cart() {
  const { container, boxIcon, title, emptyCart, cartItems, subtotal } = styles;
  const [items, setItems] = useState(getCartItems);
  const { setIsOpen } = useContext(SideBarContext);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0),
    [items]
  );

  useEffect(() => {
    const refresh = (event) => setItems(Array.isArray(event.detail) ? event.detail : getCartItems());
    const handleStorage = (event) => {
      if (event.key === 'may-studio-cart' || event.key === null) setItems(getCartItems());
    };
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const continueShopping = () => setIsOpen(false);

  return (
    <div className={container}>
      <div>
        <HeaderSideBar
          icon={<CiShoppingCart style={{ fontSize: '30px' }} />}
          title={`Giỏ hàng (${items.reduce((sum, item) => sum + item.quantity, 0)})`}
        />
        {items.length === 0 ? (
          <p className={emptyCart}>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className={cartItems}>
            {items.map((item) => <ItemProduct key={item.id} item={item} />)}
          </div>
        )}
      </div>
      <div>
        <div className={title}>
          <p>Tạm tính:</p>
          <p className={subtotal}>{formatPrice(total)}</p>
        </div>
        <div className={boxIcon}>
          <Button content='Xem giỏ hàng' onClick={continueShopping} />
          <Button content='Tiếp tục mua sắm' isPrimary={false} onClick={continueShopping} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
