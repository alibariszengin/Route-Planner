import React from 'react';

const FormField = ({ fieldKey, fieldConfig, value, onChange }) => {
    if (fieldConfig.inputType === "dropdown") {
        return (
            <div>
                <label>{fieldConfig.label}</label>
                <select
                    className="custom-dropdown"
                    value={value || ''}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                >
                    <option value="">-- {fieldConfig.placeholder || "Select"} --</option>
                    {fieldConfig.optionsSource.map((option) => (
                        <option key={option[fieldConfig.valueKey]} value={option[fieldConfig.valueKey]}>
                            {option[fieldConfig.labelKey]}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
    if (fieldConfig.inputType === "date") {
        return (
            <div className="flex items-center gap-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Select a date:
                </label>
                <input
                    type="date"
                    id="date"
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        )
    }
    return (
        <div>
            <label>{fieldConfig.label}</label>
            <input
                type={fieldConfig.inputType || "text"}
                value={value || ''}
                onChange={(e) => onChange(fieldKey, e.target.value)}
                placeholder={fieldConfig.placeholder}
            />
        </div>
    );
};

export default FormField;