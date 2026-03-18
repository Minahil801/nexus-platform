import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { meetingAPI } from '../../api/meeting';
import { documentAPI } from '../../api/document';
import { paymentAPI } from '../../api/payment';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [meetingsData, documentsData, transactionsData] = await Promise.all([
        meetingAPI.getMyMeetings(),
        documentAPI.getMyDocuments(),
        paymentAPI.getTransactionHistory()
      ]);

      setMeetings(meetingsData.slice(0, 5));
      setDocuments(documentsData.slice(0, 5));
      setTransactions(transactionsData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Business Nexus - Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Meetings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Meetings</h2>
              <button 
                onClick={() => navigate('/meetings')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            {meetings.length === 0 ? (
              <p className="text-gray-500 text-sm">No meetings yet</p>
            ) : (
              <ul className="space-y-2">
                {meetings.map((meeting) => (
                  <li key={meeting._id} className="text-sm border-b pb-2">
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.startTime).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Documents</h2>
              <button 
                onClick={() => navigate('/documents')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            {documents.length === 0 ? (
              <p className="text-gray-500 text-sm">No documents yet</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc._id} className="text-sm border-b pb-2">
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Transactions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button 
                onClick={() => navigate('/payments')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet</p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((txn) => (
                  <li key={txn._id} className="text-sm border-b pb-2">
                    <p className="font-medium">{txn.type.toUpperCase()}</p>
                    <p className="text-xs text-gray-500">
                      ${txn.amount} - {txn.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/meetings')}
              className="p-4 border rounded hover:bg-gray-50 transition"
            >
              📅 Schedule Meeting
            </button>
            <button 
              onClick={() => navigate('/documents')}
              className="p-4 border rounded hover:bg-gray-50 transition"
            >
              📄 Upload Document
            </button>
            <button 
              onClick={() => navigate('/payments')}
              className="p-4 border rounded hover:bg-gray-50 transition"
            >
              💰 Make Payment
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-4 border rounded hover:bg-gray-50 transition"
            >
              📊 View Reports
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}