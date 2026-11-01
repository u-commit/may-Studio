import { useMemo, useState } from 'react';
import { FiSearch, FiSlash, FiUnlock } from 'react-icons/fi';
import styles from '../styles.module.scss';
import componentStyles from './styles.module.scss';

function CustomerList({ customers, onToggle }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const visibleCustomers = useMemo(() => customers.filter((customer) => {
    const query = search.trim().toLocaleLowerCase('vi');
    const text = `${customer.name} ${customer.email} ${customer.phone} ${customer.id}`.toLocaleLowerCase('vi');
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? customer.active : !customer.active);
    return (!query || text.includes(query)) && matchesStatus;
  }), [customers, search, statusFilter]);

  return (
    <section className={`${styles.dataCard} ${componentStyles.customerList}`}>
      <div className={styles.cardHeading}><div><h2>Tài khoản khách hàng</h2><p>Tìm kiếm và quản lý trạng thái tài khoản.</p></div></div>
      <div className={styles.toolbar}>
        <label className={styles.searchBox}><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, email hoặc số điện thoại..." /></label>
        <select className={styles.filterSelect} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="closed">Đã đóng</option></select>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead><tr><th>KHÁCH HÀNG</th><th>SỐ ĐIỆN THOẠI</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id}>
                <td><strong>{customer.name}</strong><small>{customer.email}</small></td><td>{customer.phone}</td>
                <td><span className={`${styles.status} ${customer.active ? styles.statusActive : styles.statusInactive}`}>{customer.active ? 'Đang hoạt động' : 'Đã đóng'}</span></td>
                <td><button className={styles.accountButton} type="button" onClick={() => onToggle(customer.id)}>{customer.active ? <><FiSlash /> Đóng tài khoản</> : <><FiUnlock /> Mở lại</>}</button></td>
              </tr>
            ))}
            {visibleCustomers.length === 0 && <tr><td className={styles.emptyState} colSpan="4">Không tìm thấy tài khoản.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CustomerList;
