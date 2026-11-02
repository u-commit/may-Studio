import styles from './styles.module.scss';
function OverviewDashboard({ products, customers, onAddProduct }) {
  const productCount = products.length;
  const activeCustomers = customers.filter(
    (customer) => customer.active
  ).length;
  const { metricGrid, metricCard } = styles;
  return (
    <div>
      <div className={metricGrid}>
        <button type='button' className={metricCard} onClick={onAddProduct}>
          <span>Sản phẩm</span>
          <strong>{productCount}</strong>
          <small>Thêm mới hoặc cập nhật</small>
        </button>

        <div className={metricCard}>
          <span>Khách hàng hoạt động</span>
          <strong>{activeCustomers}</strong>
          <small>Đang có thể đặt hàng</small>
        </div>

        <div className={metricCard}>
          <span>Hàng sắp hết</span>
          <strong>
            {
              products.filter(
                (product) =>
                  Number(product.stock) > 0 && Number(product.stock) < 5
              ).length
            }
          </strong>
          <small>Cần bổ sung tồn kho</small>
        </div>

        <div className={metricCard}>
          <span>Tổng doanh thu</span>
          <strong>
            {products
              .reduce(
                (sum, product) =>
                  sum + Number(product.price) * Number(product.stock),
                0
              )
              .toLocaleString('vi-VN')}{' '}
            ₫
          </strong>
          <small>Dựa trên tồn kho hiện tại</small>
        </div>
      </div>
    </div>
  );
}
export default OverviewDashboard;
