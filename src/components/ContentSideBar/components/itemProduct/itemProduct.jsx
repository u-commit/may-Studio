import styles from './styles.module.scss';
import { IoIosClose } from 'react-icons/io';
function ItemProduct() {
  const { boxConTent, container, title, price, boxClose } = styles;
  return (
    <div className={container}>
      <img
        src='https://xstore.8theme.com/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-2.1-min.jpg'
        alt=''
      />
      <div className={boxClose}>
        <IoIosClose style={{ fontSize: '25px', color: 'c1c1c1' }} />
      </div>
      <div className={boxConTent}>
        <div className={title}>title</div>
        <div className={price}>Price</div>
      </div>
    </div>
  );
}

export default ItemProduct;
