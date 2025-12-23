import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  saveMaintenanceBill,
  getMaintenanceBills,
  updateMaintenanceBill
} from "../../services/firestore.service";

export default function Expenses() {
  const [billId, setBillId] = useState(null);
  const [billTitle, setBillTitle] = useState("");
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    houseNo: "",
    date: "",
    amount: ""
  });

  /* ================= HELPER: SORT BY HOUSE NO ================= */
  const sortByHouseNo = (list) =>
    [...list].sort(
      (a, b) => Number(a.houseNo) - Number(b.houseNo)
    );

  /* ================= LOAD BILL FROM FIRESTORE ================= */
  useEffect(() => {
    async function loadBill() {
      const bills = await getMaintenanceBills();

      if (bills.length > 0) {
        const bill = bills[0]; // single active bill
        setBillId(bill.id);
        setBillTitle(bill.title);
        setEntries(sortByHouseNo(bill.entries || []));
      }
    }

    loadBill();
  }, []);

  /* ================= ADD ENTRY ================= */
  const addEntry = () => {
    if (Object.values(form).some((v) => !v)) {
      alert("Please fill all fields");
      return;
    }

    const updated = sortByHouseNo([
      ...entries,
      {
        ...form,
        houseNo: Number(form.houseNo),
        amount: Number(form.amount)
      }
    ]);

    setEntries(updated);
    resetForm();
  };

  /* ================= EDIT ENTRY ================= */
  const startEdit = (index) => {
    setEditingIndex(index);
    setForm(entries[index]);
  };

  const saveEdit = () => {
    const updated = [...entries];
    updated[editingIndex] = {
      ...form,
      houseNo: Number(form.houseNo),
      amount: Number(form.amount)
    };

    setEntries(sortByHouseNo(updated));
    setEditingIndex(null);
    resetForm();
  };

  /* ================= DELETE ENTRY ================= */
  const deleteEntry = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(sortByHouseNo(updated));
  };

  /* ================= SAVE BILL (FIRESTORE) ================= */
  const saveBill = async () => {
    if (!billTitle || entries.length === 0) {
      alert("Bill title or entries missing");
      return;
    }

    const sortedEntries = sortByHouseNo(entries);

    if (!billId) {
      const id = await saveMaintenanceBill({
        title: billTitle,
        entries: sortedEntries
      });
      setBillId(id);
    } else {
      await updateMaintenanceBill(billId, sortedEntries);
    }

    alert("Bill saved successfully");
  };

  /* ================= PDF ================= */
  const downloadPDF = () => {
    if (!billTitle || entries.length === 0) {
      alert("Nothing to download");
      return;
    }

    const sortedEntries = sortByHouseNo(entries);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(billTitle, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["S.No", "Name", "House No", "Date", "Amount"]],
      body: sortedEntries.map((e, i) => [
        i + 1,
        e.name,
        e.houseNo,
        e.date,
        `₹ ${e.amount}`
      ]),
      theme: "grid"
    });

    doc.save(`${billTitle}.pdf`);
  };

  const resetForm = () => {
    setForm({ name: "", houseNo: "", date: "", amount: "" });
  };

  /* ================= UI ================= */
  return (
    <section className="admin-page">
      <h2 className="page-title">Maintenance Bill</h2>

      {/* BILL TITLE */}
      <div className="card">
        <label>Bill Title</label>
        <input
          value={billTitle}
          placeholder="e.g. December Maintenance"
          onChange={(e) => setBillTitle(e.target.value)}
        />
      </div>

      {/* ADD / EDIT ENTRY */}
      <div className="card">
        <h3>{editingIndex !== null ? "Edit Entry" : "Add Entry"}</h3>

        <div className="form-grid">
          <input
            placeholder="Resident Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            placeholder="House No"
            value={form.houseNo}
            onChange={(e) =>
              setForm({ ...form, houseNo: e.target.value })
            }
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
        </div>

        {editingIndex !== null ? (
          <button className="primary-btn" onClick={saveEdit}>
            Save Edit
          </button>
        ) : (
          <button className="primary-btn" onClick={addEntry}>
            Add Entry
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>Bill Entries</h3>

        {entries.length === 0 ? (
          <p>No entries added yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>House</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>{e.houseNo}</td>
                  <td>{e.date}</td>
                  <td>₹ {e.amount}</td>
                  <td className="action-cell">
                    <button
                      className="secondary-btn"
                      onClick={() => startEdit(i)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => deleteEntry(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button className="primary-btn" onClick={saveBill}>
            Save Bill
          </button>
          <button className="secondary-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
