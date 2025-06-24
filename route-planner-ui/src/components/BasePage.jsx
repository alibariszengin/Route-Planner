import React, { useState, useEffect } from 'react';
import './BasePage.css';

const SERVER_URL = 'http://localhost:8080';

const BasePage = ({ metadata }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // API İşlemleri
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${SERVER_URL}/api/v1/${metadata.endpoint}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setData(responseData);
        } catch (err) {
            console.error('Error while loading', metadata.pageName, ':', err);
            setError(`Error while loading ${metadata.pageName}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const createNewElement = async (newElement) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newElement)
        };

        let response = await fetch(`${SERVER_URL}/api/v1/${metadata.endpoint}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let newCreated = await response.json();

        // Opsiyonel: Oluşturulan öğeyi tekrar getir
        if (metadata.updateAfterCreateEdit) {
            response = await fetch(`${SERVER_URL}/api/v1/${metadata.endpoint}/${newCreated.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            newCreated = await response.json();
        }

        setData(prevData => [...prevData, { ...newCreated, ...newElement }]);
    };

    const updateExistingElement = async (elementToUpdate) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(elementToUpdate)
        };

        let response = await fetch(`${SERVER_URL}/api/v1/${metadata.endpoint}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let updatedElement = await response.json();

        // Opsiyonel: Güncellenen öğeyi tekrar getir
        if (metadata.updateAfterCreateEdit) {
            response = await fetch(`${SERVER_URL}/api/v1/${metadata.endpoint}/${updatedElement.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            updatedElement = await response.json();
        }

        setData(prevData =>
            prevData.map(el =>
                el.id === editingId ? { ...el, ...updatedElement } : el
            )
        );
    };

    // Form İşlemleri
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

    // Event Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingId) {
                // Güncelleme modu
                const updatedFields = Object.keys(metadata.fields).reduce((fields, key) => {
                    fields[key] = formData[key];
                    return fields;
                }, {});

                const elementToUpdate = {
                    ...data.find(el => el.id === editingId),
                    ...updatedFields
                };

                await updateExistingElement(elementToUpdate);
            } else {
                // Yeni öğe ekleme modu
                await createNewElement(formData);
            }

            resetForm();
        } catch (error) {
            console.error('Form submission error:', error);
            setError(`Operation failed: ${error.message}`);
        }
    };

    const handleEdit = (element) => {
        populateFormData(element);
        setEditingId(element.id);
    };

    const handleDelete = (id) => {
        setData(prevData => prevData.filter(el => el.id !== id));
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleRefresh = () => {
        fetchData();
    };

    // Utility Functions
    const getNestedValue = (element, fieldPath) => {
        return fieldPath.split('.').reduce((acc, part) => acc?.[part], element);
    };

    const renderFormField = (key, fieldConfig) => {
        if (fieldConfig.inputType === "dropdown") {
            return (
                <select
                    className="custom-dropdown"
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                >
                    <option value="">-- {fieldConfig.placeholder || "Select"} --</option>
                    {fieldConfig.optionsSource.map((option) => (
                        <option key={option[fieldConfig.valueKey]} value={option[fieldConfig.valueKey]}>
                            {option[fieldConfig.labelKey]}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={fieldConfig.inputType || "text"}
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder={fieldConfig.placeholder}
            />
        );
    };

    const renderTableCell = (element, key, fieldConfig) => {
        if (fieldConfig.field) {
            return getNestedValue(element, fieldConfig.field);
        }
        return element[key];
    };

    // Loading State
    if (loading) {
        return (
            <div className="page-section">
                <div className="loading">{metadata.pageName} Loading...</div>
            </div>
        );
    }

    // Main Render
    return (
        <div className="data-container">
            {/* Form Section */}
            <div className="page-section">
                <h2>{editingId ? `Edit ${metadata.name}` : `Add ${metadata.name}`}</h2>

                <form className="data-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        {Object.entries(metadata.fields).map(([key, fieldConfig]) => (
                            <div key={key}>
                                <label>{fieldConfig.label}</label>
                                {renderFormField(key, fieldConfig)}
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Data Table Section */}
            <div className="page-section">
                <div className="section-header">
                    <h2>{metadata.pageName}</h2>
                    <button className="btn btn-secondary" onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {data.length > 0 ? (
                    <table className="data-table">
                        <thead>
                        <tr>
                            {Object.entries(metadata.fields).map(([key, fieldConfig]) => (
                                <th key={key}>{fieldConfig.label}</th>
                            ))}
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(element => (
                            <tr key={element.id}>
                                {Object.entries(metadata.fields).map(([key, fieldConfig]) => (
                                    <td key={key}>
                                        {renderTableCell(element, key, fieldConfig)}
                                    </td>
                                ))}
                                <td>
                                    <button
                                        className="btn btn-primary btn-small"
                                        onClick={() => handleEdit(element)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDelete(element.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        {error ? 'Failed to load data.' : 'No records available'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasePage;