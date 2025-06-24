import React, {useEffect, useState} from 'react';
import BasePage from "../components/BasePage.jsx";

const SERVER_URL = 'http://localhost:8080'; // Kendi server URL'inizi buraya yazın

const TransportationsPage = () => {
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Component mount olduğunda data verilerini API'den çek
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${SERVER_URL}/api/v1/locations`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setLocations(data);
        } catch (err) {
            console.error('Error while loading Locations:', err);
            setError('Error while loading Locations:' + err.message);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="page-section">
                <div className="loading">Transportations Loading...</div>
            </div>
        );
    }
    return (
        <BasePage metadata={{
            endpoint: 'transportations',
            pageName: 'Transportations',
            name: 'Transportation',
            updateAfterCreateEdit:true,
            fields: {
                type: {
                    inputType: "dropdown",
                    optionsSource:[{
                            type: "BUS"
                        }, {type :"FLIGHT"}, { type: "UBER"}, {type:"TAXI"}],
                    valueKey: "type",
                    labelKey:"type",
                    label: "Transportation Type",
                    placeholder: "Example: BUS, FLIGHT, TRAIN",
                    required: true
                },
                originLocationId: {
                    inputType: "dropdown",
                    field: "originLocation.name",
                    pkField:"originLocation.id",
                    optionsSource:locations,
                    valueKey: "id",
                    labelKey: "name",
                    label: "Origin Location Name",
                    placeholder: "Example: Istanbul Airport",
                    required: true
                },
                destinationLocationId: {
                    inputType: "dropdown",
                    optionsSource:locations,
                    valueKey: "id",
                    labelKey: "name",
                    field: "destinationLocation.name",
                    pkField:"destinationLocation.id",
                    label: "Destination Location Name",
                    placeholder: "Example: Ankara Station",
                    required: true
                }
            }
        }}/>
    )
};

export default TransportationsPage;