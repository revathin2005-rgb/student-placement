export default function StatCard({ title, value, detail, icon: Icon, tone = 'primary' }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{detail}</span>
      </div>
    </article>
  )
}
