import api from './config';

export const documentAPI = {
  // Upload document
  uploadDocument: async (formData: FormData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user documents
  getMyDocuments: async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
  },

  // Get document by ID
  getDocumentById: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  // Download document
  downloadDocument: async (id: string) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Preview document
  previewDocument: async (id: string) => {
    const response = await api.get(`/documents/${id}/preview`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Sign document
  signDocument: async (id: string, signatureImage: string) => {
    const response = await api.post(`/documents/${id}/sign`, { signatureImage });
    return response.data;
  },

  // Update document status
  updateDocumentStatus: async (id: string, status: string) => {
    const response = await api.put(`/documents/${id}/status`, { status });
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};

export default documentAPI;