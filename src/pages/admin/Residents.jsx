import { useEffect, useState } from "react";
import {
  getResidents,
  addResident,
  updateResident,
  deleteResident
} from "../../services/firestore.service";

export default function Residents() {
  const [residents, setResidents] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [status, setStatus] = useState("Active");

  // edit state
  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD RESIDENTS (SORTED) ================= */
  const loadResidents = async () => {
    const data = await getResidents();

    // ✅ SORT BY HOUSE NUMBER (ASCENDING)
    const sorted = data.sort(
      (a, b) => Number(a.houseNo) - Number(b.houseNo)
    );

    setResidents(sorted);
  };

  useEffect(() => {
    loadResidents();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      houseNo: Number(houseNo), // ✅ store as number
      phone,
      moveInDate,
      status
    };

    if (editingId) {
      await updateResident(editingId, payload);
    } else {
      await addResident(payload);
    }

    resetForm();
    loadResidents();
  };

  /* ================= EDIT ================= */
  const handleEdit = (resident) => {
    setEditingId(resident.id);
    setName(resident.name || "");
    setHouseNo(resident.houseNo || "");
    setPhone(resident.phone || "");
    setMoveInDate(resident.moveInDate || "");
    setStatus(resident.status || "Active");
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resident?")) return;
    await deleteResident(id);
    loadResidents();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setHouseNo("");
    setPhone("");
    setMoveInDate("");
    setStatus("Active");
  };

  return (
    <section className="admin-page">
      <h2 className="page-title">Residents</h2>

      {/* ADD / EDIT RESIDENT */}
      <div className="card form-card">
        <h3>{editingId ? "Edit Resident" : "Add New Resident"}</h3>

        <form onSubmit={handleSubmit} className="resident-form">
          <input
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="House Number *"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            required
          />

          <input
            placeholder="Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? "Update Resident" : "Create Resident"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* RESIDENTS TABLE */}
      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>House No</th>
              <th>Phone</th>
              <th>Move-in Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {residents.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No residents found
                </td>
              </tr>
            ) : (
              residents.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.houseNo}</td>
                  <td>{r.phone || "—"}</td>
                  <td>{r.moveInDate || "—"}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        r.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
