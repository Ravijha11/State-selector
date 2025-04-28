import { useState, useEffect } from 'react';
import '../styles/LocationSelector.css';

const LocationSelector = () => {
  // State for storing countries, states, cities and selections
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Selected values
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
    // Reset state and city selections when country changes
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`);
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
    // Reset city selection when state changes
    setSelectedCity('');
  }, [selectedCountry, selectedState]);

  // Handle country selection
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  // Handle state selection
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Handle city selection
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="location-selector">
      <div className="dropdowns">
        {/* Country Dropdown */}
        <div className="dropdown">
          <select 
            value={selectedCountry} 
            onChange={handleCountryChange}
            disabled={isLoadingCountries}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {isLoadingCountries && <span className="loading">Loading...</span>}
        </div>

        {/* State Dropdown */}
        <div className="dropdown">
          <select 
            value={selectedState} 
            onChange={handleStateChange}
            disabled={!selectedCountry || isLoadingStates}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {isLoadingStates && <span className="loading">Loading...</span>}
        </div>

        {/* City Dropdown */}
        <div className="dropdown">
          <select 
            value={selectedCity} 
            onChange={handleCityChange}
            disabled={!selectedState || isLoadingCities}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {isLoadingCities && <span className="loading">Loading...</span>}
        </div>
      </div>

      {/* Display selected location */}
      {selectedCity && (
        <div className="selected-location">
          <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;