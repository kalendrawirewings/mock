import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
  try {
    const userId = req.session.userId;
    const resumeData = req.body;

    const resume = await Resume.create(userId, resumeData);

    res.status(201).json({
      success: true,
      message: 'Resume saved successfully',
      resume,
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving resume',
    });
  }
};

export const getResumes = async (req, res) => {
  try {
    const userId = req.session.userId;
    const resumes = await Resume.findByUserId(userId);

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    await Resume.delete(id);

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
    });
  }
};
