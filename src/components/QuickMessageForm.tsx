import { useState } from 'react';
import { saveFormData } from '../utils/csvExport';
import './QuickMessageForm.css';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export const QuickMessageForm = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter your name or organization');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      saveFormData({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      setFormData({
        name: '',
        email: '',
        message: ''
      });

      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving form data:', error);
      const message = error instanceof Error ? error.message : 'Failed to save data. Please try again.';
      setErrorMessage(message);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>QUICK MESSAGE</h2>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          name="name"
          placeholder="Your name / organisation"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          disabled={isSubmitting}
        />

        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          disabled={isSubmitting}
        />

        <textarea
          name="message"
          placeholder="Role, project, or opportunity you'd like to discuss..."
          value={formData.message}
          onChange={handleChange}
          className="form-textarea"
          disabled={isSubmitting}
          rows={6}
        />

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE →'}
        </button>

        {submitStatus === 'success' && (
          <div className="status-message success">
            ✓ Message saved successfully!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="status-message error">
            ✗ {errorMessage || 'Error saving message. Please try again.'}
          </div>
        )}
      </form>
    </div>
  );
};
