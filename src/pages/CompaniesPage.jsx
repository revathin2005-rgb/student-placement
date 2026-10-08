import { useMemo, useState } from 'react'
import { Building2, Search, Star } from 'lucide-react'
import CompaniesGrid from '../components/CompaniesGrid'
import { useApp } from '../context/AppContext'

export default function CompaniesPage() {
  const { companyList } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [selectedCompany, setSelectedCompany] = useState(null)

  const industries = ['All', ...new Set(companyList.map((company) => company.industry))]

  const filteredCompanies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return companyList.filter((company) => {
      const matchesIndustry = industryFilter === 'All' || company.industry === industryFilter
      const matchesSearch = !query || company.name.toLowerCase().includes(query) || company.location.toLowerCase().includes(query)
      return matchesIndustry && matchesSearch
    })
  }, [companyList, industryFilter, searchTerm])

  return (
    <div className="page-content">
      <section className="page-header">
        <div>
          <p className="eyebrow accent">Company network</p>
          <h1>Companies</h1>
        </div>
      </section>

      <section className="panel filters-panel">
        <div className="search-stack">
          <div className="search-field">
            <Search size={17} />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search company or location" />
          </div>
          <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}>
            {industries.map((industry) => <option key={industry} value={industry}>{industry === 'All' ? 'All industries' : industry}</option>)}
          </select>
        </div>
      </section>

      {filteredCompanies.length ? (
        <CompaniesGrid companies={filteredCompanies} onSelectCompany={setSelectedCompany} />
      ) : (
        <div className="empty-state large"><Building2 size={32} /><h3>No companies found</h3><p>Change your industry or search criteria.</p></div>
      )}

      {selectedCompany ? (
        <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
          <div className="modal-card company-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div className="company-card-header">
                <div className="company-logo large">{selectedCompany.name.slice(0, 2).toUpperCase()}</div>
                <div><p className="eyebrow">{selectedCompany.industry}</p><h2>{selectedCompany.name}</h2></div>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelectedCompany(null)} aria-label="Close company details">×</button>
            </div>

            <p className="company-about">{selectedCompany.about}</p>
            <div className="company-detail-grid">
              <div><span>Open positions</span><strong>{selectedCompany.openPositions}</strong></div>
              <div><span>Average package</span><strong>{selectedCompany.averagePackage}</strong></div>
              <div><span>Location</span><strong>{selectedCompany.location}</strong></div>
              <div><span>Rating</span><strong><Star size={15} fill="currentColor" /> {selectedCompany.rating}</strong></div>
            </div>
            <div className="company-jobs">
              <h3>Open roles</h3>
              <div className="tag-list">
                <span className="tag">Software Developer</span>
                <span className="tag">Frontend Developer</span>
                <span className="tag">Data Analyst</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
