import { config } from './config';

const API_BASE_URL = config.apiUrl;

export const healthCheckEventService = {
  API_BASE_URL, // Export để sử dụng trong component

  // Lấy tất cả sự kiện khám sức khỏe
  getAllHealthCheckEvents: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/healthcheckevent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching health check events:', error);
      throw error;
    }
  },

  // Lấy sự kiện theo ID
  getHealthCheckEventById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/healthcheckevent/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching health check event:', error);
      throw error;
    }
  },

  // Tạo sự kiện mới
  createHealthCheckEvent: async (eventData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      // Format data according to API specification - FormData
      const formData = new FormData();
      
      // Handle FormData input
      if (eventData instanceof FormData) {
        // If input is already FormData, use it directly
        formData.append('Healthcheckeventname', eventData.get('healthcheckeventname')?.trim() || '');
        formData.append('Healthcheckeventdescription', eventData.get('healthcheckeventdescription')?.trim() || '');
        formData.append('Location', eventData.get('location')?.trim() || '');
        
        // Handle date formatting safely
        let eventDate;
        const dateValue = eventData.get('eventdate');
        if (dateValue) {
          try {
            eventDate = new Date(dateValue).toISOString();
            console.log(new Date(dateValue + 'T00:00:00').toISOString());
            console.log(dateValue);
          } catch (error) {
            console.error('Invalid date format:', dateValue);
            eventDate = new Date().toISOString();
          }
        } else {
          eventDate = new Date().toISOString();
        }
        formData.append('Eventdate', eventDate);
        
        // Handle file
        const file = eventData.get('file');
        if (file) {
          formData.append('DocumentFile', file);
        } else {
          formData.append('DocumentFile', '');
        }
        
        formData.append('Createdby', eventData.get('createdby')?.trim() || '');
      } else {
        // If input is plain object
        formData.append('Healthcheckeventname', eventData.healthcheckeventname?.trim() || '');
        formData.append('Healthcheckeventdescription', eventData.healthcheckeventdescription?.trim() || '');
        formData.append('Location', eventData.location?.trim() || '');
        
        // Handle date formatting safely
        let eventDate;
        if (eventData.eventdate) {
          try {
            eventDate = new Date(eventData.eventdate + 'T00:00:00').toISOString();
          } catch (error) {
            console.error('Invalid date format:', eventData.eventdate);
            eventDate = new Date().toISOString();
          }
        } else {
          eventDate = new Date().toISOString();
        }
        formData.append('Eventdate', eventDate);
        
        // Handle file
        if (eventData.documentFile) {
          formData.append('DocumentFile', eventData.documentFile);
        } else {
          formData.append('DocumentFile', '');
        }
        
        formData.append('Createdby', eventData.createdby?.trim() || '');
      }

      // Ensure all required fields are present and not empty
      let healthcheckeventname, location, eventdate, createdby;
      
      if (eventData instanceof FormData) {
        healthcheckeventname = eventData.get('healthcheckeventname')?.trim();
        location = eventData.get('location')?.trim();
        eventdate = eventData.get('eventdate');
        createdby = eventData.get('createdby')?.trim();
      } else {
        healthcheckeventname = eventData.healthcheckeventname?.trim();
        location = eventData.location?.trim();
        eventdate = eventData.eventdate;
        createdby = eventData.createdby?.trim();
      }
      
      if (!healthcheckeventname || !location || !eventdate || !createdby) {
        console.error('Missing required fields:', {
          healthcheckeventname,
          location,
          eventdate,
          createdby
        });
        throw new Error('Missing required fields: healthcheckeventname, location, eventdate, createdby');
      }

      // Additional validation - check for empty strings
      if (healthcheckeventname === '' || location === '' || createdby === '') {
        console.error('Empty required fields:', {
          healthcheckeventname,
          location,
          createdby
        });
        throw new Error('Required fields cannot be empty');
      }

      console.log('Sending FormData to API');
      console.log('API URL:', `${API_BASE_URL}/healthcheckevent`);
      console.log('Token exists:', !!token);

      const response = await fetch(`${API_BASE_URL}/healthcheckevent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Response Headers:', response.headers);
        console.error('Response Status:', response.status);
        
        let errorMessage = 'Unknown error';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
          console.error('Parsed Error Data:', errorData);
        } catch (e) {
          errorMessage = errorText;
          console.error('Error parsing error response:', e);
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating health check event:', error);
      throw error;
    }
  },

  // Cập nhật sự kiện
  updateHealthCheckEvent: async (id, eventData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Format data according to API specification - simplified format
      // Use the provided data directly since it's already in the correct format
      const updateData = {
        healthcheckeventID: parseInt(id),
        healthcheckeventname: eventData.healthcheckeventname?.trim() || '',
        healthcheckeventdescription: eventData.healthcheckeventdescription?.trim() || '',
        location: eventData.location?.trim() || '',
        eventdate: eventData.eventdate || new Date().toISOString(),
        isdeleted: false
      };

      console.log('Raw eventData:', eventData);
      console.log('Parsed updateData:', updateData);
      console.log('healthcheckeventname value:', updateData.healthcheckeventname);
      console.log('healthcheckeventdescription value:', updateData.healthcheckeventdescription);

      // Ensure all required fields are present
      if (!updateData.healthcheckeventname || !updateData.location) {
        throw new Error('Missing required fields: healthcheckeventname, location');
      }

      console.log('Sending update data to API:', updateData);
      console.log('API URL:', `${API_BASE_URL}/healthcheckevent/${id}`);
      console.log('FormData content:');
      if (eventData instanceof FormData) {
        for (let [key, value] of eventData.entries()) {
          console.log(`${key}: ${value}`);
        }
      } else {
        console.log('eventData is not FormData:', eventData);
      }

      const response = await fetch(`${API_BASE_URL}/healthcheckevent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(updateData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Handle response - check if it's empty or not JSON
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        console.error('API Error Response:', responseText);
        console.error('Response Status:', response.status);
        
        let errorMessage = 'Unknown error';
        try {
          if (responseText.trim()) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || responseText;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = responseText || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse JSON response, but handle empty responses
      let data = null;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.warn('Response is not valid JSON, treating as success:', responseText);
          data = { success: true, message: 'Update successful' };
        }
      } else {
        console.log('Empty response received, treating as success');
        data = { success: true, message: 'Update successful' };
      }

      return data;
    } catch (error) {
      console.error('Error updating health check event:', error);
      throw error;
    }
  },

  // Xóa sự kiện (soft delete)
  deleteHealthCheckEvent: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Prepare data for soft delete - simplified format
      const deleteData = {
        healthcheckeventID: parseInt(id),
        healthcheckeventname: "string",
        healthcheckeventdescription: "string",
        location: "string",
        eventdate: new Date().toISOString(),
        isdeleted: true
      };

      console.log('Sending soft delete data to API:', deleteData);
      console.log('API URL:', `${API_BASE_URL}/healthcheckevent/${id}`);

      const response = await fetch(`${API_BASE_URL}/healthcheckevent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deleteData)
      });

      console.log('Delete response status:', response.status);

      // Handle response - check if it's empty or not JSON
      const responseText = await response.text();
      console.log('Delete response text:', responseText);

      if (!response.ok) {
        console.error('API Error Response:', responseText);
        console.error('Response Status:', response.status);
        
        let errorMessage = 'Unknown error';
        try {
          if (responseText.trim()) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || responseText;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = responseText || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse JSON response, but handle empty responses
      let data = null;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.warn('Delete response is not valid JSON, treating as success:', responseText);
          data = { success: true, message: 'Delete successful' };
        }
      } else {
        console.log('Empty delete response received, treating as success');
        data = { success: true, message: 'Delete successful' };
      }

      return data;
    } catch (error) {
      console.error('Error deleting health check event:', error);
      throw error;
    }
  },

  // Upload file cho sự kiện
  uploadEventDocument: async (eventId, file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('documentFile', file);

      const response = await fetch(`${API_BASE_URL}/healthcheckevent/${eventId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Download/Mở file của sự kiện
  downloadEventDocument: async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/healthcheckevent/${eventId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Tạo blob và download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-check-event-${eventId}.pdf`; // hoặc lấy tên file từ response header
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Lấy danh sách học sinh theo event ID
  getStudentsByEventId: async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/healthcheckrecordevents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter records for the specific event ID and not deleted
      const filteredRecords = data.filter(record => 
        record.healthcheckeventid === parseInt(eventId) && 
        !record.isdeleted
      );
      
      return filteredRecords;
    } catch (error) {
      console.error('Error fetching students by event ID:', error);
      throw error;
    }
  }
}; 