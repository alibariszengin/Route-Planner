import React from "react";
import {Search} from 'lucide-react';
import FormField from "../FormField/FormField.jsx";

export const RouteForm = ({metadata, handleSearch, onFieldChange, formData}) => {

    return (
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
    )
}