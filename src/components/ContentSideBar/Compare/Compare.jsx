import HeaderSideBar from '../components/HeaderSideBar/HeaderSideBar';
import { TbShirt } from 'react-icons/tb';
import styles from './styles.module.scss';
import ItemProduct from '../components/itemProduct/itemProduct';
import Button from '../../Button/Button';
function Compare() {
  const { container, boxContent, boxIcon } = styles;
  return (
    <div className={container}>
      <div className={boxContent}>
        <HeaderSideBar
          icon={<TbShirt style={{ fontSize: '30px' }} />}
          title='Match Your Style'
        />
        <ItemProduct />
      </div>

      <div className={boxIcon}>
        <Button content={'Match & Compare'} />
      </div>
    </div>
  );
}

export default Compare;
