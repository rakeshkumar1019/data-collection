/**
 * API service for managing form data
 */

const API_BASE_URL = 'http://localhost:5000';

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface StoredFormData extends FormData {
  id: string;
  timestamp: string;
  ipAddress?: string;
}

/**
 * Save form data to the server
 */
export const saveFormDataToServer = async (formData: FormData): Promise<StoredFormData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error saving form data:', error);
    throw error;
  }
};

/**
 * Get all form submissions from the server
 */
export const getAllSubmissions = async (): Promise<StoredFormData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

/**
 * Get a specific submission by ID
 */
export const getSubmissionById = async (id: string): Promise<StoredFormData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${id}`);

    if (!response.ok) {
      throw new Error('Submission not found');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
};

/**
 * Delete a specific submission by ID
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete submission');
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

/**
 * Clear all submissions
 */
export const clearAllSubmissions = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to clear data');
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

/**
 * Export all data as CSV
 */
export const exportDataAsCSV = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/export/csv`);

    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }

    // Get the blob
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `form_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

/**
 * Get statistics about submissions
 */
export const getSubmissionStats = async (): Promise<{
  totalSubmissions: number;
  latestSubmission: StoredFormData | null;
  uniqueEmails: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const result = await response.json();
    return result.stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Check if server is available
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
