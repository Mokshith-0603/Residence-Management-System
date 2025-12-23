import { useEffect, useState } from "react";
import {
  getListings,
  addListing,
  deleteListing
} from "../../services/firestore.service";
import { uploadImage } from "../../services/storage.service";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("rent");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const loadListings = async () => {
    const data = await getListings();
    setListings(data);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
    }

    await addListing({
      title,
      type,
      price: Number(price),
      description,
      imageUrl,
      createdAt: new Date()
    });

    setTitle("");
    setPrice("");
    setDescription("");
    setImage(null);

    loadListings();
  };

  const handleDelete = async (id) => {
    await deleteListing(id);
    loadListings();
  };

  return (
    <section className="admin-page">
      <h2 className="page-title">Property Listings</h2>

      {/* ADD LISTING FORM */}
      <form className="listing-form" onSubmit={handleSubmit}>
        <input
          placeholder="Property title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          placeholder="Property description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="primary-btn">Add Listing</button>
      </form>

      {/* LISTINGS GRID */}
      <div className="listing-grid">
        {listings.map((l) => (
          <div key={l.id} className="listing-card">
            {l.imageUrl ? (
              <img src={l.imageUrl} alt={l.title} />
            ) : (
              <div className="listing-placeholder">
                <span>🏠</span>
              </div>
            )}

            <div className="listing-body">
              <h4>{l.title}</h4>
              <p className="listing-desc">{l.description}</p>

              <div className="listing-meta">
                <span className="price">₹ {l.price}</span>
                <span className="tag">{l.type}</span>
              </div>

              <button
                className="danger-btn"
                onClick={() => handleDelete(l.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
