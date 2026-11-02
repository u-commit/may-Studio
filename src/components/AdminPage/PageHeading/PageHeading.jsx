import styles from './styles.module.scss';
import Button from '@components/Button/Button.jsx';
function PageHeading({ pageTitle, showAddProduct, onAddProduct }) {
  const { pageHeading, eyebrow, primaryButton } = styles;
  return (
    <div className={pageHeading}>
      <div>
        <span className={eyebrow}>Quản trị</span>
        <h1>{pageTitle}</h1>
      </div>
      {showAddProduct && (
        <Button
          content='Thêm sản phẩm'
          className={primaryButton}
          onClick={onAddProduct}
        />
      )}
    </div>
  );
}
export default PageHeading;
