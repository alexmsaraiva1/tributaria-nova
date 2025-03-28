import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormErrors = ({ errors }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <AlertCircle size={20} className="text-red-500 mr-2 mt-1" />
        <div>
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Por favor, corrija os seguintes erros:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="text-sm text-red-700">
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormErrors; 