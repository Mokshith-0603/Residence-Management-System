import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../services/firebase";

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

  /* ================= EXPENSE STATES ================= */
  const [expenses, setExpenses] = useState([]);

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    date: ""
  });

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);

  /* ================= HELPER: SORT BY HOUSE NO ================= */
  const sortByHouseNo = (list) =>
    [...list].sort(
      (a, b) => Number(a.houseNo) - Number(b.houseNo)
    );

  /* ================= LOAD EXPENSES ================= */
  const loadExpenses = async () => {
    const snapshot = await getDocs(collection(db, "expenses"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setExpenses(data);

    const total = data.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    setTotalExpenses(total);
  };

  /* ================= ADD EXPENSE ================= */
  const addExpense = async () => {
    if (
      !expenseForm.title ||
      !expenseForm.amount ||
      !expenseForm.date
    ) {
      alert("Please fill all expense fields");
      return;
    }

    await addDoc(collection(db, "expenses"), {
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      createdAt: Timestamp.now()
    });

    setExpenseForm({ title: "", amount: "", date: "" });
    loadExpenses();
  };
  /* ================= EDIT EXPENSE ================= */
const startEditExpense = (index) => {
  setEditingExpenseIndex(index);
  setExpenseForm({
    title: expenses[index].title,
    amount: expenses[index].amount,
    date: expenses[index].date
  });
};

const saveEditExpense = async () => {
  const expense = expenses[editingExpenseIndex];

  await updateDoc(doc(db, "expenses", expense.id), {
    title: expenseForm.title,
    amount: Number(expenseForm.amount),
    date: expenseForm.date
  });

  setEditingExpenseIndex(null);
  setExpenseForm({ title: "", amount: "", date: "" });
  loadExpenses();
};

/* ================= DELETE EXPENSE ================= */
const deleteExpense = async (id) => {
  if (!window.confirm("Delete this expense?")) return;

  await deleteDoc(doc(db, "expenses", id));
  loadExpenses();
};


  /* ================= LOAD BILL FROM FIRESTORE ================= */
  useEffect(() => {
    async function loadBill() {
      const bills = await getMaintenanceBills();

      if (bills.length > 0) {
        const bill = bills[0];
        setBillId(bill.id);
        setBillTitle(bill.title);
        setEntries(sortByHouseNo(bill.entries || []));
      }
    }

    loadExpenses();
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

  /* ================= SAVE BILL ================= */
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

  const totalIncome = sortedEntries.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const doc = new jsPDF();

  /* ================= TITLE ================= */
  doc.setFontSize(18);
  doc.text(billTitle, 14, 20);

  /* ================= BILL ENTRIES TABLE ================= */
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

  let currentY = doc.lastAutoTable.finalY + 10;

  /* ================= EXPENSES TABLE ================= */
  if (expenses.length > 0) {
    doc.setFontSize(14);
    doc.text("Expenses", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["S.No", "Title", "Amount", "Date"]],
      body: expenses.map((e, i) => [
        i + 1,
        e.title,
        `Rs. ${e.amount}`,
        e.date
      ]),
      theme: "grid"
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  /* ================= SUMMARY ================= */
  doc.setFontSize(14);
  doc.text("Summary", 14, currentY);

  doc.setFontSize(12);
  doc.text(`Total Income: Rs. ${totalIncome}`, 14, currentY + 8);
  doc.text(`Total Expenses: Rs. ${totalExpenses}`, 14, currentY + 16);
    doc.save(`${billTitle}.pdf`);
  };

  const resetForm = () => {
    setForm({ name: "", houseNo: "", date: "", amount: "" });
  };

  const totalIncome = entries.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

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

      {/* BILL TABLE */}
      <div className="card">
        <h3>Bill Entries(Income)</h3>

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
                  <td>
                    <button className="btn btn-edit" onClick={() => startEdit(i)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => deleteEntry(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="btn btn-primary" onClick={saveBill}>Save Bill</button>
        
      </div>

      {/* ================= EXPENSES ================= */}
      <div className="card">
        <h3>Expenses</h3>

        <div className="form-grid">
          <input
            placeholder="Expense Title"
            value={expenseForm.title}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, amount: e.target.value })
            }
          />
          <input
            placeholder="date"
            value={expenseForm.date}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, date: e.target.value })
            }
          />
        </div>

        {editingExpenseIndex !== null ? (
  <button className="btn btn-primary" onClick={saveEditExpense}>
    Save Expense
  </button>
) : (
  <button className="btn btn-success" onClick={addExpense}>
    Add Expense
  </button>
)}


        {expenses.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>₹ {e.amount}</td>
                  <td>{e.date}</td>
<td>
  <button
    className="btn btn-edit"
    onClick={() => startEditExpense(i)}
  >
    Edit
  </button>
  <button
    className="btn btn-delete"
    onClick={() => deleteExpense(e.id)}
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

      {/* ================= SUMMARY ================= */}
      {/* ================= SUMMARY HIGHLIGHTS ================= */}
<div className="dashboard-grid modern" style={{ marginTop: "16px" }}>

  <div className="dashboard-card modern">
    <div className="card-icon">💵</div>
    <div>
      <p className="card-title">Total Income</p>
      <h3 className="card-value">₹ {totalIncome}</h3>
      <p className="card-sub">Maintenance collected</p>
    </div>
  </div>

  <div className="dashboard-card modern">
    <div className="card-icon">💰</div>
    <div>
      <p className="card-title">Total Expenses</p>
      <h3 className="card-value">₹ {totalExpenses}</h3>
      <p className="card-sub">Expenses logged</p>
    </div>
  </div>

</div>

      {/* ================= DOWNLOAD PDF ================= */}
<div className="card" style={{ textAlign: "center" }}>
  <button
    className="primary-btn"
    onClick={downloadPDF}
    style={{ padding: "12px 24px", fontSize: "16px" }}
  >
    Download Full Report PDF
  </button>
</div>
    </section>
  );
}
