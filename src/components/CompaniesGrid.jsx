import { MapPin, Star, Users } from 'lucide-react'

export default function CompaniesGrid({ companies, onSelectCompany }) {
  return (
    <div className="companies-grid">
      {companies.map((company) => (
        <button
          type="button"
          key={company.id}
          className="company-card"
          onClick={() => onSelectCompany(company)}
        >
          <div className="company-card-header">
            <div className="company-logo large">{company.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <h3>{company.name}</h3>
              <p>{company.industry}</p>
            </div>
          </div>

          <div className="company-meta">
            <span><MapPin size={14} /> {company.location}</span>
            <span><Users size={14} /> {company.openPositions} roles</span>
          </div>

          <div className="company-footer">
            <span><Star size={14} fill="currentColor" /> {company.rating}</span>
            <strong>{company.averagePackage}</strong>
          </div>
        </button>
      ))}
    </div>
  )
}
