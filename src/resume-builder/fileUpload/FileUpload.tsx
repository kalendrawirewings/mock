import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  uploadedFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isLoading,
  uploadedFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-purple-500/20 hover:border-purple-400 hover:bg-white/5'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className='flex flex-col items-center space-y-4'>
        {isLoading ? (
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500'></div>
        ) : (
          <Upload className='h-12 w-12 text-purple-400' />
        )}
        <div>
          {uploadedFile ? (
            <div className='space-y-2'>
              <div className='flex items-center justify-center space-x-2 text-green-400'>
                <FileText className='h-5 w-5' />
                <span className='font-medium'>{uploadedFile.name}</span>
              </div>
              <p className='text-sm text-gray-400'>
                File uploaded successfully! Click "Generate Resume" to continue.
              </p>
            </div>
          ) : (
            <>
              <p className='text-lg font-medium text-white'>
                {isDragActive
                  ? 'Drop your resume here...'
                  : 'Drop your resume here, or click to browse'}
              </p>
              <p className='text-sm text-gray-400 mt-2'>
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
