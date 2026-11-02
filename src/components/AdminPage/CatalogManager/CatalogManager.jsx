import { useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';
import { CATALOG_LABELS } from '../constants';
import submitManufacturerDetails from './hooks/submitManufacturerDetails';
import useSubmitNew from './hooks/submitNew';
import useSubmitEdit from './hooks/submitEdit';

function CatalogManager({
  catalog,
  products,
  productsLoading,
  productsError,
  onAdd,
  onRename,
  onDelete,
  onSaveManufacturerDetails,
}) {
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [drafts, setDrafts] = useState({
    categories: '',
    manufacturers: '',
    colors: '',
    sizes: '',
  });

  const submitNew = useSubmitNew({ drafts, onAdd, setDrafts });
  const submitEdit = useSubmitEdit({
    editing,
    editValue,
    onRename,
    setEditing,
  });
  const {
    catalogManager,
    catalogCard,
    cardHeading,
    count,
    catalogAddForm,
    addInputContainer,
    textInput,
    catalogAddButton,
    catalogList,
    catalogEntry,
    catalogRow,
    inlineEdit,
    editInputContainer,
    editButton,
    catalogName,
    catalogActions,
    detailsButton,
    iconButton,
    productDetails,
    mutedText,
    productDetail,
    detailImage,
    detailCopy,
    manufacturerForm,
    manufacturerLogo,
    manufacturerDescription,
    saveManufacturerButton,
    emptyState,
  } = styles;

  return (
    <div className={catalogManager}>
      {Object.entries(CATALOG_LABELS).map(([type, label]) => {
        const values = catalog[type] ?? [];

        return (
          <section className={catalogCard} key={type}>
            <div className={cardHeading}>
              <div>
                <h2>{label}</h2>
                <p>{values.length} mục trong danh mục</p>
              </div>
              <span className={count}>{values.length}</span>
            </div>

            <form
              className={catalogAddForm}
              onSubmit={(event) => submitNew(type, event)}
            >
              <InputCommon
                id={`new-${type}`}
                className={addInputContainer}
                inputClassName={textInput}
                label={`Thêm ${label.toLowerCase()}`}
                compact
                value={drafts[type]}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [type]: event.target.value,
                  }))
                }
              />
              <Button
                className={catalogAddButton}
                type='submit'
                aria-label={`Thêm ${label}`}
                content={<FiPlus aria-hidden='true' />}
              />
            </form>

            <ul className={catalogList}>
              {values.map((value) => {
                const entryKey = `${type}:${value}`;
                const isExpanded = expanded === entryKey;
                const relatedProducts =
                  type === 'categories'
                    ? products.filter((product) => product.category === value)
                    : [];
                const manufacturer = catalog.manufacturerDetails?.[value] ?? {};

                return (
                  <li className={catalogEntry} key={value}>
                    <div className={catalogRow}>
                      {editing?.type === type && editing.value === value ? (
                        <form className={inlineEdit} onSubmit={submitEdit}>
                          <InputCommon
                            id='edit-catalog-item'
                            className={editInputContainer}
                            inputClassName={textInput}
                            label='Tên mục'
                            compact
                            autoFocus
                            value={editValue}
                            onChange={(event) => setEditValue(event.target.value)}
                          />
                          <Button
                            className={editButton}
                            type='submit'
                            content='Lưu'
                          />
                          <Button
                            className={editButton}
                            type='button'
                            isPrimary={false}
                            onClick={() => setEditing(null)}
                            content='Hủy'
                          />
                        </form>
                      ) : (
                        <>
                          <span className={catalogName}>{value}</span>

                          <div className={catalogActions}>
                            {type === 'categories' && (
                              <button
                                className={detailsButton}
                                type='button'
                                aria-expanded={isExpanded}
                                onClick={() =>
                                  setExpanded(isExpanded ? null : entryKey)
                                }
                              >
                                Sản phẩm ({relatedProducts.length})
                              </button>
                            )}

                            {type === 'manufacturers' && (
                              <button
                                className={detailsButton}
                                type='button'
                                aria-expanded={isExpanded}
                                onClick={() =>
                                  setExpanded(isExpanded ? null : entryKey)
                                }
                              >
                                Thông tin
                              </button>
                            )}

                            <button
                              className={iconButton}
                              type='button'
                              aria-label={`Sửa ${value}`}
                              onClick={() => {
                                setEditing({ type, value });
                                setEditValue(value);
                              }}
                            >
                              <FiEdit2 aria-hidden='true' />
                            </button>

                            <button
                              className={iconButton}
                              type='button'
                              aria-label={`Xóa ${value}`}
                              onClick={() => onDelete(type, value)}
                            >
                              <FiTrash2 aria-hidden='true' />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {type === 'categories' && isExpanded && (
                      <div className={productDetails}>
                        {productsLoading ? (
                          <p className={mutedText}>
                            Đang tải danh sách sản phẩm...
                          </p>
                        ) : productsError ? (
                          <p className={mutedText}>
                            Không tải được sản phẩm từ API.
                          </p>
                        ) : relatedProducts.length === 0 ? (
                          <p className={mutedText}>
                            Chưa có sản phẩm thuộc loại này.
                          </p>
                        ) : (
                          relatedProducts.map((product) => (
                            <article
                              className={productDetail}
                              key={product.id}
                            >
                              <div className={detailImage}>
                                {product.images?.[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                  />
                                ) : (
                                  <span>Ảnh</span>
                                )}
                              </div>
                              <div className={detailCopy}>
                                <strong>{product.name}</strong>
                                <small>
                                  {Number(product.price).toLocaleString(
                                    'vi-VN'
                                  )}{' '}
                                  ₫
                                </small>
                                <p>
                                  {product.description ||
                                    'Chưa có thông tin sản phẩm.'}
                                </p>
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    )}

                    {type === 'manufacturers' && isExpanded && (
                      <form
                        className={manufacturerForm}
                        onSubmit={(event) =>
                          submitManufacturerDetails(
                            value,
                            event,
                            onSaveManufacturerDetails
                          )
                        }
                      >
                        <ManufacturerInput
                          id='logoUrl'
                          label='Logo / ảnh đại diện'
                          defaultValue={manufacturer.logoUrl ?? ''}
                          placeholder='Đường dẫn ảnh'
                        />

                        {manufacturer.logoUrl && (
                          <img
                            className={manufacturerLogo}
                            src={manufacturer.logoUrl}
                            alt={`Logo ${value}`}
                          />
                        )}

                        <label className={manufacturerDescription}>
                          <span>Thông tin nhà sản xuất</span>
                          <textarea
                            name='description'
                            rows='3'
                            defaultValue={manufacturer.description ?? ''}
                            placeholder='Mô tả về nhà sản xuất'
                          />
                        </label>

                        <ManufacturerInput
                          id='contactName'
                          label='Người liên hệ'
                          defaultValue={manufacturer.contactName ?? ''}
                        />
                        <ManufacturerInput
                          id='phone'
                          label='Số điện thoại'
                          defaultValue={manufacturer.phone ?? ''}
                        />
                        <ManufacturerInput
                          id='email'
                          label='Email'
                          type='email'
                          defaultValue={manufacturer.email ?? ''}
                        />
                        <ManufacturerInput
                          id='address'
                          label='Địa chỉ'
                          defaultValue={manufacturer.address ?? ''}
                        />

                        <Button
                          className={saveManufacturerButton}
                          type='submit'
                          content='Lưu thông tin nhà sản xuất'
                        />
                      </form>
                    )}
                  </li>
                );
              })}

              {values.length === 0 && (
                <li className={emptyState}>Chưa có mục nào.</li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ManufacturerInput({ id, label, type = 'text', ...inputProps }) {
  const { manufacturerInput, textInput } = styles;

  return (
    <InputCommon
      id={id}
      label={label}
      type={type}
      className={manufacturerInput}
      inputClassName={textInput}
      compact
      {...inputProps}
    />
  );
}

export default CatalogManager;
