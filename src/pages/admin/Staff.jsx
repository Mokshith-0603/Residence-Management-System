import { useEffect, useState } from "react";
import {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff
} from "../../services/staff.service";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  const loadStaff = async () => {
    const data = await getStaff();
    setStaff(data);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const submit = async () => {
    if (!form.name || !form.role || !form.phone) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      await updateStaff(editingId, form);
      setEditingId(null);
    } else {
      await addStaff(form);
    }

    setForm({ name: "", role: "", phone: "" });
    loadStaff();
  };

  return (
    <section className="admin-page">
      <h2 className="page-title">Staff Management</h2>

      <div className="card">
        <div className="form-grid">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <button className="primary-btn" onClick={submit}>
          {editingId ? "Update Staff" : "Add Staff"}
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td>{s.phone}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingId(s.id);
                      setForm(s);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteStaff(s.id).then(loadStaff)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
