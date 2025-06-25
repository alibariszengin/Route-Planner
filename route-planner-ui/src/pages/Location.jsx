import React from 'react';
import BasePage from "../components/BasePage/BasePage.jsx";
import {getMetadataByPageName} from "./pageMetadatas.jsx";



const LocationsPage = () => {
    const metadata = getMetadataByPageName("Locations");
    return (
        <BasePage metadata={metadata}/>
    )
};

export default LocationsPage;