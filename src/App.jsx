import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDropdown from './components/CountryDropdown';
import StatsCards from './components/StatsCards';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import './index.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('usa');
  const [covidData, setCovidData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState({ countries: true, covid: false });
  const [error, setError] = useState(null);

  // Fetch countries list
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countriesData = response.data
          .map((country) => ({
            name: country.name.common,
            code: country.cca3?.toLowerCase() || '',
          }))
          .filter((country) => country.name && country.code)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(countriesData);
        setLoading(prev => ({ ...prev, countries: false }));
      } catch (err) {
        setError('Failed to fetch countries list');
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Fetch COVID data
  useEffect(() => {
    const fetchCovidData = async () => {
      try {
        setLoading(prev => ({ ...prev, covid: true }));
        const response = await axios.get(
          `https://disease.sh/v3/covid-19/historical/${selectedCountry}?lastdays=all`
        );
        
        const timeline = response.data.timeline;
        const parsedData = Object.entries(timeline.cases).map(([dateStr, cases]) => {
          const [month, day, year] = dateStr.split('/').map(Number);
          return {
            date: new Date(2000 + year, month - 1, day).toISOString().split('T')[0],
            cases,
            deaths: timeline.deaths[dateStr],
            recovered: timeline.recovered[dateStr]
          };
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        setCovidData(parsedData);
        setDateRange({
          start: parsedData[0]?.date,
          end: parsedData[parsedData.length - 1]?.date
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch COVID data');
        setCovidData(null);
      } finally {
        setLoading(prev => ({ ...prev, covid: false }));
      }
    };
    if (selectedCountry) fetchCovidData();
  }, [selectedCountry]);

  // Filter data by date range
  const filteredData = covidData?.filter(({ date }) => 
    date >= dateRange.start && date <= dateRange.end
  ) || [];

  // Calculate totals
  const totals = filteredData.length > 0 ? {
    cases: filteredData[filteredData.length - 1].cases - filteredData[0].cases,
    deaths: filteredData[filteredData.length - 1].deaths - filteredData[0].deaths,
    recovered: filteredData[filteredData.length - 1].recovered - filteredData[0].recovered
  } : { cases: 0, deaths: 0, recovered: 0 };

  return (
    <div className="dashboard">
      <h1>COVID-19 Dashboard</h1>
      
      <div className="controls">
        <CountryDropdown
          countries={countries}
          selected={selectedCountry}
          onChange={setSelectedCountry}
          loading={loading.countries}
          error={error}
        />
        
        {covidData && (
          <div className="date-range">
            <label>
              Start:
              <input
                type="date"
                value={dateRange.start}
                min={covidData[0]?.date}
                max={dateRange.end}
                onChange={e => setDateRange(prev => ({
                  ...prev,
                  start: e.target.value,
                  end: e.target.value > prev.end ? e.target.value : prev.end
                }))}
              />
            </label>
            <label>
              End:
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start}
                max={covidData[covidData.length - 1]?.date}
                onChange={e => setDateRange(prev => ({
                  ...prev,
                  end: e.target.value,
                  start: e.target.value < prev.start ? e.target.value : prev.start
                }))}
              />
            </label>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {loading.covid ? (
        <div className="loading">Loading COVID data...</div>
      ) : covidData ? (
        <>
          <StatsCards totals={totals} />
          <LineChart data={filteredData} />
          <PieChart totals={totals} />
        </>
      ) : (
        <div>No data available for selected country</div>
      )}
    </div>
  );
};

export default App;