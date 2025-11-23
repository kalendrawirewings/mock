import { ResumeData, InterviewSession, User } from '../types';

class StorageService {
  private readonly RESUME_KEY = 'interview_platform_resumes';
  private readonly INTERVIEW_KEY = 'interview_platform_interviews';
  private readonly USER_KEY = 'interview_platform_user';

  // Save Resume
  saveResume(resume: ResumeData): void {
    const resumes = this.getResumes();

    // Check if a resume with the same file name already exists
    const existingFile = resumes.find((r) => r.fileName === resume.fileName);

    if (existingFile) {
      // If it exists, don't add it again
      console.log(`Resume with name "${resume.fileName}" already exists.`);
      return;
    }

    // Otherwise, push the new resume to the list
    resumes.push(resume);
    localStorage.setItem(this.RESUME_KEY, JSON.stringify(resumes));
  }

  // Get Resumes
  getResumes(): ResumeData[] {
    const data = localStorage.getItem(this.RESUME_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Get a specific resume by its ID
  getResume(id: string): ResumeData | null {
    const resumes = this.getResumes();
    return resumes.find((r) => r.id === id) || null;
  }

  // Delete a specific resume by its ID
  deleteResume(id: string): void {
    const resumes = this.getResumes().filter((r) => r.id !== id);
    localStorage.setItem(this.RESUME_KEY, JSON.stringify(resumes));
  }

  // Interview operations
  saveInterview(interview: InterviewSession): void {
    const interviews = this.getInterviews();
    const existingIndex = interviews.findIndex((i) => i.id === interview.id);

    if (existingIndex >= 0) {
      interviews[existingIndex] = interview;
    } else {
      interviews.push(interview);
    }

    localStorage.setItem(this.INTERVIEW_KEY, JSON.stringify(interviews));
  }

  getInterviews(): InterviewSession[] {
    const data = localStorage.getItem(this.INTERVIEW_KEY);
    return data ? JSON.parse(data) : [];
  }

  getInterview(id: string): InterviewSession | null {
    const interviews = this.getInterviews();
    return interviews.find((i) => i.id === id) || null;
  }

  deleteInterview(id: string): void {
    const interviews = this.getInterviews().filter((i) => i.id !== id);
    localStorage.setItem(this.INTERVIEW_KEY, JSON.stringify(interviews));
  }

  // User operations
  saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Analytics
  getInterviewStats(): {
    totalInterviews: number;
    averageScore: number;
    bestScore: number;
    recentTrend: number[];
  } {
    const interviews = this.getInterviews();

    if (interviews.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        recentTrend: [],
      };
    }

    const scores = interviews.map((interview) => {
      const skillScores = Object.values(interview.scores);
      return (
        skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length
      );
    });

    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const recentTrend = scores.slice(-10);

    return {
      totalInterviews: interviews.length,
      averageScore: Math.round(averageScore),
      bestScore: Math.round(bestScore),
      recentTrend,
    };
  }
}

export const storageService = new StorageService();
