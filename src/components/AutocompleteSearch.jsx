import React, { useState, useEffect, useRef } from 'react';
import './AutocompleteSearch.css';

function AutocompleteSearch({ searchTerm, setSearchTerm, allDoctors, onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const filteredSuggestions = allDoctors
      .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [searchTerm, allDoctors]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length <= 1) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (name) => {
    onSuggestionClick(name);
    setSearchTerm(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  return (
    <div className="autocomplete-search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by Name, Specialities, Clinic"
        value={searchTerm}
        onChange={handleChange}
        ref={inputRef}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(doc => (
            <li
              key={doc.id || doc.name}
              onClick={() => handleSelect(doc.name)}
              className="suggestion-item"
            >
              {doc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteSearch;
