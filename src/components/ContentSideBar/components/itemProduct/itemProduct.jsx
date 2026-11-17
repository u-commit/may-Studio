import styles from './styles.module.scss';
const { imagePlaceholder, module } = styles;
import { IoIosClose } from 'react-icons/io';
import { updateCartItemQuantity, removeCartItem } from '@/utils/cartStore';
function ItemProduct({ item }) {
  const { boxConTent, container, title, price, boxClose, size, sku } = styles;
  const { quantityControl, quantity } = styles;
  const formatPrice = (value) => `${(Number(value) || 0).toLocaleString('vi-VN')} ₫`;
  return (
    <div className={container}>
      {item.image ? <img src={item.image} alt={item.name} /> : <div className={imagePlaceholder}>MÂY</div>}
      <button className={boxClose} type='button' onClick={() => removeCartItem(item.id)} aria-label={`Xóa ${item.name} khỏi giỏ hàng`}>
        <IoIosClose style={{ fontSize: '25px', color: '#8b938b' }} />
      </button>
      <div className={boxConTent}>
        <div className={title}>{item.name}</div>
        {(item.color || item.size) && <div className={size}>{[item.color, item.size].filter(Boolean).join(' · ')}</div>}
        <div className={price}>{formatPrice(item.price)}</div>
        {item.sku && <div className={sku}>SKU: {item.sku}</div>}
        <div className={quantityControl} aria-label='Số lượng'>
          <button type='button' onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} aria-label='Giảm số lượng'>−</button>
          <span className={quantity}>{item.quantity}</span>
          <button type='button' onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} aria-label='Tăng số lượng'>+</button>
        </div>
      </div>
    </div>
  );
}

export default ItemProduct;
