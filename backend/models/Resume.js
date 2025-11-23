import supabase from '../config/db.js';

class Resume {
  static async create(userId, resumeData) {
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert([
        {
          user_id: userId,
          file_name: resumeData.fileName,
          personal_info: resumeData.personalInfo,
          skills: resumeData.skills,
          summary: resumeData.summary,
          analysis_strengths: resumeData.analysis.strengths,
          analysis_weaknesses: resumeData.analysis.weaknesses,
          analysis_suggestions: resumeData.analysis.suggestions,
          analysis_score: resumeData.analysis.overallScore,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (resumeData.experience?.length > 0) {
      const experienceData = resumeData.experience.map((exp, index) => ({
        resume_id: resume.id,
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        description: exp.description,
        sort_order: index,
      }));

      await supabase.from('resume_experience').insert(experienceData);
    }

    if (resumeData.education?.length > 0) {
      const educationData = resumeData.education.map((edu, index) => ({
        resume_id: resume.id,
        institution: edu.institution,
        degree: edu.degree,
        year: edu.year,
        gpa: edu.gpa,
        sort_order: index,
      }));

      await supabase.from('resume_education').insert(educationData);
    }

    return resume;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('resumes')
      .select(`
        *,
        resume_experience (*),
        resume_education (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('resumes')
      .select(`
        *,
        resume_experience (*),
        resume_education (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase.from('resumes').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export default Resume;
