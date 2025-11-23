import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
}

class GeminiService {
  private async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async analyzeJobDescription(jobDescription: string): Promise<ResumeData> {
    const prompt = `
      Analyze the following job description and create a comprehensive resume structure in JSON format.
      Focus on matching skills, experience, and qualifications that would be relevant for this role.
      
      Job Description: ${jobDescription}
      
      Please return a JSON object with the following structure:
      {
        "personalInfo": {
          "name": "John Doe",
          "email": "john.doe@email.com",
          "phone": "+1 (555) 123-4567",
          "address": "City, State",
          "linkedin": "linkedin.com/in/johndoe",
          "portfolio": "portfolio-url"
        },
        "professionalSummary": "Brief professional summary tailored to the job",
        "experience": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start Date - End Date",
            "description": ["Achievement 1", "Achievement 2", "Achievement 3"]
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "University Name",
            "year": "Graduation Year",
            "gpa": "GPA (optional)"
          }
        ],
        "skills": {
          "technical": ["Skill 1", "Skill 2"],
          "soft": ["Skill 1", "Skill 2"]
        },
        "projects": [
          {
            "name": "Project Name",
            "description": "Project description",
            "technologies": ["Tech 1", "Tech 2"]
          }
        ],
        "certifications": [
          {
            "name": "Certification Name",
            "issuer": "Issuing Organization",
            "year": "Year"
          }
        ]
      }
      
      Make sure the content is realistic, professional, and tailored to the job requirements.
      Return only valid JSON without any additional text or formatting.
    `;

    try {
      const response = await this.makeRequest(prompt);
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Error parsing resume data:', error);
      throw new Error('Failed to analyze job description');
    }
  }

  async analyzeExistingResume(resumeText: string): Promise<ResumeData> {
    const prompt = `
      Analyze the following resume text and extract information into a structured JSON format.
      Improve and enhance the content while maintaining the original information.
      
      Resume Text: ${resumeText}
      
      Please return a JSON object with the following structure:
      {
        "personalInfo": {
          "name": "Extract name from resume",
          "email": "Extract email",
          "phone": "Extract phone",
          "address": "Extract address",
          "linkedin": "Extract LinkedIn if available",
          "portfolio": "Extract portfolio/website if available"
        },
        "professionalSummary": "Enhanced professional summary",
        "experience": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Duration",
            "description": ["Enhanced achievement descriptions"]
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "Institution Name",
            "year": "Year",
            "gpa": "GPA if mentioned"
          }
        ],
        "skills": {
          "technical": ["Technical skills"],
          "soft": ["Soft skills"]
        },
        "projects": [
          {
            "name": "Project Name",
            "description": "Project description",
            "technologies": ["Technologies used"]
          }
        ],
        "certifications": [
          {
            "name": "Certification Name",
            "issuer": "Issuer",
            "year": "Year"
          }
        ]
      }
      
      Enhance the content with better descriptions and formatting while keeping the original information accurate.
      Return only valid JSON without any additional text or formatting.
    `;

    try {
      const response = await this.makeRequest(prompt);
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Error parsing resume data:', error);
      throw new Error('Failed to analyze existing resume');
    }
  }
}

export const geminiService = new GeminiService();
