import { useEffect, useState } from "react";
import {
  getRules,
  addRule,
  updateRule,
  deleteRule
} from "../../services/firestore.service";

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    const data = await getRules();
    setRules(data);
  }

  async function handleSave() {
    if (!text.trim()) {
      alert("Rule cannot be empty");
      return;
    }

    if (editingId) {
      await updateRule(editingId, text);
      setEditingId(null);
    } else {
      await addRule(text);
    }

    setText("");
    loadRules();
  }

  async function handleDelete(id) {
    if (confirm("Delete this rule?")) {
      await deleteRule(id);
      loadRules();
    }
  }

  return (
    <section className="admin-page">
      <h2 className="page-title">Community Rules & Guidelines</h2>
      <p className="page-subtitle">
        Add rules here. They will be visible to the public.
      </p>

      {/* ADD / EDIT */}
      <div className="card">
        <textarea
          rows="3"
          placeholder="Enter a rule or guideline..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSave}>
          {editingId ? "Update Rule" : "Add Rule"}
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3>Existing Rules</h3>

        {rules.length === 0 ? (
          <p>No rules added yet</p>
        ) : (
          <ul className="rules-list">
            {rules.map((r, i) => (
              <li key={r.id} className="rule-item">
                <span>{i + 1}. {r.text}</span>

                <div className="rule-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setEditingId(r.id);
                      setText(r.text);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
