import React, { useState, useEffect } from 'react';
import { useApiOperations } from '../../hooks/useApiOperations';
import { useFormData } from '../../hooks/useFormData';
import DataForm from '../DataForm/DataForm';
import DataTable from '../DataTable/DataTable';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './BasePage.css';
import {useDebouncedLoading} from "../../hooks/useDebounceLoading.jsx";

const BasePage = ({ metadata }) => {
    const [data, setData] = useState([]);

    const {
        fetchData,
        createElement,
        updateElement,
        deleteElement,
        loading,
        error,
        setError
    } = useApiOperations(metadata);

    const {
        formData,
        editingId,
        setEditingId,
        validateForm,
        resetForm,
        populateFormData,
        updateFormField,
        getNestedValue
    } = useFormData(metadata);

    const showLoading = useDebouncedLoading(loading, 500);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const responseData = await fetchData();
            setData(responseData);
        } catch (err) {
            // Error handling is done in the hook
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        if (!validateForm()) {
            return;
        }

        try {
            if (editingId) {
                // Update mode
                const updatedFields = Object.keys(metadata.fields).reduce((fields, key) => {
                    fields[key] = formData[key];
                    return fields;
                }, {});

                const elementToUpdate = {
                    ...data.find(el => el.id === editingId),
                    ...updatedFields
                };

                const updatedElement = await updateElement(elementToUpdate);
                setData(prevData =>
                    prevData.map(el =>
                        el.id === editingId ? { ...el, ...updatedElement } : el
                    )
                );
            } else {
                // Create mode
                const newElement = await createElement(formData);
                setData(prevData => [...prevData, newElement]);
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

    const handleDelete = async (id) => {
        const response =  await deleteElement(id);
        console.log(response)
        setData(prevData => prevData.filter(el => el.id !== id));
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleRefresh = () => {
        loadData();
    };

    if (showLoading) {
        return <LoadingSpinner pageName={metadata.pageName} />;
    }

    return (
        <div className="data-container">
            <DataForm
                metadata={metadata}
                formData={formData}
                editingId={editingId}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onFieldChange={updateFormField}
            />

            <DataTable
                metadata={metadata}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                error={error}
                getNestedValue={getNestedValue}
            />
        </div>
    );
};

export default BasePage;