import prisma from '../config/prisma.js';

class Interview {
  static async create(userId, sessionData) {
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        resumeId: sessionData.resumeId || null,
        duration: sessionData.duration || 0,
        status: sessionData.status || 'in-progress',
        scores: sessionData.scores || {},
        feedback: sessionData.feedback || {},
        currentQuestionIndex: sessionData.currentQuestionIndex || 0,
        totalQuestions: sessionData.totalQuestions || 25,
        questionProgress: sessionData.questionProgress || {},
      },
    });

    return session;
  }

  static async update(id, sessionData) {
    const session = await prisma.interviewSession.update({
      where: { id },
      data: {
        duration: sessionData.duration,
        status: sessionData.status,
        scores: sessionData.scores,
        feedback: sessionData.feedback,
        currentQuestionIndex: sessionData.currentQuestionIndex,
        questionProgress: sessionData.questionProgress,
        updatedAt: new Date(),
      },
    });

    return session;
  }

  static async findByUserId(userId) {
    return await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  static async findById(id) {
    return await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
        },
        conversationEntries: {
          orderBy: { sortOrder: 'asc' },
        },
        resources: true,
      },
    });
  }

  static async delete(id) {
    await prisma.interviewSession.delete({
      where: { id },
    });
    return true;
  }

  static async saveQuestion(sessionId, questionData) {
    return await prisma.interviewQuestion.create({
      data: {
        sessionId,
        category: questionData.category,
        question: questionData.question,
        expectedAnswer: questionData.expectedAnswer,
        candidateAnswer: questionData.candidateAnswer,
        isCorrect: questionData.isCorrect,
        score: questionData.score,
        feedback: questionData.feedback,
        sortOrder: questionData.sortOrder || 0,
      },
    });
  }

  static async saveConversationEntry(sessionId, entryData) {
    return await prisma.conversationEntry.create({
      data: {
        sessionId,
        speaker: entryData.speaker,
        message: entryData.message,
        audioUrl: entryData.audioUrl,
        questionId: entryData.questionId,
        category: entryData.category,
        sortOrder: entryData.sortOrder || 0,
      },
    });
  }

  static async saveResource(sessionId, resourceData) {
    return await prisma.interviewFeedbackResource.create({
      data: {
        sessionId,
        title: resourceData.title,
        url: resourceData.url,
        type: resourceData.type,
      },
    });
  }

  static async getStats(userId) {
    const sessions = await this.findByUserId(userId);

    if (sessions.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        recentTrend: [],
      };
    }

    const scores = sessions.map((session) => {
      const skillScores = Object.values(session.scores);
      return skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;
    });

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const recentTrend = scores.slice(-10);

    return {
      totalInterviews: sessions.length,
      averageScore: Math.round(averageScore),
      bestScore: Math.round(bestScore),
      recentTrend,
    };
  }
}

export default Interview;
