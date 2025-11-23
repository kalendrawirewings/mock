import prisma from '../config/prisma.js';

class Resume {
  static async create(userId, resumeData) {
    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName: resumeData.fileName,
        personalInfo: resumeData.personalInfo || {},
        skills: resumeData.skills || [],
        summary: resumeData.summary || null,
        analysisStrengths: resumeData.analysis?.strengths || [],
        analysisWeaknesses: resumeData.analysis?.weaknesses || [],
        analysisSuggestions: resumeData.analysis?.suggestions || [],
        analysisScore: resumeData.analysis?.overallScore || 0,
        experience: {
          create: (resumeData.experience || []).map((exp, index) => ({
            company: exp.company,
            position: exp.position,
            duration: exp.duration,
            description: exp.description || [],
            sortOrder: index,
          })),
        },
        education: {
          create: (resumeData.education || []).map((edu, index) => ({
            institution: edu.institution,
            degree: edu.degree,
            year: edu.year,
            gpa: edu.gpa || null,
            sortOrder: index,
          })),
        },
      },
      include: {
        experience: true,
        education: true,
      },
    });

    return resume;
  }

  static async findByUserId(userId) {
    return await prisma.resume.findMany({
      where: { userId },
      include: {
        experience: {
          orderBy: { sortOrder: 'asc' },
        },
        education: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id) {
    return await prisma.resume.findUnique({
      where: { id },
      include: {
        experience: {
          orderBy: { sortOrder: 'asc' },
        },
        education: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  static async delete(id) {
    await prisma.resume.delete({
      where: { id },
    });
    return true;
  }
}

export default Resume;
