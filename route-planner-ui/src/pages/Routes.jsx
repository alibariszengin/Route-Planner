import React, {useEffect, useState} from 'react';
import {useApiOperations} from "../hooks/useApiOperations.jsx";
import {changeMetadataInformation, getMetadataByPageName} from "./pageMetadatas.jsx";
import {useFormData} from "../hooks/useFormData.jsx";
import {RouteDetail} from "../components/RouteDetail/RouteDetail.jsx";
import {RouteForm} from "../components/RouteForm/RouteForm.jsx";
import {RouteTable} from "../components/RouteTable/RouteTable.jsx";


const RoutesPage = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [routes, setRoutes] = useState([]);
    const [locations, setLocations] = useState([]);

    const [metadata, setMetadata] = useState(getMetadataByPageName("Routes"));
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showRouteDetails, setShowRouteDetails] = useState(false);
    const { fetchData: fetchRoutes } = useApiOperations(metadata);

    let locationsMetadata = {
        endpoint: 'locations',
        pageName: 'Locations'
    };
    const {
        fetchData: fetchLocations
    } = useApiOperations(locationsMetadata);
    const {
        formData,
        updateFormField
    } = useFormData(metadata);
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await fetchLocations();
                setLocations(data);
                changeMetadataInformation("Routes", "fields.originLocationId", "optionsSource", data);
                changeMetadataInformation("Routes", "fields.destinationLocationId", "optionsSource", data);
            } catch (err) {
                console.error('Failed to load locations:', err);
            }
        };
        loadLocations();
    }, []);

    const onFieldChange = (key, value) => {
        updateFormField(key, value);
    }
    const handleSearch = async () => {
        setShowRouteDetails(false)
        console.log('Searching for routes from', origin, 'to', destination);
        setRoutes([])
        let dayOfWeek = new Date(formData?.routeDate)?.getDay();
        if (dayOfWeek === 0) {
            dayOfWeek = 7;
        }
        let param = `originLocation=${formData.originLocationId}&destinationLocation=${formData.destinationLocationId}`;
        if (dayOfWeek) {
            param = param + `&dayOfWeek=${dayOfWeek}`;
        }
        changeMetadataInformation("Routes", null, "requestParams", param);

        await fetchRoutes().then((data) => {
            setOrigin(formData.originLocationId)
            setDestination(formData.destinationLocationId)
            setRoutes(data)
        })


    };

    const handleRouteClick = (route) => {
        setSelectedRoute(route);
        setShowRouteDetails(true);
    };

    const closeRouteDetails = () => {
        setShowRouteDetails(false);
        setSelectedRoute(null);
    };

    return (
        <div className="flex h-full bg-gray-50">

            <div className={`flex-1 p-6 transition-all duration-300 ${showRouteDetails ? 'mr-80' : ''}`}>

                <RouteForm metadata={metadata} handleSearch={handleSearch} onFieldChange={onFieldChange} formData={formData}/>

                <RouteTable routes={routes} handleRouteClick={handleRouteClick} locations={locations} origin={origin} destination={destination}/>
            </div>


            {showRouteDetails && (
                <RouteDetail selectedRoute={selectedRoute} closeRouteDetails={closeRouteDetails}/>
            )}
        </div>
    );
};

export default RoutesPage;