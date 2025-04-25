import React, { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({
  uniqueSpecialties,
  selectedMode,
  handleModeChange,
  selectedSpecialties,
  handleSpecialtyChange,
  sortBy,
  handleSortChange,
  handleClearFilters
}) {
  const [specialtySearch, setSpecialtySearch] = useState('');

  const filteredSpecialties = uniqueSpecialties.filter(spec =>
    spec.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  return (
    <aside className="filter-panel">

      <div className="filter-section sort-by-section">
        <h3 className="section-title">Sort by</h3>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="sort"
              value="fees"
              checked={sortBy === 'fees'}
              onChange={handleSortChange}
            /> Price: Low-High
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="experience"
              checked={sortBy === 'experience'}
              onChange={handleSortChange}
            /> Experience- Most Experience first
          </label>
           <label style={{ display: 'none' }}>
             <input
               type="radio"
               name="sort"
               value=""
               checked={sortBy === ''}
               onChange={handleSortChange}
             /> Default
           </label>
        </div>
      </div>

      <div className="filter-header">
        <h2 className="section-title">Filters</h2>
        <button onClick={handleClearFilters} className="clear-filters-btn">Clear All</button>
      </div>

      <div className="filter-section specialties-section">
        <div className="section-header">
          <h3 className="section-title">Specialities</h3>
        </div>

        <div className="section-content">
          <div className="specialty-search-container">
            <span className="search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search specialities"
              value={specialtySearch}
              onChange={(e) => setSpecialtySearch(e.target.value)}
              className="specialty-search-input"
            />
          </div>
          <div className="filter-options specialties-options">
            {filteredSpecialties.length > 0 ? filteredSpecialties.map(spec => (
              <label key={spec} className="checkbox-label">
                <input
                  type="checkbox"
                  value={spec}
                  checked={selectedSpecialties.includes(spec)}
                  onChange={handleSpecialtyChange}
                  className="filter-checkbox"
                />
                <span className="checkbox-custom"></span>
                {spec}
              </label>
            )) : <p className="no-results-text">No matching specialities.</p>}
          </div>
        </div>
      </div>

      <div className="filter-section mode-section">
        <h3 className="section-title">Mode of consultation</h3>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="mode"
              value="video"
              checked={selectedMode === 'video'}
              onChange={handleModeChange}
            /> Video Consultation
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="in_clinic"
              checked={selectedMode === 'in_clinic'}
              onChange={handleModeChange}
            /> In-clinic Consultation
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value=""
              checked={selectedMode === ''}
              onChange={handleModeChange}
            /> All
          </label>
        </div>
      </div>

    </aside>
  );
}

export default FilterPanel;
