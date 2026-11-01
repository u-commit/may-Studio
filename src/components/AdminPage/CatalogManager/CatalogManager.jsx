import { useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from '../styles.module.scss';
import componentStyles from './styles.module.scss';
import { CATALOG_LABELS } from '../constants';

function CatalogManager({ catalog, products, productsLoading, productsError, onAdd, onRename, onDelete, onSaveManufacturerDetails }) {
  const [drafts, setDrafts] = useState({ categories: '', manufacturers: '', colors: '', sizes: '' });
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [expanded, setExpanded] = useState(null);

  function submitNew(type, event) {
    event.preventDefault();
    onAdd(type, drafts[type]);
    setDrafts((current) => ({ ...current, [type]: '' }));
  }

  function submitEdit(event) {
    event.preventDefault();
    onRename(editing.type, editing.value, editValue);
    setEditing(null);
  }

  function submitManufacturerDetails(name, event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSaveManufacturerDetails(name, Object.fromEntries(formData.entries()));
  }

  return (
    <div className={`${styles.catalogGrid} ${componentStyles.catalogManager}`}>
      {Object.entries(CATALOG_LABELS).map(([type, label]) => {
        const values = catalog[type] ?? [];
        return (
        <section className={styles.dataCard} key={type}>
          <div className={styles.cardHeading}><div><h2>{label}</h2><p>{values.length} mục</p></div></div>
          <form className={styles.catalogAddForm} onSubmit={(event) => submitNew(type, event)}>
            <input value={drafts[type]} onChange={(event) => setDrafts((current) => ({ ...current, [type]: event.target.value }))} placeholder={`Thêm ${CATALOG_LABELS[type].toLowerCase()}`} aria-label={`Thêm ${CATALOG_LABELS[type]}`} />
            <button className={styles.smallPrimaryButton} type="submit" aria-label={`Thêm ${CATALOG_LABELS[type]}`}><FiPlus /></button>
          </form>
          <ul className={styles.catalogList}>
            {values.map((value) => {
              const isExpanded = expanded === `${type}:${value}`;
              const relatedProducts = type === 'categories' ? products.filter((product) => product.category === value) : [];
              const manufacturer = catalog.manufacturerDetails?.[value] ?? {};
              return (
                <li className={componentStyles.catalogEntry} key={value}>
                  <div className={componentStyles.catalogRow}>
                    {editing?.type === type && editing.value === value ? (
                      <form className={styles.inlineEdit} onSubmit={submitEdit}>
                        <input autoFocus value={editValue} onChange={(event) => setEditValue(event.target.value)} aria-label={`Sửa ${value}`} />
                        <button type="submit">Lưu</button><button type="button" onClick={() => setEditing(null)}>Hủy</button>
                      </form>
                    ) : (
                      <><span>{value}</span><div className={componentStyles.catalogActions}>
                        {type === 'categories' && <button className={componentStyles.detailsButton} type="button" onClick={() => setExpanded(isExpanded ? null : `${type}:${value}`)}>Sản phẩm ({relatedProducts.length})</button>}
                        {type === 'manufacturers' && <button className={componentStyles.detailsButton} type="button" onClick={() => setExpanded(isExpanded ? null : `${type}:${value}`)}>Thông tin</button>}
                        <button type="button" aria-label={`Sửa ${value}`} onClick={() => { setEditing({ type, value }); setEditValue(value); }}><FiEdit2 /></button>
                        <button type="button" aria-label={`Xóa ${value}`} onClick={() => onDelete(type, value)}><FiTrash2 /></button>
                      </div></>
                    )}
                  </div>
                  {type === 'categories' && isExpanded && (
                    <div className={componentStyles.productDetails}>
                      {productsLoading ? <p className={styles.mutedText}>Đang tải danh sách sản phẩm...</p> : productsError ? <p className={styles.mutedText}>Không tải được sản phẩm từ API.</p> : relatedProducts.length === 0 ? <p className={styles.mutedText}>Chưa có sản phẩm thuộc loại này.</p> : relatedProducts.map((product) => (
                        <article className={componentStyles.productDetail} key={product.id}>
                          <div className={componentStyles.detailImage}>{product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <span>Ảnh</span>}</div>
                          <div><strong>{product.name}</strong><small>{Number(product.price).toLocaleString('vi-VN')} ₫</small><p>{product.description || 'Chưa có thông tin sản phẩm.'}</p></div>
                        </article>
                      ))}
                    </div>
                  )}
                  {type === 'manufacturers' && isExpanded && (
                    <form className={componentStyles.manufacturerForm} onSubmit={(event) => submitManufacturerDetails(value, event)}>
                      <label>Logo / ảnh đại diện<input name="logoUrl" defaultValue={manufacturer.logoUrl ?? ''} placeholder="Đường dẫn ảnh" /></label>
                      {manufacturer.logoUrl && <img className={componentStyles.manufacturerLogo} src={manufacturer.logoUrl} alt={`Logo ${value}`} />}
                      <label>Thông tin nhà sản xuất<textarea name="description" rows="3" defaultValue={manufacturer.description ?? ''} placeholder="Mô tả về nhà sản xuất" /></label>
                      <label>Người liên hệ<input name="contactName" defaultValue={manufacturer.contactName ?? ''} /></label>
                      <label>Số điện thoại<input name="phone" defaultValue={manufacturer.phone ?? ''} /></label>
                      <label>Email<input name="email" type="email" defaultValue={manufacturer.email ?? ''} /></label>
                      <label>Địa chỉ<input name="address" defaultValue={manufacturer.address ?? ''} /></label>
                      <button className={styles.primaryButton} type="submit">Lưu thông tin nhà sản xuất</button>
                    </form>
                  )}
                </li>
              );
            })}
            {values.length === 0 && <li className={styles.mutedText}>Chưa có mục nào.</li>}
          </ul>
        </section>
      ); })}
    </div>
  );
}

export default CatalogManager;
