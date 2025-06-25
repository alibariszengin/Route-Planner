import { useState } from 'react';

const SERVER_URL = 'http://localhost:8080';
const BASE_URL = `${SERVER_URL}/api/v1`;
export const useApiOperations = (metadata) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/${metadata.endpoint}`);

            checkResponse(response);

            return  await response.json();
        } catch (err) {
            console.error('Error while loading', metadata.pageName, ':', err);
            setError(`Error while loading ${metadata.pageName}: ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createElement = async (newElement) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newElement)
        };
        const requestParam = metadata.updateAfterCreateEdit ? `?${metadata.updateAfterCreateEdit}` : '';
        let response = await fetch(`${BASE_URL}/${metadata.endpoint}${requestParam}`, requestOptions);

        checkResponse(response);

        let newCreated = await response.json();

        if (false) {
            response = await fetch(`${BASE_URL}/${metadata.endpoint}/${newCreated.id}`);

            checkResponse(response);
            newCreated = await response.json();
        }

        return { ...newCreated, ...newElement };
    };

    const updateElement = async (elementToUpdate) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(elementToUpdate)
        };
        const requestParam = metadata.updateAfterCreateEdit ? `?${metadata.updateAfterCreateEdit}` : '';
        let response = await fetch(`${BASE_URL}/${metadata.endpoint}${requestParam}`, requestOptions);

        checkResponse(response);

        let updatedElement = await response.json();

        if (false) {
            response = await fetch(`${BASE_URL}/${metadata.endpoint}/${updatedElement.id}`);

            checkResponse(response);

            updatedElement = await response.json();
        }

        return updatedElement;
    };

    const deleteElement = async (elementIdToDelete) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(`${BASE_URL}/${metadata.endpoint}/${elementIdToDelete}`, requestOptions);

        checkResponse(response);

        return await response.json();
    }

    const checkResponse = (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    };
    return {
        fetchData,
        createElement,
        updateElement,
        deleteElement,
        loading,
        error,
        setError
    };
};