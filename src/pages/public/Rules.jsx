import { useEffect, useState } from "react";
import { getRules } from "../../services/firestore.service";

export default function Rules() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    getRules().then(setRules);
  }, []);

  return (
    <section className="public-page">
      <h1>Community Rules & Guidelines</h1>
      <p>Please follow the rules to maintain harmony.</p>

      <div className="rules-container">
        {rules.length === 0 ? (
          <p>No rules published yet.</p>
        ) : (
          <ul className="public-rules">
            {rules.map((r, i) => (
              <li key={r.id}>
                <strong>{i + 1}.</strong> {r.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
