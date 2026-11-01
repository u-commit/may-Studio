export const CUSTOMER_STORAGE_KEY = 'may-studio-admin-customers';
export const CUSTOMERS_UPDATED_EVENT = 'may-studio:customers-updated';

function readCustomers() {
  try {
    const stored = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const customers = stored ? JSON.parse(stored) : [];
    return Array.isArray(customers) ? customers : [];
  } catch {
    return [];
  }
}

export function addRegisteredCustomer(account) {
  const email = String(account?.email ?? '').trim().toLowerCase();
  if (!email) return;

  const customers = readCustomers();
  const existing = customers.find((customer) => customer.email?.toLowerCase() === email);
  const status = String(account.status ?? '').toLowerCase();
  const active = account.active ?? account.isActive ?? (
    status ? !['closed', 'inactive', 'disabled', 'blocked'].includes(status) : existing?.active ?? true
  );
  const customer = {
    id: String(account.id ?? account._id ?? account.customerId ?? existing?.id ?? `KH-${Date.now()}`),
    name: String(account.name ?? account.fullName ?? account.username ?? existing?.name ?? email),
    email,
    phone: String(account.phone ?? account.phoneNumber ?? existing?.phone ?? ''),
    active: Boolean(active),
  };

  const nextCustomers = [customer, ...customers.filter((item) => item.email?.toLowerCase() !== email)];
  window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(nextCustomers));
  window.dispatchEvent(new Event(CUSTOMERS_UPDATED_EVENT));
}
