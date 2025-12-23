import { useEffect, useState } from "react";
import { getAnnouncements } from "../../services/announcement.service";
import { groupAnnouncementsByDate } from "../../utils/groupByDate";

export default function Announcements() {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    async function load() {
      const data = await getAnnouncements();

      // sort latest first
      data.sort(
        (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
      );

      setGrouped(groupAnnouncementsByDate(data));

      // mark announcements as read
      localStorage.setItem("announcementsViewedAt", new Date().toISOString());
    }

    load();
  }, []);

  return (
    <section className="announcements-page">
      <h2>Announcements</h2>

      {Object.keys(grouped).map((date) => (
        <div key={date} className="announcement-group">
          <p className="announcement-date">{date}</p>

          {grouped[date].map((a) => (
            <div key={a.id} className="announcement-card">
              <h4>{a.title}</h4>
              <p>{a.description}</p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
