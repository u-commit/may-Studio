import { useEffect, useState } from 'react';
import { INITIAL_CUSTOMERS, STORAGE_KEYS } from '../constants';
import { CUSTOMERS_UPDATED_EVENT } from '../../../utils/customerStore';

function readSaved(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function useAdminCustomers() {
  const [customers, setCustomers] = useState(() =>
    readSaved(STORAGE_KEYS.customers, INITIAL_CUSTOMERS)
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.customers,
      JSON.stringify(customers)
    );
  }, [customers]);

  useEffect(() => {
    const reloadCustomers = () => {
      setCustomers(readSaved(STORAGE_KEYS.customers, INITIAL_CUSTOMERS));
    };

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEYS.customers) {
        reloadCustomers();
      }
    };

    window.addEventListener(CUSTOMERS_UPDATED_EVENT, reloadCustomers);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(CUSTOMERS_UPDATED_EVENT, reloadCustomers);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function toggleCustomer(id) {
    const customer = customers.find((item) => item.id === id);
    if (!customer) return;

    if (
      customer.active &&
      !window.confirm(`Đóng tài khoản của ${customer.name}?`)
    ) {
      return;
    }

    setCustomers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  }

  return {
    customers,
    toggleCustomer,
  };
}

export default useAdminCustomers;
