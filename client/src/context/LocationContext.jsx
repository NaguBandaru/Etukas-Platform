import { createContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    // Default location (Can be set to a major city center if undefined)
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);

    useEffect(() => {
        // Try getting localStorage location first
        const savedLoc = localStorage.getItem('etukas_location');
        if (savedLoc) {
            setLocation(JSON.parse(savedLoc));
            setLocationLoading(false);
        } else {
            // Auto detect
            detectLocation();
        }
    }, []);

    const detectLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLoc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: 'Current Location' // You might want to reverse geocode this
                    };
                    setLocation(newLoc);
                    localStorage.setItem('etukas_location', JSON.stringify(newLoc));
                    setLocationLoading(false);
                },
                (error) => {
                    setLocationError('Unable to retrieve your location');
                    setLocationLoading(false);
                }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser');
            setLocationLoading(false);
        }
    };

    const setManualLocation = (lat, lng, address) => {
        const newLoc = { lat, lng, address };
        setLocation(newLoc);
        localStorage.setItem('etukas_location', JSON.stringify(newLoc));
    };

    return (
        <LocationContext.Provider value={{ location, locationError, locationLoading, detectLocation, setManualLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationContext;
