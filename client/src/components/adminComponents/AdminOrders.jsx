import { useEffect, useState } from "react";
import api from "../../services/api";
import "../profileComponents/ProfileOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")
    : "";

  const getItemImageSrc = (it) => {
    if (!it) return "";
    let v = it.image ?? it.image_url ?? "";
    if (v && typeof v === "object" && typeof v.url === "string") {
      v = v.url;
    }
    if (typeof v !== "string") return "";
    const src = v.trim();
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("data:")) return src;
    if (!BACKEND_ORIGIN) return src;
    return `${BACKEND_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get('/orders/admin/all');
        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (e) {
        setError(e?.response?.data?.message || "Error al obtener órdenes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    if (!orderDetails[orderId]) {
      try {
        const { data } = await api.get(`/orders/admin/${orderId}`);
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: data.order,
        }));
      } catch (err) {
        console.error("Error al obtener detalles:", err);
      }
    }
    setExpandedOrder(orderId);
  };

  return (
    <section className="profile-orders-admin">
      {loading && <p>Cargando pedidos…</p>}
      {error && <div className="orders-error">{error}</div>}
      {!loading && !error && (
        orders.length === 0 ? (
          <p>No hay pedidos todavía.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((o) => (
              <li key={o.id} className="disponsal-item">
                <div className="disponsal-summary">
                  <div>
                    <strong>Pedido #{o.id}</strong>
                  </div>
                  <div>
                    <strong>Usuario:</strong> {o.user_name} ({o.user_email})
                  </div>
                  <div>
                    Fecha: {o.created_at ? new Date(o.created_at).toLocaleString("es-AR") : "-"}
                  </div>
                  <div>
                    Estado: {o.status} {o.payment_status ? `(pago: ${o.payment_status})` : ""}
                  </div>
                  <div>
                    Total: ${Number(o.total || 0).toLocaleString("es-AR")}
                  </div>
                  <div
                    className="order-items-toggle"
                    onClick={() => toggleOrderDetails(o.id)}
                  >
                    Items: {o.items_count}
                    <span className={`arrow ${expandedOrder === o.id ? "open" : ""}`}>▼</span>
                  </div>
                </div>
                {expandedOrder === o.id && (
                  <div className="order-details">
                    {orderDetails[o.id] ? (
                      <div className="details-content">
                        <div className="shipping-info">
                          <h4> Datos del envío</h4>
                          <div className="shipping-field">
                            <span className="label">País:</span>
                            <span className="value">{orderDetails[o.id].shipping_country || "-"}</span>
                          </div>
                          <div className="shipping-field">
                            <span className="label">Dirección:</span>
                            <span className="value">{orderDetails[o.id].shipping_address || "-"}</span>
                          </div>
                          <div className="shipping-field">
                            <span className="label">Ciudad:</span>
                            <span className="value">{orderDetails[o.id].shipping_city || "-"}</span>
                          </div>
                          <div className="shipping-field">
                            <span className="label">Provincia:</span>
                            <span className="value">{orderDetails[o.id].shipping_state || "-"}</span>
                          </div>
                          <div className="shipping-field">
                            <span className="label">Código postal:</span>
                            <span className="value">{orderDetails[o.id].shipping_zip || "-"}</span>
                          </div>
                          <div className="shipping-field">
                            <span className="label">Teléfono:</span>
                            <span className="value">{orderDetails[o.id].shipping_phone || "-"}</span>
                          </div>
                        </div>
                        <div className="purchase-info">
                          <h4>Datos de la compra</h4>
                          <ul className="purchase-list">
                            {orderDetails[o.id].items.map((item) => (
                              <li key={item.id} className="purchase-item">
                                <div className="purchase-text">
                                  <p><strong>{item.product_name}</strong></p>
                                  <p>Cantidad: {item.quantity}</p>
                                  <p>Precio: ${item.price}</p>
                                  <p>Subtotal: ${item.subtotal}</p>
                                </div>
                                <div className="purchase-image">
                                  <img
                                    src={getItemImageSrc(item)}
                                    alt={item.product_name}
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="loading-details">Cargando detalles...</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}
