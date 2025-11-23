import React, { useState } from 'react';
import {
  FileText,
  Download,
  ArrowLeft,
  Sparkles,
  Upload,
  Bot,
} from 'lucide-react';
import { FileUpload } from '../fileUpload/FileUpload';
import { ResumePreview } from '../fileUpload/ResumePreview';
import { geminiService, ResumeData } from '../service/geminiService';
import { generateResumePDF } from '../../utils/pdfGenerator';

type Screen = 'input' | 'preview';

function Resume() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      setUploadedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!uploadedFile && !jobDescription.trim()) {
      setError('Please upload a resume or provide a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      let data: ResumeData;

      if (uploadedFile) {
        const text = await uploadedFile.text();
        data = await geminiService.analyzeExistingResume(text);
      } else {
        data = await geminiService.analyzeJobDescription(jobDescription);
      }

      setResumeData(data);
      setCurrentScreen('preview');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate resume'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;

    setIsDownloading(true);
    try {
      await generateResumePDF(resumeData);
    } catch (err) {
      setError('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const resetResume = () => {
    setCurrentScreen('input');
    setResumeData(null);
    setJobDescription('');
    setUploadedFile(null);
    setError(null);
  };

  const canGenerate = uploadedFile || jobDescription.trim();

  if (currentScreen === 'preview' && resumeData) {
    return (
      <div className='min-h-screen '>
        {/* Header */}
        <div className='md:border-b md:border-white/30'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center justify-between h-16'>
              <button
                onClick={resetResume}
                className='btn-secondary px-2 md:px-4 py-2'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Back</span>
              </button>
              <h1 className='text-[14px] text-nowrap md:text-xl font-semibold text-white'>
                Resume Preview
              </h1>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className='btn-tertiary text-[14px] md:text-xl px-2 md:px-4 py-2 flex items-center'
              >
                {isDownloading ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                ) : (
                  <Download className='h-4 w-4' />
                )}
                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className='max-w-5xl mx-auto p-4 pb-10 overflow-x-auto'>
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-12 animate-fade-down'>
          <h1 className='text-2xl md:text-4xl font-bold mb-4'>
            <span className='gradient-text'>AI-Powered</span>
            <span className='text-white'> Resume Builder</span>
          </h1>

          <div className='flex items-center justify-center gap-2 mb-6'>
            <span className='px-4 py-2  rounded-xl md:rounded-xl bg-purple-500/20 border border-purple-500/20 text-purple-400 flex items-center gap-2'>
              <span>
                {' '}
                Write a job description in detail — your name, phone, email,
                designation, school, college, internship, experience, skills,
                projects, certifications, etc.
              </span>
            </span>
          </div>
        </div>

        {error && (
          <div className='mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in'>
            <p className='text-red-400 text-center font-medium'>{error}</p>
          </div>
        )}

        <div className='grid lg:grid-cols-1 gap-8 mb-12'>
          {/* Upload Resume Card */}
          {/* <div className='card animate-fade-up'>
            <div className='text-center mb-6'>
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full w-fit mx-auto mb-4'>
                <Upload className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-semibold text-white mb-2'>
                Upload Existing Resume
              </h2>
              <p className='text-gray-300'>
                Upload your current resume and let AI enhance and optimize it
              </p>
            </div>
            <FileUpload
              onFileUpload={handleFileUpload}
              isLoading={isUploading}
              uploadedFile={uploadedFile}
            />
          </div> */}

          {/* Job Description Card */}
          <div
            className='card animate-fade-up'
            style={{ animationDelay: '0.1s' }}
          >
            <div className='text-center mb-6'>
              <div className='bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full w-fit mx-auto mb-4'>
                <FileText className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-semibold text-white mb-2'>
                Job Description
              </h2>
              <p className='text-gray-300'>
                Paste a job description to create a tailored resume
              </p>
            </div>

            <div className='space-y-4'>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder='Paste the job description here...'
                className='input h-40 resize-none placeholder-gray-400'
                disabled={isAnalyzing}
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className='text-center mb-16'>
          <button
            onClick={handleGenerateResume}
            disabled={isAnalyzing || !canGenerate}
            className={`btn-tertiary px-8 py-4 text-lg font-semibold flex items-center mx-auto ${
              !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                <span>Generating Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className='h-6 w-6' />
                <span>Generate Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Feature Highlights */}
        <div
          className='text-center animate-fade-up'
          style={{ animationDelay: '0.3s' }}
        >
          <h3 className='text-3xl font-semibold text-white mb-12'>
            Why Choose Our{' '}
            <span className='gradient-text'>AI Resume Builder</span>?
          </h3>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='card hover-effect'>
              <div className='bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-full w-fit mx-auto mb-6'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
              <h4 className='text-xl font-semibold mb-4 text-white'>
                AI-Powered Analysis
              </h4>
              <p className='text-gray-300 leading-relaxed'>
                Advanced analyzes job requirements and optimizes your resume
                content for maximum impact
              </p>
            </div>
            <div
              className='card hover-effect'
              style={{ animationDelay: '0.1s' }}
            >
              <div className='bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-fit mx-auto mb-6'>
                <FileText className='h-8 w-8 text-white' />
              </div>
              <h4 className='text-xl font-semibold mb-4 text-white'>
                Professional Format
              </h4>
              <p className='text-gray-300 leading-relaxed'>
                Clean, modern resume template that stands out to recruiters and
                passes ATS systems
              </p>
            </div>
            <div
              className='card hover-effect'
              style={{ animationDelay: '0.2s' }}
            >
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-fit mx-auto mb-6'>
                <Download className='h-8 w-8 text-white' />
              </div>
              <h4 className='text-xl font-semibold mb-4 text-white'>
                Instant PDF Download
              </h4>
              <p className='text-gray-300 leading-relaxed'>
                Download your professionally formatted resume as a high-quality
                PDF instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
