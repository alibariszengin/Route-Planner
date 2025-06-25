import React from 'react';

const LoadingSpinner = ({ pageName }) => {
    return (
        <div className="page-section">
            <div className="loading">{pageName} Loading...</div>
        </div>
    );
};

export default LoadingSpinner;