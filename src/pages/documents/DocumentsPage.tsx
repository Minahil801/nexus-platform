import React, { useEffect, useState } from 'react';
import { documentAPI } from '../../api/document';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await documentAPI.getMyDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('document', selectedFile);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);

    try {
      await documentAPI.uploadDocument(uploadData);
      setShowUploadForm(false);
      setSelectedFile(null);
      setFormData({ title: '', description: '' });
      loadDocuments();
      alert('Document uploaded successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to upload document');
    }
  };

  const handleSign = async (id: string) => {
    const signature = prompt('Enter your signature (or paste base64 image):');
    if (!signature) return;

    try {
      await documentAPI.signDocument(id, signature);
      loadDocuments();
      alert('Document signed successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to sign document');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showUploadForm ? 'Cancel' : 'Upload Document'}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Document
              </button>
            </form>
          </div>
        )}

        {/* Documents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No documents yet. Upload your first document!
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                    doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>File: {doc.fileName}</p>
                  <p>Size: {(doc.fileSize / 1024).toFixed(2)} KB</p>
                  <p>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                  {doc.signatures?.length > 0 && (
                    <p className="text-green-600">✓ Signed ({doc.signatures.length})</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`http://localhost:5000/api/documents/${doc._id}/download`, '_blank')}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleSign(doc._id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Sign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}