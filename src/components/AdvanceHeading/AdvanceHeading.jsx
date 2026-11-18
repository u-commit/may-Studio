import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
const { module } = styles;
function AdvanceHeading() {
  const { container, headline, containerMiddleBox, des, title } = styles;
  return (
    <MainLayout>
      <div className={container}>
        <div className={headline}></div>
        <div className={containerMiddleBox}>
          <p className={des}>Ưu đãi không thể bỏ lỡ</p>
          <p className={title}>Sản phẩm nổi bật </p>
        </div>
        <div className={headline}></div>
      </div>
    </MainLayout>
  );
}

export default AdvanceHeading;
