const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check for time conflicts
meetingSchema.statics.checkConflict = async function(userId, startTime, endTime, excludeMeetingId = null) {
  const query = {
    $or: [
      { organizer: userId },
      { 'participants.user': userId }
    ],
    status: { $in: ['scheduled', 'ongoing'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  if (excludeMeetingId) {
    query._id = { $ne: excludeMeetingId };
  }

  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

module.exports = mongoose.model('Meeting', meetingSchema);