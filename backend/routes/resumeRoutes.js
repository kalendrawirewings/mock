import express from 'express';
import {
  createResume,
  getResumes,
  getResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createResume);
router.get('/', isAuthenticated, getResumes);
router.get('/:id', isAuthenticated, getResume);
router.delete('/:id', isAuthenticated, deleteResume);

export default router;
