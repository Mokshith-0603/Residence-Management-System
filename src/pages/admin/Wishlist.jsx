import { useEffect, useState } from "react";
import {
  getWishlistItems,
  addWishlistItem,
  deleteWishlistItem
} from "../../services/wishlist.service";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [cost, setCost] = useState("");

  const loadItems = async () => {
    const data = await getWishlistItems();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async () => {
    if (!title || !cost) {
      alert("Fill all fields");
      return;
    }

    await addWishlistItem({
      title,
      priority,
      cost: Number(cost)
    });

    setTitle("");
    setPriority("Medium");
    setCost("");
    loadItems();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteWishlistItem(id);
    loadItems();
  };

  return (
    <section className="admin-page">
      <h2 className="page-title">Wishlist (Future Purchases)</h2>

      {/* ADD FORM */}
      <div className="card">
        <h3>Add Wishlist Item</h3>

        <div className="form-grid">
          <input
            placeholder="Product name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="number"
            placeholder="Approx Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={addItem}>
          Add Item
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3>Wishlist Items</h3>

        {items.length === 0 ? (
          <p>No wishlist items added yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Priority</th>
                <th>Approx Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={i.id}>
                  <td>{idx + 1}</td>
                  <td>{i.title}</td>
                  <td>{i.priority}</td>
                  <td>₹ {i.cost}</td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => deleteItem(i.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
