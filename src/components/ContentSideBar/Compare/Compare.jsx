import HeaderSideBar from '../components/HeaderSideBar/HeaderSideBar';
import { TbShirt } from 'react-icons/tb';
import styles from './styles.module.scss';
import ItemProduct from '../components/itemProduct/itemProduct';
function Compare() {
  const { container } = styles;
  return (
    <div className={container}>
      <HeaderSideBar
        icon={<TbShirt style={{ fontSize: '30px' }} />}
        title='Match Your Style'
      />
      <ItemProduct />
    </div>
  );
}

export default Compare;
