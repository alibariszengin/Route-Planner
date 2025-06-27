const metadataOfPages = {
    Routes: {
        endpoint: 'transportations/generateRoute',
        pageName: 'Routes',
        name: 'Route',
        requestParams: "",
        fields: {
            originLocationId: {
                inputType: "dropdown",
                field: "originLocation.name",
                pkField: "originLocation.id",
                optionsSource: [],
                valueKey: "id",
                labelKey: "name",
                label: "Origin Location Name",
                placeholder: "Example: Istanbul Airport",
                required: true
            },
            destinationLocationId: {
                inputType: "dropdown",
                optionsSource: [],
                valueKey: "id",
                labelKey: "name",
                field: "destinationLocation.name",
                pkField: "destinationLocation.id",
                label: "Destination Location Name",
                placeholder: "Example: Ankara Station",
                required: true
            },
            routeDate: {
                inputType: "date",
            }
        }
    },
    Transportations: {
        endpoint: 'transportations',
        pageName: 'Transportations',
        name: 'Transportation',
        requestParams: "populateAll=true",
        fields: {
            type: {
                inputType: "dropdown",
                optionsSource: [{
                    type: "BUS"
                }, {type: "FLIGHT"}, {type: "UBER"}, {type: "SUBWAY"}],
                valueKey: "type",
                labelKey: "type",
                label: "Transportation Type",
                placeholder: "Example: BUS, FLIGHT, SUBWAY",
                required: true
            },
            originLocationId: {
                inputType: "dropdown",
                field: "originLocation.name",
                pkField: "originLocation.id",
                optionsSource: [],
                valueKey: "id",
                labelKey: "name",
                label: "Origin Location Name",
                placeholder: "Example: Istanbul Airport",
                required: true
            },
            destinationLocationId: {
                inputType: "dropdown",
                optionsSource: [],
                valueKey: "id",
                labelKey: "name",
                field: "destinationLocation.name",
                pkField: "destinationLocation.id",
                label: "Destination Location Name",
                placeholder: "Example: Ankara Station",
                required: true
            }
        }
    },
    Locations : {
        endpoint: 'locations',
        pageName: 'Locations',
        name: 'Location',
        fields: {
            name: {
                label: "Location Name",
                placeholder: "Example: Istanbul Airport",
                required: true
            },
            code: {
                label: "Location Code",
                placeholder: "Example: IST",
                required: true
            }
        }
    }
}
const getMetadataByPageName = (pageName) => {
    return metadataOfPages[pageName];
}

const changeMetadataInformation = (pageName, path, key, value) => {
    const metadata = metadataOfPages[pageName];
    if (path) {
        const metadataField = path.split('.').reduce((acc, part) => acc?.[part], metadata);
        metadataField[key] = value;
    } else {
        metadata[key] = value;
    }

}
export {
    getMetadataByPageName,
    changeMetadataInformation
}