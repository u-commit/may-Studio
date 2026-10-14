import styles from './styles.module.scss';
import { CiShoppingCart } from 'react-icons/ci';
import HeaderSideBar from '../components/HeaderSideBar/HeaderSideBar';
import ItemProduct from '../components/itemProduct/itemProduct';
import Button from '../../Button/Button';
function Cart() {
  const { container, boxIcon, title } = styles;
  return (
    <div className={container}>
      <div>
        {' '}
        <HeaderSideBar
          icon={<CiShoppingCart style={{ fontSize: '30px' }} />}
          title='Cart'
        />
        <ItemProduct />
      </div>
      <div>
        <div className={title}>
          <p>SubTotal:</p>
          <p>$199.99</p>
        </div>
        <div className={boxIcon}>
          <Button content={''} />
          <Button content={''} isPrimary={false} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
