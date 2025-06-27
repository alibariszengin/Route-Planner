import {X} from 'lucide-react';

export const RouteDetail = ({selectedRoute, closeRouteDetails}) => {

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedRoute.transportations[0].originLocation.name}</h3>
                <button
                    onClick={closeRouteDetails}
                    className="text-gray-400 hover:text-gray-600 p-1"
                >
                    <X size={20}/>
                </button>
            </div>

            <div className="p-4">
                <div className="space-y-4">
                    {selectedRoute.transportations.map((transportation) => (
                        <div key={transportation.id} className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0">
                                {transportation.type === 'BUS' &&
                                    <div className="w-full h-full bg-blue-500 rounded-full"></div>}
                                {transportation.type === 'FLIGHT' &&
                                    <div className="w-full h-full bg-green-500 rounded-full"></div>}
                                {transportation.type === 'UBER' &&
                                    <div className="w-full h-full bg-black rounded-full"></div>}
                                {transportation.type === 'SUBWAY' &&
                                    <div className="w-full h-full bg-red rounded-full"></div>}
                            </div>
                            <span
                                className="text-gray-700">({transportation.type}) {transportation.destinationLocation.name}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={closeRouteDetails}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}