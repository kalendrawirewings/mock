import jsPDF from 'jspdf';
import { ResumeData } from '../resume-builder/service/geminiService';

export const generateResumePDF = async (
  resumeData: ResumeData
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = 297; // A4 height in mm
  const pageWidth = 210; // A4 width in mm
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;
  const lineHeight = 4.5;
  const sectionSpacing = 6;

  // Helper function to add text with word wrapping
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number = 10,
    fontStyle: string = 'normal',
    maxWidth?: number
  ): number => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);

    if (maxWidth) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line: string, index: number) => {
        if (y + index * lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, x, y + index * lineHeight);
      });
      return y + lines.length * lineHeight;
    } else {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(text, x, y);
      return y + lineHeight;
    }
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number): number => {
    if (y > pageHeight - 20) {
      pdf.addPage();
      y = margin;
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title.toUpperCase(), margin, y);

    // Add full-width underline
    pdf.setLineWidth(0.1);
    pdf.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

    return y + 6;
  };

  // Header - Name and Contact
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const nameWidth = pdf.getTextWidth(resumeData.personalInfo.name);
  const nameX = (pageWidth - nameWidth) / 2;
  pdf.text(resumeData.personalInfo.name, nameX, currentY);
  currentY += 8;

  // Contact Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const contactInfo = `${resumeData.personalInfo.phone} | ${resumeData.personalInfo.email}`;
  const contactWidth = pdf.getTextWidth(contactInfo);
  const contactX = (pageWidth - contactWidth) / 2;
  pdf.text(contactInfo, contactX, currentY);
  currentY += sectionSpacing + 4;

  // Summary Section
  if (resumeData.professionalSummary) {
    currentY = addSectionHeader('SUMMARY', currentY);
    currentY = addText(
      resumeData.professionalSummary,
      margin,
      currentY,
      10,
      'normal',
      contentWidth
    );
    currentY += sectionSpacing;
  }

  // Education Section
  if (resumeData.education && resumeData.education.length > 0) {
    currentY = addSectionHeader('EDUCATION', currentY);

    resumeData.education.forEach((edu) => {
      if (currentY > pageHeight - 25) {
        pdf.addPage();
        currentY = margin;
      }

      // Institution name (bold)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(edu.institution, margin, currentY);

      // Year (right aligned)
      const yearWidth = pdf.getTextWidth(edu.year);
      pdf.text(edu.year, pageWidth - margin - yearWidth, currentY);
      currentY += lineHeight;

      // Degree
      pdf.setFont('helvetica', 'normal');
      pdf.text(edu.degree, margin, currentY);

      // GPA (right aligned if available)
      if (edu.gpa) {
        const gradeText = `Grade: ${edu.gpa}`;
        const gradeWidth = pdf.getTextWidth(gradeText);
        pdf.text(gradeText, pageWidth - margin - gradeWidth, currentY);
      }
      currentY += lineHeight + 3;
    });
    currentY += sectionSpacing;
  }

  // Experience Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    currentY = addSectionHeader('EXPERIENCE', currentY);

    resumeData.experience.forEach((exp) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      // Company name (bold)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.company, margin, currentY);

      // Duration (right aligned)
      const durationWidth = pdf.getTextWidth(exp.duration);
      pdf.text(exp.duration, pageWidth - margin - durationWidth, currentY);
      currentY += lineHeight;

      // Job title
      pdf.setFont('helvetica', 'normal');
      pdf.text(exp.title, margin, currentY);
      currentY += lineHeight + 2;

      // Job descriptions
      exp.description.forEach((desc) => {
        if (currentY > pageHeight - 15) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.text('•', margin, currentY);
        currentY = addText(
          desc,
          margin + 5,
          currentY,
          10,
          'normal',
          contentWidth - 5
        );
        currentY += 1;
      });
      currentY += 4;
    });
    currentY += sectionSpacing;
  }

  // Skills Section
  if (
    resumeData.skills &&
    (resumeData.skills.technical?.length > 0 ||
      resumeData.skills.soft?.length > 0)
  ) {
    currentY = addSectionHeader('SKILLS', currentY);

    if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
      if (currentY > pageHeight - 15) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('• Technical Skills:', margin, currentY);

      pdf.setFont('helvetica', 'normal');
      const techSkillsText = resumeData.skills.technical.join(', ');
      currentY = addText(
        techSkillsText,
        margin + 35,
        currentY,
        10,
        'normal',
        contentWidth - 35
      );
      currentY += 2;
    }

    if (resumeData.skills.soft && resumeData.skills.soft.length > 0) {
      if (currentY > pageHeight - 15) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('• Soft Skills:', margin, currentY);

      pdf.setFont('helvetica', 'normal');
      const softSkillsText = resumeData.skills.soft.join(', ');
      currentY = addText(
        softSkillsText,
        margin + 25,
        currentY,
        10,
        'normal',
        contentWidth - 25
      );
      currentY += sectionSpacing;
    }
  }

  // Projects Section
  if (resumeData.projects && resumeData.projects.length > 0) {
    currentY = addSectionHeader('PROJECTS', currentY);

    resumeData.projects.forEach((project) => {
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = margin;
      }

      // Project name (bold)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(project.name, margin, currentY);
      currentY += lineHeight;

      // Project description
      pdf.setFont('helvetica', 'normal');
      currentY = addText(
        project.description,
        margin,
        currentY,
        10,
        'normal',
        contentWidth
      );

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(', ')}`;
        pdf.setFont('helvetica', 'bold');
        const techLabelWidth = pdf.getTextWidth('Technologies: ');
        pdf.text('Technologies:', margin, currentY);
        pdf.setFont('helvetica', 'normal');
        currentY = addText(
          project.technologies.join(', '),
          margin + techLabelWidth,
          currentY,
          10,
          'normal',
          contentWidth - techLabelWidth
        );
      }
      currentY += 4;
    });
    currentY += sectionSpacing;
  }
  // Certifications Section
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    currentY = addSectionHeader('CERTIFICATIONS', currentY);

    const certsText = resumeData.certifications
      .map((cert) => cert.name)
      .join(', ');

    if (currentY > pageHeight - 15) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(certsText, margin, currentY, { maxWidth: pageWidth - margin * 2 });
    currentY += lineHeight + 2;
  }

  // Save the PDF
  pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
};
