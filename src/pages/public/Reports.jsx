import { useState } from "react";
import { addReport } from "../../services/firestore.service";

export default function Reports() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("complaint");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReport({ name, category, message });
    setSubmitted(true);
    setName("");
    setMessage("");
  };

  if (submitted) {
    return (
      <section className="section">
        <h2>Thank you!</h2>
        <p>Your report has been submitted successfully.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Submit a Report</h2>

      <form className="report-form" onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="complaint">Complaint</option>
          <option value="suggestion">Suggestion</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <textarea
          placeholder="Describe the issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button>Submit Report</button>
      </form>
    </section>
  );
}
