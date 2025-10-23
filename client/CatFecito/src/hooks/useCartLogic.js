import { useCallback, useEffect, useState } from 'react';

const API_BASE = (() => {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return base.replace(/\/$/, '') + '/api';
})();

const getToken = () => {
  const ls = sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
  if (ls) return ls;
  // fallback: axios default header
  try {
    const ax = window?.axios?.defaults?.headers?.common?.Authorization || '';
    if (ax.startsWith('Bearer ')) return ax.slice(7);
  } catch {
    // ignore
  }
  return null;
};

const authHeaders = () => {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

const mapServerItem = (row) => ({
  id: row.product_id,                // id de producto para la UI
  cartItemId: row.id,                // id del item de carrito en servidor
  name: row.product_name,
  price: Number(row.product_price) || 0,
  image: row.product_image || '/placeholder-coffee.jpg',
  stock: typeof row.product_stock === 'number' ? row.product_stock : undefined,
  quantity: row.quantity
});

export function useCartLogic() {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Función de sincronización que puede ser llamada manualmente
  const syncCartWithBackend = useCallback(async () => {
    const savedLocal = (() => {
      try {
        const saved = sessionStorage.getItem('catfecito-cart');
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    })();

    const token = getToken();

    if (!token) {
      setItems(savedLocal);
      return;
    }

    // Autenticado: traer carrito del backend y mergear items locales
    try {
      // 1) cargar carrito del servidor
      await fetch(`${API_BASE}/cart`, { headers: authHeaders() });

      // 2) si hay items locales, agregarlos al servidor (sumará cantidades)
      if (savedLocal.length > 0) {
        for (const it of savedLocal) {
          const qty = Math.max(1, Number(it.quantity) || 1);
          await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ product_id: it.id, quantity: qty })
          }).catch(() => {});
        }
      }

      // 3) recargar del servidor como fuente de verdad
      const r2 = await fetch(`${API_BASE}/cart`, { headers: authHeaders() });
      const data2 = r2.ok ? await r2.json() : { items: [] };
      const merged = Array.isArray(data2.items) ? data2.items.map(mapServerItem) : [];

      setItems(merged);
      // limpiar carrito local ya que ahora persiste en backend
      sessionStorage.removeItem('catfecito-cart');
    } catch {
      // fallback: al menos mostrar local
      setItems(savedLocal);
    }
  }, []);

  // Cargar del sessionStorage y, si hay token, sincronizar con backend
  useEffect(() => {
    syncCartWithBackend();
  }, [syncCartWithBackend]);

  // Persistir local para invitados
  useEffect(() => {
    if (!getToken()) {
      sessionStorage.setItem('catfecito-cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = useCallback((product) => {
    // optimista
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const stock = typeof product.stock === 'number' ? product.stock : Infinity;
      if (existing) {
        const nextQty = Math.min((existing.quantity || 0) + 1, stock);
        return prev.map(i => i.id === product.id ? { ...i, quantity: nextQty } : i);
      }
      const initialQty = Math.min(1, stock);
      if (initialQty <= 0) return prev;
      return [...prev, { ...product, quantity: initialQty }];
    });

    // sync backend si autenticado
    if (getToken()) {
      fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      })
      .then(async (r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        // actualizar item con datos del servidor (ids/cantidades reales)
        if (data?.item) {
          const serverItem = mapServerItem(data.item);
          setItems(prev => {
            const others = prev.filter((i) => i.id !== serverItem.id);
            return [...others, serverItem];
          });
        } else {
          // como fallback, refrescar todo
          return fetch(`${API_BASE}/cart`, { headers: authHeaders() })
            .then(r => r.json())
            .then(d => setItems((d.items || []).map(mapServerItem)));
        }
      })
      .catch(() => {});
    }
  }, []);

  const removeItem = useCallback((productId) => {
    const current = (id) => items.find(i => i.id === id);
    const item = current(productId);

    // optimista
    setItems(prev => prev.filter(i => i.id !== productId));

    if (getToken() && item?.cartItemId) {
      fetch(`${API_BASE}/cart/${item.cartItemId}`, {
        method: 'DELETE',
        headers: authHeaders()
      }).catch(() => {});
    }
  }, [items]);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(0, Number(quantity) || 0);

    // optimista
    setItems(prev => {
      if (qty <= 0) return prev.filter(i => i.id !== productId);
      const product = prev.find(i => i.id === productId);
      const stock = product && typeof product.stock === 'number' ? product.stock : Infinity;
      const clamped = Math.min(qty, stock);
      return prev.map(i => i.id === productId ? { ...i, quantity: clamped } : i);
    });

    // sync backend si autenticado
    const item = items.find(i => i.id === productId);
    if (getToken() && item?.cartItemId) {
      if (qty <= 0) {
        fetch(`${API_BASE}/cart/${item.cartItemId}`, {
          method: 'DELETE',
          headers: authHeaders()
        }).catch(() => {});
      } else {
        fetch(`${API_BASE}/cart/${item.cartItemId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ quantity: qty })
        }).catch(() => {});
      }
    }
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (getToken()) {
      fetch(`${API_BASE}/cart`, { method: 'DELETE', headers: authHeaders() }).catch(() => {});
    } else {
      sessionStorage.removeItem('catfecito-cart');
    }
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(o => !o), []);

  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  return {
    items,
    isCartOpen,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    syncCartWithBackend // Exportar para uso manual después del login
  };
}
