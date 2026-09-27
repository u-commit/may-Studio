import styles from './styles.module.scss';
import itemImage from '../../assets/images/Item.jpg';
import hoverItemImage from '../../assets/images/Item2.1.jpg';

function ProductItem() {
  const { boxImg, showImgWhenHover } = styles;
  return (
    <div>
      <div className={boxImg}>
        <img src={itemImage} alt='' />
        <img src={hoverItemImage} alt='' className={showImgWhenHover} />
      </div>
    </div>
  );
}

export default ProductItem;
