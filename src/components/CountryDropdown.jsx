import React from 'react';

const CountryDropdown = ({ countries, selected, onChange, loading, error }) => {
  if (error) return <div className="error">{error}</div>;
  if (loading) return <div>Loading countries...</div>;

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="country-select"
      disabled={!countries.length}
    >
      {countries.map(({ code, name }) => (
        <option key={code} value={code}>{name}</option>
      ))}
    </select>
  );
};

export default CountryDropdown;