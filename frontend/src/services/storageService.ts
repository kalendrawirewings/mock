import { ResumeData, InterviewSession } from '../types';
import { resumeApi } from '../api/resumeApi';
import { interviewApi } from '../api/interviewApi';

class StorageService {
  // Resume operations
  async saveResume(resume: ResumeData): Promise<void> {
    try {
      await resumeApi.create(resume);
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }

  async getResumes(): Promise<ResumeData[]> {
    try {
      const response = await resumeApi.getAll();
      return response.resumes || [];
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }
  }

  async getResume(id: string): Promise<ResumeData | null> {
    try {
      const response = await resumeApi.getById(id);
      return response.resume || null;
    } catch (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      await resumeApi.delete(id);
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  // Interview operations
  async saveInterview(interview: InterviewSession): Promise<void> {
    try {
      if (interview.id) {
        await interviewApi.update(interview.id, interview);
      } else {
        await interviewApi.create(interview);
      }
    } catch (error) {
      console.error('Error saving interview:', error);
      throw error;
    }
  }

  async getInterviews(): Promise<InterviewSession[]> {
    try {
      const response = await interviewApi.getAll();
      return response.sessions || [];
    } catch (error) {
      console.error('Error fetching interviews:', error);
      return [];
    }
  }

  async getInterview(id: string): Promise<InterviewSession | null> {
    try {
      const response = await interviewApi.getById(id);
      return response.session || null;
    } catch (error) {
      console.error('Error fetching interview:', error);
      return null;
    }
  }

  async deleteInterview(id: string): Promise<void> {
    try {
      await interviewApi.delete(id);
    } catch (error) {
      console.error('Error deleting interview:', error);
      throw error;
    }
  }

  // Analytics
  async getInterviewStats(): Promise<{
    totalInterviews: number;
    averageScore: number;
    bestScore: number;
    recentTrend: number[];
  }> {
    try {
      const response = await interviewApi.getStats();
      return response.stats || {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        recentTrend: [],
      };
    } catch (error) {
      console.error('Error fetching interview stats:', error);
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        recentTrend: [],
      };
    }
  }

  // User operations (kept for compatibility)
  saveUser(user: any): void {
    localStorage.setItem('interview_platform_user', JSON.stringify(user));
  }

  getUser(): any | null {
    const data = localStorage.getItem('interview_platform_user');
    return data ? JSON.parse(data) : null;
  }
}

export const storageService = new StorageService();
