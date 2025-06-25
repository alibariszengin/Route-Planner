import React from 'react';

const DataTable = ({
                       metadata,
                       data,
                       onEdit,
                       onDelete,
                       onRefresh,
                       error,
                       getNestedValue
                   }) => {
    const renderTableCell = (element, key, fieldConfig) => {
        if (fieldConfig.field) {
            return getNestedValue(element, fieldConfig.field);
        }
        return element[key];
    };

    return (
        <div className="page-section">
            <div className="section-header">
                <h2>{metadata.pageName}</h2>
                <button className="btn btn-secondary" onClick={onRefresh}>
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
                                    onClick={() => onEdit(element)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-small"
                                    onClick={() => onDelete(element.id)}
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
    );
};

export default DataTable;
