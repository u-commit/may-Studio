import { FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import useCombinationBuilder from './hooks/useCombinationBuilder';
import styles from './styles.module.scss';

function CombinationBuilder({
  product,
  colors,
  sizes,
  rows,
  onRowsChange,
  defaults,
  editing,
  errors,
}) {
  const builder = useCombinationBuilder({
    product,
    colors,
    rows,
    onRowsChange,
    defaults,
    editing,
  });
  const {
    selectedColors,
    selectedSizes,
    colorOptions,
    newColor,
    newColorHex,
    imageError,
    toggleColor,
    toggleSize,
    handleNewColorChange,
    handleNewColorHexChange,
    addColor,
    buildCombinations,
    updateRow,
    removeRow,
    handleImage,
    removeColorImage,
  } = builder;

  return (
    <section className={styles.builder}>
      <div className={styles.builderHeading}>
        <div>
          <h3>Tổ hợp màu sắc và kích thước</h3>
          <p>Mỗi tổ hợp có SKU, giá và tồn kho riêng.</p>
        </div>
        {!editing && <span>{rows.length} tổ hợp</span>}
      </div>

      <>
        <fieldset className={styles.choiceGroup}>
          <legend>Màu sắc</legend>
          <div className={styles.choiceList}>
            {colorOptions.map((color) => (
              <label className={styles.colorChoice} key={color.name}>
                <input
                  type='checkbox'
                  checked={selectedColors.some(
                    (item) => item.name === color.name
                  )}
                  onChange={() => toggleColor(color)}
                />
                <i style={{ '--swatch-color': color.hex }} />
                {color.name}
              </label>
            ))}
            {selectedColors
              .filter(
                (item) =>
                  !colorOptions.some((color) => color.name === item.name)
              )
              .map((color) => (
                <label className={styles.colorChoice} key={color.name}>
                  <input
                    type='checkbox'
                    checked
                    onChange={() => toggleColor(color)}
                  />
                  <i style={{ '--swatch-color': color.hex }} />
                  {color.name}
                </label>
              ))}
          </div>
          {!editing && (
            <div className={styles.newColor}>
              <input
                type='color'
                aria-label='Chọn màu mới'
                value={newColorHex}
                onChange={handleNewColorHexChange}
              />
              <input
                aria-label='Tên màu mới'
                value={newColor}
                onChange={handleNewColorChange}
                placeholder='Thêm màu mới'
              />
              <button type='button' aria-label='Thêm màu' onClick={addColor}>
                <FiPlus />
              </button>
            </div>
          )}
        </fieldset>

        <fieldset className={styles.choiceGroup}>
          <legend>Kích thước</legend>
          <div className={styles.choiceList}>
            {sizes.map((size) => (
              <label className={styles.sizeChoice} key={size}>
                <input
                  type='checkbox'
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {!editing && (
          <button
            className={styles.generateButton}
            type='button'
            onClick={buildCombinations}
            disabled={
              !product || !selectedColors.length || !selectedSizes.length
            }
          >
            <FiPlus aria-hidden='true' /> Tạo tổ hợp
          </button>
        )}
        {!rows.length && !editing && (
          <p className={styles.helperText}>
            Chọn ít nhất một màu và một kích thước, sau đó tạo tổ hợp.
          </p>
        )}
      </>

      {imageError && (
        <p className={styles.inlineError} role='alert'>
          {imageError}
        </p>
      )}
      {rows.length > 0 && (
        <div className={styles.combinationsScroll}>
          <table className={styles.combinationsTable}>
            <thead>
              <tr>
                <th>MÀU / SIZE</th>
                <th>SKU</th>
                <th>GIÁ BÁN</th>
                <th>GIÁ ƯU ĐÃI</th>
                <th>TỒN KHO</th>
                <th>TRẠNG THÁI</th>
                <th>ẢNH MÀU</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={styles.comboColor}>
                      <i style={{ '--swatch-color': row.color.hex }} />
                      {row.color.name} / {row.size}
                    </span>
                    {errors[row.id]?.combination && (
                      <small className={styles.inlineError}>
                        {errors[row.id].combination}
                      </small>
                    )}
                  </td>
                  <td>
                    <label className={styles.rowField}>
                      <input
                        aria-label={`SKU ${row.color.name} ${row.size}`}
                        value={row.sku}
                        onChange={(event) =>
                          updateRow(row.id, 'sku', event.target.value)
                        }
                      />
                      {errors[row.id]?.sku && (
                        <small>{errors[row.id].sku}</small>
                      )}
                    </label>
                  </td>
                  <td>
                    <label className={styles.rowField}>
                      <input
                        aria-label={`Giá bán ${row.color.name} ${row.size}`}
                        type='number'
                        min='1'
                        value={row.price ?? ''}
                        onChange={(event) =>
                          updateRow(row.id, 'price', event.target.value)
                        }
                      />
                      {errors[row.id]?.price && (
                        <small>{errors[row.id].price}</small>
                      )}
                    </label>
                  </td>
                  <td>
                    <label className={styles.rowField}>
                      <input
                        aria-label={`Giá ưu đãi ${row.color.name} ${row.size}`}
                        type='number'
                        min='0'
                        value={row.salePrice ?? ''}
                        onChange={(event) =>
                          updateRow(row.id, 'salePrice', event.target.value)
                        }
                      />
                      {errors[row.id]?.salePrice && (
                        <small>{errors[row.id].salePrice}</small>
                      )}
                    </label>
                  </td>
                  <td>
                    <label className={styles.rowField}>
                      <input
                        aria-label={`Tồn kho ${row.color.name} ${row.size}`}
                        type='number'
                        min='0'
                        step='1'
                        value={row.stock ?? ''}
                        onChange={(event) =>
                          updateRow(row.id, 'stock', event.target.value)
                        }
                      />
                      {errors[row.id]?.stock && (
                        <small>{errors[row.id].stock}</small>
                      )}
                    </label>
                  </td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      aria-label={`Trạng thái ${row.color.name} ${row.size}`}
                      value={row.status}
                      onChange={(event) =>
                        updateRow(row.id, 'status', event.target.value)
                      }
                    >
                      <option value='active'>Đang hoạt động</option>
                      <option value='inactive'>Ngừng hoạt động</option>
                    </select>
                  </td>
                  <td>
                    <label className={styles.imageControl}>
                      {row.image ? (
                        <img
                          src={row.image}
                          alt={`Ảnh màu ${row.color.name}`}
                        />
                      ) : (
                        <FiUpload aria-hidden='true' />
                      )}
                      <input
                        type='file'
                        accept='image/*'
                        aria-label={`Tải ảnh màu ${row.color.name}`}
                        onChange={(event) =>
                          handleImage(row, event.target.files?.[0])
                        }
                      />
                      {row.image && (
                        <button
                          type='button'
                          aria-label={`Xóa ảnh màu ${row.color.name}`}
                          onClick={(event) => {
                            event.preventDefault();
                            removeColorImage(row.color.name);
                          }}
                        >
                          <FiX />
                        </button>
                      )}
                    </label>
                  </td>
                  <td>
                    {!editing && (
                      <button
                        className={styles.removeButton}
                        type='button'
                        aria-label={`Bỏ tổ hợp ${row.color.name} ${row.size}`}
                        onClick={() => removeRow(row.id)}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default CombinationBuilder;
