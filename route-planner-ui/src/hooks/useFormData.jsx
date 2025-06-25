import { useState } from 'react';

export const useFormData = (metadata) => {
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);

    const getNestedValue = (element, fieldPath) => {
        return fieldPath.split('.').reduce((acc, part) => acc?.[part], element);
    };

    const validateForm = () => {
        for (const key in metadata.fields) {
            const fieldMeta = metadata.fields[key];
            if (fieldMeta.required && !formData[key]) {
                console.warn(`${key} is required`);
                return false;
            }
        }
        return true;
    };

    const resetForm = () => {
        const emptyFormData = Object.keys(metadata.fields).reduce((fields, key) => {
            fields[key] = '';
            return fields;
        }, {});
        setFormData(emptyFormData);
        setEditingId(null);
    };

    const populateFormData = (element) => {
        const newFormData = Object.keys(metadata.fields).reduce((fields, key) => {
            const fieldMeta = metadata.fields[key];
            const nestedField = fieldMeta.pkField;

            let value;
            if (nestedField) {
                value = getNestedValue(element, nestedField);
            } else {
                value = element[key];
            }

            fields[key] = value || '';
            return fields;
        }, {});

        setFormData(newFormData);
    };

    const updateFormField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return {
        formData,
        editingId,
        setEditingId,
        validateForm,
        resetForm,
        populateFormData,
        updateFormField,
        getNestedValue
    };
};