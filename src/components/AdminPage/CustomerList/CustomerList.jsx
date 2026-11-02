import { useMemo, useState } from 'react';
import { FiSearch, FiSlash, FiUnlock } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';

function CustomerList({ customers, onToggle }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const {
    customerList,
    cardHeading,
    toolbar,
    searchField,
    searchInput,
    filterField,
    filterSelect,
    tableScroll,
    table,
    status,
    statusActive,
    statusInactive,
    accountButton,
    emptyState,
  } = styles;

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');

    return customers.filter((customer) => {
      const text =
        `${customer.name} ${customer.email} ${customer.phone} ${customer.id}`.toLocaleLowerCase(
          'vi'
        );
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? customer.active : !customer.active);
      return (!query || text.includes(query)) && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  return (
    <section className={customerList}>
      <div className={cardHeading}>
        <div>
          <h2>Tài khoản khách hàng</h2>
          <p>Tìm kiếm và quản lý trạng thái tài khoản.</p>
        </div>
      </div>

      <div className={toolbar}>
        <InputCommon
          id='customer-search'
          className={searchField}
          inputClassName={searchInput}
          label='Tìm khách hàng'
          compact
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Tên, email hoặc số điện thoại'
        />
        <label className={filterField}>
          <span>Trạng thái</span>
          <select
            className={filterSelect}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label='Lọc trạng thái'
          >
            <option value='all'>Tất cả trạng thái</option>
            <option value='active'>Đang hoạt động</option>
            <option value='closed'>Đã đóng</option>
          </select>
        </label>
      </div>

      <div className={tableScroll}>
        <table className={table}>
          <thead>
            <tr>
              <th>KHÁCH HÀNG</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <strong>{customer.name}</strong>
                  <small>{customer.email}</small>
                </td>
                <td>{customer.phone}</td>
                <td>
                  <span
                    className={`${status} ${customer.active ? statusActive : statusInactive}`}
                  >
                    {customer.active ? 'Đang hoạt động' : 'Đã đóng'}
                  </span>
                </td>
                <td>
                  <Button
                    className={accountButton}
                    type='button'
                    isPrimary={false}
                    onClick={() => onToggle(customer.id)}
                    content={
                      customer.active ? (
                        <>
                          <FiSlash aria-hidden='true' /> Đóng tài khoản
                        </>
                      ) : (
                        <>
                          <FiUnlock aria-hidden='true' /> Mở lại
                        </>
                      )
                    }
                  />
                </td>
              </tr>
            ))}
            {visibleCustomers.length === 0 && (
              <tr>
                <td className={emptyState} colSpan={4}>
                  <FiSearch aria-hidden='true' />
                  <span>Không tìm thấy tài khoản.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CustomerList;
