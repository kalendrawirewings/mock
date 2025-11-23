import express from 'express';
import {
  createInterview,
  updateInterview,
  getInterviews,
  getInterview,
  deleteInterview,
  getInterviewStats,
  saveQuestion,
  saveConversation,
  saveResource,
} from '../controllers/interviewController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createInterview);
router.put('/:id', isAuthenticated, updateInterview);
router.get('/', isAuthenticated, getInterviews);
router.get('/stats', isAuthenticated, getInterviewStats);
router.get('/:id', isAuthenticated, getInterview);
router.delete('/:id', isAuthenticated, deleteInterview);

router.post('/:sessionId/questions', isAuthenticated, saveQuestion);
router.post('/:sessionId/conversation', isAuthenticated, saveConversation);
router.post('/:sessionId/resources', isAuthenticated, saveResource);

export default router;
