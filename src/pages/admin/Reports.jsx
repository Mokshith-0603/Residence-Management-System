import { useEffect, useState } from "react";
import {
  getReports,
  updateReportStatus,
  deleteReport
} from "../../services/firestore.service";

export default function Reports() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    const data = await getReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateReportStatus(id, status);
    loadReports();
  };

  const handleDelete = async (id) => {
    await deleteReport(id);
    loadReports();
  };

  return (
    <section>
      <h2>Reports</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Message</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.category}</td>
              <td>{r.message}</td>
              <td>
                <select
                  value={r.status}
                  onChange={(e) =>
                    handleStatusChange(r.id, e.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
