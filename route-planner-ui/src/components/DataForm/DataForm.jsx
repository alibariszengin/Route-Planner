import React from 'react';
import FormField from '../FormField/FormField';

const DataForm = ({
                      metadata,
                      formData,
                      editingId,
                      onSubmit,
                      onCancel,
                      onFieldChange,
                  }) => {
    return (
        <div className="page-section">
            <h2>{editingId ? `Edit ${metadata.name}` : `Add ${metadata.name}`}</h2>

            <form className="data-form" onSubmit={onSubmit}>
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

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DataForm;