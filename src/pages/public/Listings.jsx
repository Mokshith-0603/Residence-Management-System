import { useEffect, useState } from "react";
import { getListings } from "../../services/firestore.service";

export default function PublicListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getListings();
      setListings(data);
    }
    load();
  }, []);

  return (
    <section className="public-page">
      <h2 className="page-title">Available Listings</h2>

      {listings.length === 0 ? (
        <p className="empty-text">No listings available at the moment.</p>
      ) : (
        <div className="listing-grid">
          {listings.map((l) => (
            <div key={l.id} className="listing-card">
              {l.imageUrl ? (
                <img src={l.imageUrl} alt={l.title} />
              ) : (
                <div className="listing-placeholder">
                  🏠
                </div>
              )}

              <div className="listing-body">
                <h4>{l.title}</h4>

                <p className="listing-desc">
                  {l.description}
                </p>

                <div className="listing-meta">
                  <span className="price">₹ {l.price}</span>
                  <span className={`tag ${l.type}`}>
                    {l.type === "rent" ? "Rent" : "Sale"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
