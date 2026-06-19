/**
 * Data storage utility using localStorage
 */

export interface FormData {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

/**
 * Save form data to localStorage
 */
export const saveFormData = (formData: Omit<FormData, 'id' | 'timestamp'>): FormData => {
  const newData: FormData = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...formData,
    timestamp: new Date().toISOString()
  };

  const existingData = JSON.parse(localStorage.getItem('formData') || '[]');
  existingData.push(newData);
  localStorage.setItem('formData', JSON.stringify(existingData));

  return newData;
};

/**
 * Get all form data
 */
export const getAllFormData = (): FormData[] => {
  return JSON.parse(localStorage.getItem('formData') || '[]');
};

/**
 * Delete form data by ID
 */
export const deleteFormData = (id: string): void => {
  const existingData = JSON.parse(localStorage.getItem('formData') || '[]');
  const filtered = existingData.filter((item: FormData) => item.id !== id);
  localStorage.setItem('formData', JSON.stringify(filtered));
};

/**
 * Export to CSV
 */
export const exportToCSV = (): void => {
  const data = getAllFormData();

  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['Name', 'Email', 'Message', 'Date'];
  const rows = data.map(item => [
    `"${item.name.replace(/"/g, '""')}"`,
    item.email,
    `"${item.message.replace(/"/g, '""')}"`,
    new Date(item.timestamp).toLocaleString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `form_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

