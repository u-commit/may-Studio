export const PRODUCT_CHANGES_STORAGE_KEY = 'may-studio-product-changes';
export const PRODUCT_CHANGES_EVENT = 'may-studio:products-updated';

function readChanges() {
  try {
    const value = JSON.parse(window.localStorage.getItem(PRODUCT_CHANGES_STORAGE_KEY) ?? 'null');
    return {
      added: Array.isArray(value?.added) ? value.added : [],
      updated: Array.isArray(value?.updated) ? value.updated : [],
      deletedIds: Array.isArray(value?.deletedIds) ? value.deletedIds.map(String) : [],
    };
  } catch {
    return { added: [], updated: [], deletedIds: [] };
  }
}

function getId(product) {
  return String(product?.id ?? product?._id ?? '');
}

function writeChanges(changes) {
  window.localStorage.setItem(PRODUCT_CHANGES_STORAGE_KEY, JSON.stringify(changes));
  window.dispatchEvent(new Event(PRODUCT_CHANGES_EVENT));
}

export function applyProductChanges(products) {
  const changes = readChanges();
  const deletedIds = new Set(changes.deletedIds);
  const updatedById = new Map(changes.updated.map((product) => [getId(product), product]));
  const sourceIds = new Set(products.map(getId));

  const currentProducts = products
    .filter((product) => !deletedIds.has(getId(product)))
    .map((product) => ({ ...product, ...(updatedById.get(getId(product)) ?? {}) }));
  const addedProducts = changes.added.filter((product) => !deletedIds.has(getId(product)) && !sourceIds.has(getId(product)));

  return [...addedProducts, ...currentProducts];
}

export function saveProductChange(product, { isNew = false } = {}) {
  const id = getId(product);
  if (!id) return;

  const changes = readChanges();
  const isAlreadyAdded = changes.added.some((item) => getId(item) === id);
  changes.deletedIds = changes.deletedIds.filter((deletedId) => deletedId !== id);

  if (isNew || isAlreadyAdded) {
    changes.added = [...changes.added.filter((item) => getId(item) !== id), product];
    changes.updated = changes.updated.filter((item) => getId(item) !== id);
  } else {
    changes.updated = [...changes.updated.filter((item) => getId(item) !== id), product];
  }

  writeChanges(changes);
}

export function deleteProductChange(id) {
  const productId = String(id);
  const changes = readChanges();
  const wasAddedLocally = changes.added.some((item) => getId(item) === productId);
  changes.added = changes.added.filter((item) => getId(item) !== productId);
  changes.updated = changes.updated.filter((item) => getId(item) !== productId);
  if (!wasAddedLocally && !changes.deletedIds.includes(productId)) {
    changes.deletedIds.push(productId);
  }
  writeChanges(changes);
}
