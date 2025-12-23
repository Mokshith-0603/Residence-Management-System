import { useEffect, useState } from "react";
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement
} from "../../services/firestore.service";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadData = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAnnouncement({
      title,
      description,
      date: new Date()
    });
    setTitle("");
    setDescription("");
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    loadData();
  };

  return (
    <section>
      <h2>Announcement</h2>

      {/* ADD ANNOUNCEMENT */}
      <form className="announcement-form" onSubmit={handleSubmit}>
        <input
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Announcement description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button>Add Announcement</button>
      </form>

      {/* ANNOUNCEMENT LIST */}
      <div className="announcement-list">
        {announcements.map((a) => (
          <div key={a.id} className="announcement-card">
            <h4>{a.title}</h4>
            <p>{a.description}</p>
            <button onClick={() => handleDelete(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
