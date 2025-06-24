import React from 'react';
import BasePage from "../components/BasePage.jsx";



const LocationsPage = () => {

    return (
        <BasePage metadata={{
            endpoint: 'locations',
            pageName: 'Locations',
            name: 'Location',
            fields: {
                name : {
                    label: "Location Name",
                    placeholder: "Example: Istanbul Airport",
                    required: true
                },
                code : {
                    label: "Location Code",
                    placeholder: "Example: IST",
                    required: true
                }
            }
        }}/>
    )
};

export default LocationsPage;