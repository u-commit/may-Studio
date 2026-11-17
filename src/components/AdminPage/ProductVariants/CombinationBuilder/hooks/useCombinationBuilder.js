import { useState } from 'react';
import {
  createVariantId,
  createVariantSKU,
  getColorHex,
} from '../../../../../apis/productVariantsService';

function useCombinationBuilder({
  product,
  colors,
  rows,
  onRowsChange,
  defaults,
  editing,
}) {
  const [selectedColors, setSelectedColors] = useState(() =>
    editing && rows[0]?.color ? [rows[0].color] : []
  );
  const [selectedSizes, setSelectedSizes] = useState(() =>
    editing && rows[0]?.size ? [rows[0].size] : []
  );
  const [newColor, setNewColor] = useState('');
  const [newColorHex, setNewColorHex] = useState('#d9dfd8');
  const [imageError, setImageError] = useState('');
  const colorOptions = colors.map((color) =>
    typeof color === 'string' ? { name: color, hex: getColorHex(color) } : color
  );

  function toggleColor(color) {
    if (editing) {
      setSelectedColors([color]);
      onRowsChange(rows.map((row) => ({ ...row, color })));
      return;
    }
    setSelectedColors((current) =>
      current.some((item) => item.name === color.name)
        ? current.filter((item) => item.name !== color.name)
        : [...current, color]
    );
  }

  function toggleSize(size) {
    if (editing) {
      setSelectedSizes([size]);
      onRowsChange(rows.map((row) => ({ ...row, size })));
      return;
    }
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size]
    );
  }

  function handleNewColorChange(event) {
    setNewColor(event.target.value);
  }

  function handleNewColorHexChange(event) {
    setNewColorHex(event.target.value);
  }

  function addColor() {
    const name = newColor.trim();
    if (!name) return;
    const existing = colorOptions.find(
      (color) =>
        color.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')
    );
    const match =
      existing ??
      selectedColors.find(
        (color) =>
          color.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')
      );
    if (match) {
      setSelectedColors((current) =>
        current.some((color) => color.name === match.name)
          ? current
          : [...current, match]
      );
      setNewColor('');
      return;
    }
    setSelectedColors((current) => [...current, { name, hex: newColorHex }]);
    setNewColor('');
  }

  function buildCombinations() {
    if (!product || !selectedColors.length || !selectedSizes.length) return;
    const existing = new Map(
      rows.map((row) => [`${row.color.name}|${row.size}`, row])
    );
    const next = selectedColors.flatMap((color) =>
      selectedSizes.map((size) => {
        const key = `${color.name}|${size}`;
        return (
          existing.get(key) ?? {
            id: createVariantId(),
            sku: createVariantSKU(product, color.name, size),
            color,
            size,
            price: defaults.price,
            salePrice: defaults.salePrice,
            stock: defaults.stock,
            image: '',
            status: 'active',
          }
        );
      })
    );
    onRowsChange(next);
  }

  function updateRow(rowId, field, value) {
    onRowsChange(
      rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  }

  function removeRow(rowId) {
    onRowsChange(rows.filter((row) => row.id !== rowId));
  }

  function handleImage(row, file) {
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Vui lòng chọn tệp hình ảnh.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Ảnh cần nhỏ hơn 2 MB để lưu được trong dữ liệu demo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onRowsChange(
        rows.map((item) =>
          item.color.name === row.color.name
            ? { ...item, image: String(reader.result) }
            : item
        )
      );
    };
    reader.onerror = () => {
      setImageError('Không đọc được hình ảnh đã chọn.');
    };
    try {
      reader.readAsDataURL(file);
    } catch {
      setImageError('Không đọc được hình ảnh đã chọn.');
    }
  }

  function removeColorImage(colorName) {
    onRowsChange(
      rows.map((row) =>
        row.color.name === colorName ? { ...row, image: '' } : row
      )
    );
  }

  return {
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
  };
}

export default useCombinationBuilder;
