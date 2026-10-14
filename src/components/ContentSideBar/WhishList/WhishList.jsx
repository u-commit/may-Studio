import HeaderSideBar from '../components/HeaderSideBar/HeaderSideBar';
import { CiHeart } from 'react-icons/ci';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
function WhisList() {
  const { container, boxContent, boxIcon } = styles;
  return (
    <div className={container}>
      <div className={boxContent}>
        <HeaderSideBar
          icon={<CiHeart style={{ fontSize: '30px' }} />}
          title='My Favorites'
        />
      </div>
      <div className={boxIcon}>
        <Button content={'Match & Compare'} />
        <Button content={'Add Set to Cart'} isPrimary={false} />
      </div>
    </div>
  );
}

export default WhisList;
