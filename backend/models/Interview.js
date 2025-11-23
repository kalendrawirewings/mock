import supabase from '../config/db.js';

class Interview {
  static async create(userId, sessionData) {
    const { data: session, error } = await supabase
      .from('interview_sessions')
      .insert([
        {
          user_id: userId,
          resume_id: sessionData.resumeId || null,
          duration: sessionData.duration || 0,
          status: sessionData.status || 'in-progress',
          scores: sessionData.scores || {},
          feedback: sessionData.feedback || {},
          current_question_index: sessionData.currentQuestionIndex || 0,
          total_questions: sessionData.totalQuestions || 25,
          question_progress: sessionData.questionProgress || {},
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  static async update(id, sessionData) {
    const updateData = {
      duration: sessionData.duration,
      status: sessionData.status,
      scores: sessionData.scores,
      feedback: sessionData.feedback,
      current_question_index: sessionData.currentQuestionIndex,
      question_progress: sessionData.questionProgress,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('interview_sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error} = await supabase
      .from('interview_sessions')
      .select(`
        *,
        interview_questions (*),
        conversation_entries (*),
        interview_feedback_resources (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('interview_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async saveQuestion(sessionId, questionData) {
    const { data, error } = await supabase
      .from('interview_questions')
      .insert([
        {
          session_id: sessionId,
          category: questionData.category,
          question: questionData.question,
          expected_answer: questionData.expectedAnswer,
          candidate_answer: questionData.candidateAnswer,
          is_correct: questionData.isCorrect,
          score: questionData.score,
          feedback: questionData.feedback,
          sort_order: questionData.sortOrder || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async saveConversationEntry(sessionId, entryData) {
    const { data, error } = await supabase
      .from('conversation_entries')
      .insert([
        {
          session_id: sessionId,
          speaker: entryData.speaker,
          message: entryData.message,
          audio_url: entryData.audioUrl,
          question_id: entryData.questionId,
          category: entryData.category,
          sort_order: entryData.sortOrder || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async saveResource(sessionId, resourceData) {
    const { data, error } = await supabase
      .from('interview_feedback_resources')
      .insert([
        {
          session_id: sessionId,
          title: resourceData.title,
          url: resourceData.url,
          type: resourceData.type,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
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
