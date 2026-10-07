import styles from './styles.module.scss';
import item1 from '../../assets/images/Item.jpg';
import item2 from '../../assets/images/Item2.1.jpg';
import Button from '@components/Button/Button';
function SalesHomePage() {
  const { container } = styles;
  return (
    <div className={container}>
      <div>
        <img src={item1} alt='Item 1' />
      </div>
      <div>
        <h2>Sales of The Year</h2>
        <p>
          Gói trọn sự nhẹ nhàng và thanh lịch trong từng đường may. Khám phá
          ngay những thiết kế yêu thích với mức giá ưu đãi đặc biệt.
        </p>
        <div>
          <Button content={'Shop Now '} />
        </div>
      </div>
      <div>
        <img src={item2} alt='Item 1' />
      </div>
    </div>
  );
}

export default SalesHomePage;
