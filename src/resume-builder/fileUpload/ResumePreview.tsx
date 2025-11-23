import React from 'react';
import { ResumeData } from '../service/geminiService';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  return (
    <div
      id='resume-preview'
      className='
        bg-white shadow-lg p-6 sm:p-8 
        w-full h-full 
        max-w-4xl mx-auto 
      '
      style={{ minHeight: '297mm', width: '210mm' }}
    >
      {/* Header - Name and Contact */}
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold text-black mb-2'>
          {resumeData.personalInfo.name}
        </h1>
        <div className='text-sm text-black'>
          <span>{resumeData.personalInfo.phone}</span>
          <span className='mx-2'>|</span>
          <span>{resumeData.personalInfo.email}</span>
        </div>
      </div>

      {/* Summary Section */}
      {resumeData.professionalSummary && (
        <section className='mb-6'>
          <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
            SUMMARY
          </h2>
          <div className='border-b border-black mb-3'></div>
          <p className='text-sm text-black leading-relaxed text-justify'>
            {resumeData.professionalSummary}
          </p>
        </section>
      )}

      {/* Education Section */}
      {resumeData.education && resumeData.education.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
            EDUCATION
          </h2>
          <div className='border-b border-black mb-3'></div>
          <div className='space-y-3'>
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <div className='flex justify-between items-start mb-1'>
                  <div>
                    <h3 className='text-sm font-bold text-black'>
                      {edu.institution}
                    </h3>
                    <p className='text-sm text-black'>{edu.degree}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-black'>{edu.year}</p>
                    {edu.gpa && (
                      <p className='text-sm text-black'>Grade: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
            EXPERIENCE
          </h2>
          <div className='border-b border-black mb-3'></div>
          <div className='space-y-4'>
            {resumeData.experience.map((exp, index) => (
              <div key={index}>
                <div className='flex justify-between items-start mb-1'>
                  <div>
                    <h3 className='text-sm font-bold text-black'>
                      {exp.company}
                    </h3>
                    <p className='text-sm text-black'>{exp.title}</p>
                  </div>
                  <p className='text-sm text-black'>{exp.duration}</p>
                </div>
                <ul className='mt-2 space-y-1'>
                  {exp.description.map((desc, descIndex) => (
                    <li
                      key={descIndex}
                      className='text-sm text-black flex items-start'
                    >
                      <span className='mr-2'>•</span>
                      <span className='text-justify'>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Skills Section */}
      {resumeData.skills &&
        (resumeData.skills.technical?.length > 0 ||
          resumeData.skills.soft?.length > 0) && (
          <section className='mb-6'>
            <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
              SKILLS
            </h2>
            <div className='border-b border-black mb-3'></div>
            <div className='space-y-2'>
              {resumeData.skills.technical &&
                resumeData.skills.technical.length > 0 && (
                  <div className='flex'>
                    <span className='text-sm font-bold text-black mr-2'>
                      • Technical Skills:
                    </span>
                    <span className='text-sm text-black'>
                      {resumeData.skills.technical.join(', ')}
                    </span>
                  </div>
                )}
              {resumeData.skills.soft && resumeData.skills.soft.length > 0 && (
                <div className='flex'>
                  <span className='text-sm font-bold text-black mr-2'>
                    • Soft Skills:
                  </span>
                  <span className='text-sm text-black'>
                    {resumeData.skills.soft.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

      {/* Projects Section */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
            PROJECTS
          </h2>
          <div className='border-b border-black mb-3'></div>
          <div className='space-y-3'>
            {resumeData.projects.map((project, index) => (
              <div key={index}>
                <h3 className='text-sm font-bold text-black'>{project.name}</h3>
                <p className='text-sm text-black text-justify mt-1'>
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className='text-sm text-black mt-1'>
                    <span className='font-bold'>Technologies:</span>{' '}
                    {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Certifications Section */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className='mb-6'>
          <h2 className='text-sm font-bold text-black uppercase tracking-wide mb-1'>
            CERTIFICATIONS
          </h2>
          <div className='border-b border-black mb-3'></div>
          <p className='text-sm text-black leading-relaxed'>
            {resumeData.certifications.map((cert) => cert.name).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
};
