import React, {useEffect, useState} from 'react';
import {Search, X} from 'lucide-react';
import {useApiOperations} from "../hooks/useApiOperations.jsx";
import FormField from "../components/FormField/FormField.jsx";
import {changeMetadataInformation, getMetadataByPageName} from "./pageMetadatas.jsx";
import {useFormData} from "../hooks/useFormData.jsx";


const RoutesPage = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [routes, setRoutes] = useState([]);

    const [metadata, setMetadata] = useState(getMetadataByPageName("Routes"));
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showRouteDetails, setShowRouteDetails] = useState(false);
    const { fetchData: fetchRoutes } = useApiOperations(metadata);

    let locationsMetadata = {
        endpoint: 'locations',
        pageName: 'Locations'
    };
    const { fetchData: fetchLocations } = useApiOperations(locationsMetadata);
    const {
        formData,
        updateFormField
    } = useFormData(metadata);
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await fetchLocations();
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
        if (key === "originLocationId") {
            setOrigin(value);
        }

        if (key === "destinationLocationId") {
            setDestination(value);
        }
    }
    const handleSearch = async () => {

        const param = `originLocation=${origin}&destinationLocation=${destination}`;
        changeMetadataInformation("Routes", null, "requestParams", param);

        const data = await fetchRoutes()
        setRoutes(data)
        console.log(data)
        console.log('Searching for routes from', origin, 'to', destination);
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

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="form-group">
                            {Object.entries(metadata.fields).map(([key, fieldConfig]) => (
                                <FormField
                                    key={key}
                                    fieldKey={key}
                                    fieldConfig={fieldConfig}
                                    value={formData[key]}
                                    onChange={onFieldChange}
                                />
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={handleSearch}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                <Search size={16} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm text-black">
                    <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-medium text-gray-900">Available Routes</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {routes.map((route) => (
                            <div
                                key={route.id}
                                onClick={() => handleRouteClick(route)}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <p className="text-gray-900">{route.transportations.find(transportation => transportation.type === "FLIGHT").originLocation.code}</p>
                            </div>)
                        )}
                    </div>
                </div>
            </div>


            {showRouteDetails && (
                <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{selectedRoute.transportations[0].originLocation.name}</h3>
                        <button
                            onClick={closeRouteDetails}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="space-y-4">
                            {selectedRoute.transportations.map((transportation) => (
                                <div key={transportation.id} className="flex items-center space-x-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0">
                                        {transportation.type === 'BUS' && <div className="w-full h-full bg-blue-500 rounded-full"></div>}
                                        {transportation.type === 'FLIGHT' && <div className="w-full h-full bg-green-500 rounded-full"></div>}
                                        {transportation.type === 'UBER' && <div className="w-full h-full bg-black rounded-full"></div>}
                                        {transportation.type === 'SUBWAY' && <div className="w-full h-full bg-red rounded-full"></div>}
                                    </div>
                                    <span className="text-gray-700">({transportation.type}) {transportation.destinationLocation.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutesPage;