import React, { useEffect, useState } from "react";

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

const getAlertStyle = (days) => {
  if (days <= 0) return "bg-red-100 text-red-800 border border-red-200";
  if (days === 1) return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  if (days <= 2) return "bg-amber-100 text-amber-800 border border-amber-200";
  return "bg-green-100 text-green-800 border border-green-200";
};

const getAlertIcon = (days) => {
  if (days <= 0) return "🍅";
  if (days === 1) return "⏳";
  if (days <= 2) return "⚠️";
  return "🥬";
};

const AddInventoryItem = ({ onItemAdded }) => {
  const [form, setForm] = useState({ name: "", quantity: "", unit: "kg", expiryDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const unitOptions = ["kg", "g", "L", "mL", "pcs", "packs", "bottles"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.restaurantId) {
      setError("No restaurant selected.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          restaurantId: user.restaurantId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add item");
      onItemAdded && onItemAdded();
      setForm({ name: "", quantity: "", unit: "kg", expiryDate: "" });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-6 max-w-xl mx-auto">
      <h3 className="text-lg font-bold mb-2">Add Inventory Item</h3>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item Name"
          className="input border rounded px-3 py-2 flex-1"
          required
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          type="number"
          className="input border rounded px-3 py-2 w-24"
          required
        />
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="input border rounded px-3 py-2 w-28"
          required
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <input
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          type="date"
          className="input border rounded px-3 py-2 w-44"
          required
        />
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        className="btn-gold mt-3 w-full md:w-auto"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
};

const InventoryAlerts = () => {
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let restaurantId = urlParams.get('restaurant');
        if (!restaurantId) {
          const user = JSON.parse(localStorage.getItem('user'));
          restaurantId = user?.restaurantId;
        }
        if (!restaurantId) {
          setError('No restaurant selected. Please scan a valid QR code or contact staff.');
          setExpiringItems([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/inventory?restaurantId=${restaurantId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const expiring = data.filter((item) => getDaysUntilExpiry(item.expiryDate) <= 2);
          setExpiringItems(expiring);
        } else {
          setError(data.error || 'Failed to load inventory.');
          setExpiringItems([]);
        }
      } catch (err) {
        setError('Failed to load inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [refreshFlag]);

  return (
    <section
      className="card shadow-xl p-6 md:p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl card-header mb-6 flex items-center gap-2">⏰ Inventory Expiry Alerts</h2>

      {/* Add Inventory Form for staff/admin only */}
      {(userRole === 'admin' || userRole === 'staff') && (
        <AddInventoryItem onItemAdded={() => setRefreshFlag(f => !f)} />
      )}

      {loading ? (
        <p className="text-center text-[#7f8c8d] font-medium">Checking inventory freshness...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          {expiringItems.length === 0 ? (
            <div className="text-center space-y-2 py-6 text-[#2e5939]">
              <p className="text-5xl">🥦</p>
              <p className="text-lg font-semibold">Everything's fresh!</p>
              <p className="text-sm text-[#4a4a4a]">No expiry issues detected. 🍽️</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-2">
                Items nearing expiry (next 2 days)
              </p>
              {expiringItems.map((item) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                const style = getAlertStyle(days);
                const icon = getAlertIcon(days);

                return (
                  <div key={item._id} className={`rounded-lg px-4 py-3 ${style}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <span className="text-3xl">{icon}</span>
                        <div>
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-sm">Qty: {item.quantity} {item.unit || ""}</p>
                          <p className="text-sm text-gray-600">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-base text-right">
                        {days <= 0
                          ? "Expired"
                          : days === 1
                          ? "1 day left"
                          : `${days} days left`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 bg-[#fdfaf5] border border-[#dcdcdc] rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-[#5a4635] mb-2">🔎 What These Alerts Mean</h4>
            <ul className="text-sm text-[#4a4a4a] space-y-1 list-disc list-inside">
              <li><strong>🍅 Red:</strong> Expired items (discard recommended)</li>
              <li><strong>⏳ Yellow:</strong> Expires in 1 day</li>
              <li><strong>⚠️ Tan:</strong> Expires within 2 days</li>
              <li><strong>🥬 Green:</strong> Still good</li>
              <li>Auto scan runs every day at 9 AM</li>
              <li>Alerts can be expanded with SMS/WhatsApp notifications</li>
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default InventoryAlerts;
