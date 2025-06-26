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
            const requestParam = metadata.requestParams ? `?${metadata.requestParams}` : '';

            const response = await fetch(`${BASE_URL}/${metadata.endpoint}${requestParam}`);

            await checkResponse(response);

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
        const requestParam = metadata.requestParams ? `?${metadata.requestParams}` : '';
        let response = await fetch(`${BASE_URL}/${metadata.endpoint}${requestParam}`, requestOptions);

        await checkResponse(response);
        let newCreated = await response.json();

        return { ...newCreated, ...newElement };
    };

    const updateElement = async (elementToUpdate) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(elementToUpdate)
        };
        const requestParam = metadata.requestParams ? `?${metadata.requestParams}` : '';
        let response = await fetch(`${BASE_URL}/${metadata.endpoint}${requestParam}`, requestOptions);

        await checkResponse(response);
        let updatedElement = await response.json();

        return updatedElement;
    };

    const deleteElement = async (elementIdToDelete) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(`${BASE_URL}/${metadata.endpoint}/${elementIdToDelete}`, requestOptions);

        await checkResponse(response);

        return await response.json();
    }

    const checkResponse = async (response) => {
        if (!response.ok) {
            const resp = await response.json();
            throw new Error(`HTTP error! ${resp.message}. Status: ${resp.status}`);
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