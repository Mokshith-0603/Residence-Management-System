import { useEffect, useState } from "react";
import { getResidents } from "../../services/firestore.service";

export default function PublicResidents() {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    getResidents().then(setResidents);
  }, []);

  return (
    <section className="page-section">
      <h1 className="page-title">Residents</h1>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>House No</th>
              <th>Move-in Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.name}</td>
                <td>{r.houseNo}</td>
                <td>{r.moveInDate || "—"}</td>
                <td>
                  <span className="status-badge active">
                    {r.status || "Active"}
                  </span>
                </td>
              </tr>
            ))}

            {residents.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  No residents available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
