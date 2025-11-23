import Interview from '../models/Interview.js';

export const createInterview = async (req, res) => {
  try {
    const userId = req.session.userId;
    const sessionData = req.body;

    const session = await Interview.create(userId, sessionData);

    res.status(201).json({
      success: true,
      message: 'Interview session created',
      session,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating interview session',
    });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionData = req.body;

    const session = await Interview.update(id, sessionData);

    res.json({
      success: true,
      message: 'Interview session updated',
      session,
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating interview session',
    });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const userId = req.session.userId;
    const sessions = await Interview.findByUserId(userId);

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
    });
  }
};

export const getInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Interview.findById(id);

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    await Interview.delete(id);

    res.json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting interview',
    });
  }
};

export const getInterviewStats = async (req, res) => {
  try {
    const userId = req.session.userId;
    const stats = await Interview.getStats(userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};

export const saveQuestion = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const questionData = req.body;

    const question = await Interview.saveQuestion(sessionId, questionData);

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error('Save question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving question',
    });
  }
};

export const saveConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const entryData = req.body;

    const entry = await Interview.saveConversationEntry(sessionId, entryData);

    res.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error('Save conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving conversation',
    });
  }
};

export const saveResource = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const resourceData = req.body;

    const resource = await Interview.saveResource(sessionId, resourceData);

    res.status(201).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('Save resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving resource',
    });
  }
};
