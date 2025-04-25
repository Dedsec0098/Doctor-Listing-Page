import React, { useState, useEffect, useCallback } from 'react';
import AutocompleteSearch from './components/AutocompleteSearch';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';
import './App.css';
import './index.css';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const parseExperience = (expString) => {
  if (!expString) return 0;
  const match = expString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const parseFee = (feeString) => {
  if (!feeString) return Infinity;
  const cleanedString = feeString.replace(/[^\d.]/g, '');
  return cleanedString ? parseFloat(cleanedString) : Infinity;
};

function App() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState(null);
    const [uniqueSpecialties, setUniqueSpecialties] = useState(new Set());
    const [fetchError, setFetchError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMode, setSelectedMode] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setFilteredDoctors(null);
            setFetchError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                const processedData = data.map(doc => ({
                    ...doc,
                }));
                setAllDoctors(processedData);
                setFilteredDoctors(processedData);

                const specialties = new Set();
                processedData.forEach(doctor => {
                    if (Array.isArray(doctor.specialities)) {
                        doctor.specialities.forEach(spec => {
                            if (spec.name) specialties.add(spec.name.trim());
                        });
                    }
                });
                setUniqueSpecialties(specialties);

            } catch (error) {
                console.error("Failed to fetch doctor data:", error);
                setFetchError(error.message);
                setAllDoctors([]);
                setFilteredDoctors([]);
                setUniqueSpecialties(new Set());
            }
        };
        fetchData();
    }, []);

    const applyFiltersFromURL = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchTerm(params.get('search') || '');
        setSelectedMode(params.get('mode') || '');
        setSelectedSpecialties(params.get('specialties')?.split(',') || []);
        setSortBy(params.get('sort') || '');
    }, []);

     useEffect(() => {
        applyFiltersFromURL();

        const handlePopState = () => {
            applyFiltersFromURL();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [applyFiltersFromURL]);


    useEffect(() => {
        if (allDoctors.length === 0 && !fetchError) {
            return;
        }
        if (fetchError) return;

        let doctors = [...allDoctors];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            doctors = doctors.filter(doc => {
                const nameMatch = doc.name?.toLowerCase().includes(lowerSearchTerm);
                const clinicMatch = doc.clinic?.name?.toLowerCase().includes(lowerSearchTerm);
                const specialtyMatch = Array.isArray(doc.specialities) && doc.specialities.some(spec =>
                    spec.name?.toLowerCase().includes(lowerSearchTerm)
                );
                return nameMatch || clinicMatch || specialtyMatch;
            });
        }

        if (selectedMode === 'video') {
            doctors = doctors.filter(doc => doc.video_consult === true);
        } else if (selectedMode === 'in_clinic') {
            doctors = doctors.filter(doc => doc.in_clinic === true);
        }

        if (selectedSpecialties.length > 0) {
            doctors = doctors.filter(doc => {
                const doctorSpecNames = Array.isArray(doc.specialities) ? doc.specialities.map(s => s.name?.trim().toLowerCase()) : [];
                return selectedSpecialties.some(selSpec =>
                    doctorSpecNames.includes(selSpec.toLowerCase())
                );
            });
        }

        if (sortBy === 'fees') {
            doctors.sort((a, b) => parseFee(a.fees) - parseFee(b.fees));
        } else if (sortBy === 'experience') {
            doctors.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience));
        }

        setFilteredDoctors(doctors);

        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedMode) params.set('mode', selectedMode);
        if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
        if (sortBy) params.set('sort', sortBy);
        window.history.replaceState(null, '', `?${params.toString()}`);

    }, [searchTerm, selectedMode, selectedSpecialties, sortBy, allDoctors, fetchError]);


    const handleModeChange = (event) => {
        setSelectedMode(event.target.value);
    };

    const handleSpecialtyChange = (event) => {
        const { value, checked } = event.target;
        setSelectedSpecialties(prev =>
            checked ? [...prev, value] : prev.filter(spec => spec !== value)
        );
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

     const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedMode('');
        setSelectedSpecialties([]);
        setSortBy('');
    };

    const handleSearchSelect = (name) => {
        setSearchTerm(name);
    };


    return (
        <div className="app-container">
            <header className="app-header">
                <AutocompleteSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    allDoctors={allDoctors}
                    onSuggestionClick={handleSearchSelect}
                />
            </header>
            <div className="main-content">
                <aside className="filter-column">
                    <FilterPanel
                        uniqueSpecialties={Array.from(uniqueSpecialties)}
                        selectedMode={selectedMode}
                        handleModeChange={handleModeChange}
                        selectedSpecialties={selectedSpecialties}
                        handleSpecialtyChange={handleSpecialtyChange}
                        sortBy={sortBy}
                        handleSortChange={handleSortChange}
                        handleClearFilters={handleClearFilters}
                    />
                </aside>
                <main className="doctor-list-column">
                    {filteredDoctors === null && <p>Loading doctors...</p>} 
                    {fetchError && <p>Error fetching doctors: {fetchError}</p>}
                    {filteredDoctors !== null && !fetchError && (
                        <DoctorList doctors={filteredDoctors} />
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
