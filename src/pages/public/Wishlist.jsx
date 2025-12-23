import { useEffect, useState } from "react";
import { getWishlistItems } from "../../services/wishlist.service";

export default function PublicWishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    const data = await getWishlistItems();
    setItems(data);
  }

  return (
    <section className="public-page">
      <h1 className="page-title">Wishlist (Future Purchases)</h1>
      <p className="page-subtitle">
        Planned items for community improvement
      </p>

      {items.length === 0 ? (
        <p className="empty-text">No wishlist items added yet.</p>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <h3 className="wishlist-title">{item.title}</h3>

              <div className="wishlist-meta">
                <span className={`priority ${item.priority.toLowerCase()}`}>
                  {item.priority} Priority
                </span>
              </div>

              <p className="wishlist-cost">
                Approx Cost: <strong>₹ {item.cost}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
