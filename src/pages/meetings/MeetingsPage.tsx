import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { meetingAPI } from '../../api/meeting';

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    meetingLink: ''
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const data = await meetingAPI.getMyMeetings();
      setMeetings(data);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await meetingAPI.createMeeting({
        ...formData,
        participants: [] // Can be extended to add participants
      });
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        meetingLink: ''
      });
      loadMeetings();
      alert('Meeting created successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to create meeting');
    }
  };

  const handleRespondToMeeting = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await meetingAPI.respondToMeeting(id, status);
      loadMeetings();
      alert(`Meeting ${status}!`);
    } catch (error: any) {
      alert(error.message || 'Failed to respond');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Meetings</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : 'Schedule Meeting'}
          </button>
        </div>

        {/* Create Meeting Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link (Optional)</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Meeting
              </button>
            </form>
          </div>
        )}

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No meetings yet. Schedule your first meeting!
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{meeting.title}</h3>
                    <p className="text-gray-600 mt-1">{meeting.description}</p>
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Start:</span>{' '}
                        {new Date(meeting.startTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">End:</span>{' '}
                        {new Date(meeting.endTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-1 rounded text-xs ${
                          meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {meeting.status}
                        </span>
                      </p>
                      {meeting.meetingLink && (
                        <p>
                          <a 
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Join Meeting Link →
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {meeting.organizer?._id !== user?.id && (
                      <>
                        <button
                          onClick={() => handleRespondToMeeting(meeting._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToMeeting(meeting._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}