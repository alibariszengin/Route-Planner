import React, {useEffect, useState} from 'react';
import BasePage from "../components/BasePage/BasePage.jsx";
import {useApiOperations} from "../hooks/useApiOperations.jsx";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner.jsx";
import {changeMetadataInformation, getMetadataByPageName} from "./pageMetadatas.jsx";
import {useDebouncedLoading} from "../hooks/useDebounceLoading.jsx";

const SERVER_URL = 'http://localhost:8080'; // Kendi server URL'inizi buraya yazın

const TransportationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [metadata, setMetadata] = useState(getMetadataByPageName("Transportations"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const locationsMetadata = {
        endpoint: 'locations',
        pageName: 'Locations'
    };
    const { fetchData: fetchLocations, loading: locationsLoading, error: locationsError } = useApiOperations(locationsMetadata);
    const showLoading = useDebouncedLoading(loading, 500);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await fetchLocations();
                console.log(data);
                setLocations(data);
                changeMetadataInformation("Transportations", "fields.originLocationId", "optionsSource", data);
                changeMetadataInformation("Transportations", "fields.destinationLocationId", "optionsSource", data);
            } catch (err) {
                // Error handling zaten hook içinde yapılıyor
                console.error('Failed to load locations:', err);
            }
        };


        loadLocations();
    }, []);

    if (showLoading) {
        return <LoadingSpinner pageName="Transportations"/>
    }

    if (locationsError) {
        return (
            <div className="page-section">
                <div className="error">Error: {locationsError}</div>
            </div>
        );
    }
    return (
        <BasePage metadata={
            metadata
        }/>
    )
};

export default TransportationsPage;