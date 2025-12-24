import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from "firebase/firestore";
import { db } from "../../services/firebase";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: ""
  });

  /* ================= LOAD EVENTS ================= */
  const loadEvents = async () => {
    const snap = await getDocs(collection(db, "events"));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ================= ADD / UPDATE EVENT ================= */
  const saveEvent = async () => {
    if (!form.title || !form.date || !form.time) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      await updateDoc(doc(db, "events", editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "events"), {
        ...form,
        createdAt: Timestamp.now()
      });
    }

    setForm({ title: "", date: "", time: "" });
    loadEvents();
  };

  /* ================= EDIT ================= */
  const editEvent = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time
    });
  };

  /* ================= DELETE ================= */
  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    loadEvents();
  };

  return (
    <section className="admin-page">
      <h2 className="page-title">Events</h2>

      {/* ADD / EDIT FORM */}
      <div className="card">
        <h3>{editingId ? "Edit Event" : "Add Event"}</h3>

        <div className="form-grid">
          <input
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            placeholder="Time (e.g. 8:00 PM)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>

        <button className="primary-btn" onClick={saveEvent}>
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </div>

      {/* EVENTS TABLE */}
      <div className="card">
        <h3>All Events</h3>

        {events.length === 0 ? (
          <p>No events added</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>{e.date}</td>
                  <td>{e.time}</td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => editEvent(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteEvent(e.id)}
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
