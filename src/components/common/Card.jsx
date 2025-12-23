export default function Card({ title, value, subtitle }) {
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      <p className="card-value">{value}</p>
      {subtitle && <span className="card-subtitle">{subtitle}</span>}
    </div>
  );
}
