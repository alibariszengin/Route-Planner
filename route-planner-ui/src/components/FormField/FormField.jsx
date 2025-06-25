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