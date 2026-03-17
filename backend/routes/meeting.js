const express = require('express');
const Meeting = require('../models/Meeting');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create Meeting
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, participants, startTime, endTime, meetingLink } = req.body;

    // Check for conflicts
    const hasConflict = await Meeting.checkConflict(req.user.userId, new Date(startTime), new Date(endTime));
    
    if (hasConflict) {
      return res.status(400).json({ message: 'Time conflict with existing meeting' });
    }

    // Create meeting
    const meeting = new Meeting({
      title,
      description,
      organizer: req.user.userId,
      participants: participants.map(p => ({ user: p, status: 'pending' })),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      meetingLink
    });

    await meeting.save();
    
    res.status(201).json({
      message: 'Meeting scheduled successfully',
      meeting
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all meetings for user
router.get('/my-meetings', authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { organizer: req.user.userId },
        { 'participants.user': req.user.userId }
      ]
    })
    .populate('organizer', 'email role')
    .populate('participants.user', 'email role')
    .sort({ startTime: 1 });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get meeting by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'email role')
      .populate('participants.user', 'email role');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept/Reject meeting invitation
router.put('/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Find participant
    const participant = meeting.participants.find(
      p => p.user.toString() === req.user.userId
    );

    if (!participant) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    participant.status = status;
    await meeting.save();

    res.json({
      message: `Meeting ${status}`,
      meeting
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update meeting
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Only organizer can update
    if (meeting.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only organizer can update meeting' });
    }

    const { title, description, startTime, endTime, meetingLink, status } = req.body;

    // Check conflicts if time is being changed
    if (startTime || endTime) {
      const newStart = startTime ? new Date(startTime) : meeting.startTime;
      const newEnd = endTime ? new Date(endTime) : meeting.endTime;
      
      const hasConflict = await Meeting.checkConflict(
        req.user.userId, 
        newStart, 
        newEnd, 
        meeting._id
      );

      if (hasConflict) {
        return res.status(400).json({ message: 'Time conflict with existing meeting' });
      }
    }

    // Update fields
    if (title) meeting.title = title;
    if (description) meeting.description = description;
    if (startTime) meeting.startTime = new Date(startTime);
    if (endTime) meeting.endTime = new Date(endTime);
    if (meetingLink) meeting.meetingLink = meetingLink;
    if (status) meeting.status = status;

    await meeting.save();

    res.json({
      message: 'Meeting updated successfully',
      meeting
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete meeting
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Only organizer can delete
    if (meeting.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only organizer can delete meeting' });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;