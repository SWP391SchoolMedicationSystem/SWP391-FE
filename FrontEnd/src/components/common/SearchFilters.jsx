import React from "react";

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  onImport = null,
  importLoading = false,
}) => {
  return (
    <div className="filters-section">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        {filters.map((filter, index) => (
          <select
            key={index}
            className="filter-select"
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((option, optIndex) => (
              <option key={optIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {onImport && (
          <button
            className="btn btn-secondary"
            onClick={onImport}
            disabled={importLoading}
          >
            {importLoading ? "⏳ Đang tải..." : "📤 Import"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
