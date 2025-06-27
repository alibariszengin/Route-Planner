export const RouteTable = ({routes, handleRouteClick, locations, origin, destination}) => {

    return (
        <div className="bg-white rounded-lg shadow-sm text-black">
            <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900">Available Routes</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {routes.map((route, i=0) => (
                    <div
                        key={i++}
                        onClick={() => handleRouteClick(route)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <p className="text-gray-900">FROM {locations.find(location => location.id == origin)?.name} TO {locations.find(location => location.id == destination)?.name} via {route.transportations.find(transportation => transportation.type === "FLIGHT")?.originLocation?.code}</p>
                    </div>)
                )}
            </div>
        </div>
    )
}