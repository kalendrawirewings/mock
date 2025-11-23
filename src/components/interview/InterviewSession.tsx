import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Play,
  Square,
  MessageCircle,
  Brain,
  User,
  FileText,
  AlertCircle,
  Target,
  Sparkles,
  MessageCircleWarning,
  X,
  Volume2,
  Headphones,
  Timer,
  Award,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { geminiService } from '../../services/geminiService';
import { storageService } from '../../services/storageService';
import {
  ConversationEntry,
  InterviewSession as InterviewSessionType,
  ResumeData,
  QuestionProgress,
  InterviewQuestion,
} from '../../types';

const InterviewSession: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [sessionId] = useState(() => Date.now().toString());
  const [startTime] = useState(() => new Date());
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [pauseTimer, setPauseTimer] = useState<NodeJS.Timeout | null>(null);
  const [pauseCountdown, setPauseCountdown] = useState(0);
  const [questionProgress, setQuestionProgress] =
    useState<QuestionProgress | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSubmitted = useRef(false);
  const isSubmitting = useRef(false);
  const lastSubmittedText = useRef('');
  const shouldAutoStartListening = useRef(false);
  const guidanceGiven = useRef(false);

  // Improved refs for pause detection and speech accumulation
  const lastSpeechTime = useRef<number>(0);
  const accumulatedTranscript = useRef<string>('');
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const isUserSpeaking = useRef<boolean>(false);
  const speechStartTime = useRef<number>(0);
  const lastProcessedTranscript = useRef<string>('');
  const speechEndTime = useRef<number>(0);
  const hasStartedSpeaking = useRef<boolean>(false);

  const speechSupport = speechService.isSupported();
  const totalQuestions = 25;

  // Configuration for pause detection - made more lenient
  const PAUSE_CONFIG = {
    MINIMUM_SPEECH_DURATION: 1500, // Reduced to 1.5 seconds
    SHORT_PAUSE_THRESHOLD: 2500, // Reduced to 2.5 seconds for faster response
    MINIMUM_WORDS: 2, // Reduced to 2 words minimum
    COUNTDOWN_DURATION: 5000, // Keep 5 seconds countdown
    FINAL_RESULT_DELAY: 1000, // Wait 1 second after final result before starting pause detection
  };

  useEffect(() => {
    const resumeData = storageService.getResumes();
    setResumes(resumeData);
    if (resumeData.length > 0) {
      setSelectedResume(resumeData[resumeData.length - 1]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    return () => {
      cleanupAllTimers();
    };
  }, []);

  // Auto-start listening after AI finishes speaking
  useEffect(() => {
    if (
      !isAISpeaking &&
      shouldAutoStartListening.current &&
      isSessionActive &&
      !isProcessing
    ) {
      shouldAutoStartListening.current = false;
      setTimeout(() => {
        if (!isListening && !isProcessing) {
          startListening();
        }
      }, 500);
    }
  }, [isAISpeaking, isSessionActive, isProcessing, isListening]);

  const cleanupAllTimers = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    if (countdownTimer.current) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    if (pauseTimer) {
      clearTimeout(pauseTimer);
      setPauseTimer(null);
    }
    setPauseCountdown(0);
  };

  const startInterview = async () => {
    if (!selectedResume) {
      alert('Please select a resume before starting the interview');
      return;
    }

    setIsSessionActive(true);
    setIsGeneratingQuestions(true);

    try {
      // Generate structured questions based on resume
      const questions = await geminiService.generateStructuredQuestions(
        selectedResume
      );
      setQuestionProgress(questions);

      // Get first question (introduction only)
      const firstQuestion = await geminiService.getNextQuestion(questions, 0);
      setCurrentQuestion(firstQuestion);
      setCurrentQuestionIndex(0);
      setQuestionsAsked(1);

      const resumeContext = `
        Candidate's name: ${selectedResume.personalInfo.name}
        Experience: ${selectedResume.experience
          .map((exp) => `${exp.position} at ${exp.company}`)
          .join(', ')}
        Skills: ${selectedResume.skills.join(', ')}
        Education: ${selectedResume.education
          .map((edu) => `${edu.degree} from ${edu.institution}`)
          .join(', ')}
      `;

      const greeting = await geminiService.generatePersonalizedGreeting(
        resumeContext,
        firstQuestion?.question || 'Tell me about yourself'
      );
      const aiEntry: ConversationEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        speaker: 'ai',
        message: greeting,
        questionId: firstQuestion?.id,
        category: firstQuestion?.category,
      };
      setConversation([aiEntry]);

      if (speechSupport.synthesis) {
        setIsAISpeaking(true);
        shouldAutoStartListening.current = true;
        try {
          await speechService.speak(greeting);
        } finally {
          setIsAISpeaking(false);
        }
      } else {
        setTimeout(() => startListening(), 1000);
      }
    } catch (error) {
      console.error('Interview start error:', error);
      const fallback = `Hello ${selectedResume.personalInfo.name}, welcome to your AI interview session. Let's start with an introduction - tell me about yourself and your background.`;
      setConversation([
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          speaker: 'ai',
          message: fallback,
        },
      ]);
      if (speechSupport.synthesis) {
        setIsAISpeaking(true);
        shouldAutoStartListening.current = true;
        try {
          await speechService.speak(fallback);
        } finally {
          setIsAISpeaking(false);
        }
      } else {
        setTimeout(() => startListening(), 1000);
      }
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Completely rewritten speech input handling with better state management
  const handleSpeechInput = (transcript: string, isFinal: boolean) => {
    if (isSubmitting.current) return;

    const currentTime = Date.now();
    const trimmedTranscript = transcript.trim();

    console.log('Speech input:', {
      transcript: trimmedTranscript,
      isFinal,
      isUserSpeaking: isUserSpeaking.current,
    });

    // Handle speech start detection
    if (trimmedTranscript && !hasStartedSpeaking.current) {
      console.log('User started speaking');
      hasStartedSpeaking.current = true;
      isUserSpeaking.current = true;
      speechStartTime.current = currentTime;
      lastSpeechTime.current = currentTime;
      accumulatedTranscript.current = '';
      clearAllPauseTimers();
    }

    if (trimmedTranscript) {
      lastSpeechTime.current = currentTime;

      if (isFinal) {
        // This is a final result from speech recognition
        console.log('Final result received:', trimmedTranscript);

        // Only add if it's actually new content
        if (trimmedTranscript !== lastProcessedTranscript.current) {
          if (
            accumulatedTranscript.current &&
            !accumulatedTranscript.current.includes(trimmedTranscript)
          ) {
            accumulatedTranscript.current += ' ' + trimmedTranscript;
          } else if (!accumulatedTranscript.current) {
            accumulatedTranscript.current = trimmedTranscript;
          }
          lastProcessedTranscript.current = trimmedTranscript;
        }

        setCurrentTranscript(accumulatedTranscript.current);

        // Start pause detection after final result with a delay
        speechEndTime.current = currentTime;

        setTimeout(() => {
          if (
            Date.now() - speechEndTime.current >=
            PAUSE_CONFIG.FINAL_RESULT_DELAY
          ) {
            console.log('Starting pause monitoring after final result');
            startPauseMonitoring();
          }
        }, PAUSE_CONFIG.FINAL_RESULT_DELAY);
      } else {
        // Interim result - just display it combined with accumulated
        const combined = accumulatedTranscript.current
          ? `${accumulatedTranscript.current} ${trimmedTranscript}`.trim()
          : trimmedTranscript;
        setCurrentTranscript(combined);

        // Clear pause timers during interim results (user is still speaking)
        clearAllPauseTimers();
      }
    }
  };

  const clearAllPauseTimers = () => {
    console.log('Clearing all pause timers');
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    if (countdownTimer.current) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    setPauseCountdown(0);
  };

  const startPauseMonitoring = () => {
    const currentText = accumulatedTranscript.current.trim();

    console.log('startPauseMonitoring called with text:', currentText);

    if (!currentText || isSubmitting.current) {
      console.log('No text or already submitting, aborting pause monitoring');
      return;
    }

    const wordCount = currentText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const speechDuration = speechEndTime.current - speechStartTime.current;

    console.log(
      `Pause monitoring - Words: ${wordCount}, Duration: ${speechDuration}ms`
    );

    // Check minimum requirements
    if (
      wordCount < PAUSE_CONFIG.MINIMUM_WORDS ||
      speechDuration < PAUSE_CONFIG.MINIMUM_SPEECH_DURATION
    ) {
      console.log('Minimum requirements not met, not starting pause detection');
      resetSpeechState();
      return;
    }

    console.log(
      `Starting silence timer for ${PAUSE_CONFIG.SHORT_PAUSE_THRESHOLD}ms`
    );

    // Start silence detection timer
    silenceTimer.current = setTimeout(() => {
      if (isSubmitting.current) {
        console.log('Already submitting, not starting countdown');
        return;
      }

      console.log('Silence threshold reached, starting countdown');
      startCountdown();
    }, PAUSE_CONFIG.SHORT_PAUSE_THRESHOLD);
  };

  const startCountdown = () => {
    const currentText = accumulatedTranscript.current.trim();

    console.log('startCountdown called with text:', currentText);

    if (
      !currentText ||
      isSubmitting.current ||
      currentText === lastSubmittedText.current
    ) {
      console.log('Invalid state for countdown start');
      return;
    }

    let countdownTime = Math.floor(PAUSE_CONFIG.COUNTDOWN_DURATION / 1000);
    setPauseCountdown(countdownTime);

    console.log(`Starting countdown from ${countdownTime} seconds`);

    countdownInterval.current = setInterval(() => {
      countdownTime -= 1;
      console.log(`Countdown: ${countdownTime}`);
      setPauseCountdown(countdownTime);

      if (countdownTime <= 0) {
        console.log('Countdown finished, auto-submitting');
        clearInterval(countdownInterval.current!);
        setPauseCountdown(0);

        const finalText = accumulatedTranscript.current.trim();
        if (
          !isSubmitting.current &&
          finalText &&
          finalText !== lastSubmittedText.current
        ) {
          console.log('Auto-submitting text:', finalText);
          handleUserResponse(finalText);
        }
      }
    }, 1000);

    // Safety timeout
    countdownTimer.current = setTimeout(() => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
      setPauseCountdown(0);
    }, PAUSE_CONFIG.COUNTDOWN_DURATION + 1000);
  };

  const resetSpeechState = () => {
    console.log('Resetting speech state');
    hasStartedSpeaking.current = false;
    isUserSpeaking.current = false;
    accumulatedTranscript.current = '';
    lastProcessedTranscript.current = '';
    speechStartTime.current = 0;
    speechEndTime.current = 0;
  };

  const startListening = () => {
    if (!speechSupport.recognition) {
      alert(
        'Speech recognition is not supported in your browser. Please use Chrome or Edge for the best experience.'
      );
      return;
    }

    console.log('Starting to listen...');

    // Reset all state
    setIsListening(true);
    setCurrentTranscript('');
    clearAllPauseTimers();
    resetSpeechState();

    speechService.startListening(handleSpeechInput, (err) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
      clearAllPauseTimers();
      resetSpeechState();

      if (
        err.toString().includes('not-allowed') ||
        err.toString().includes('audio-capture')
      ) {
        alert(
          'Microphone access is required for the interview. Please allow microphone access and try again.'
        );
      }
    });
  };

  const stopListening = () => {
    console.log('Stopping listening...');
    speechService.stopListening();
    setIsListening(false);
    setCurrentTranscript('');
    clearAllPauseTimers();
    resetSpeechState();
  };

  const handleUserResponse = async (transcript: string) => {
    if (
      !transcript.trim() ||
      isSubmitting.current ||
      !currentQuestion ||
      !selectedResume ||
      transcript === lastSubmittedText.current
    ) {
      return;
    }

    console.log('Handling user response:', transcript);

    isSubmitting.current = true;
    lastSubmittedText.current = transcript;

    stopListening();

    const userEntry: ConversationEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      speaker: 'candidate',
      message: transcript,
      questionId: currentQuestion.id,
      category: currentQuestion.category,
    };
    setConversation((prev) => [...prev, userEntry]);
    setIsProcessing(true);

    try {
      // Check if candidate is asking a question
      const isQuestion = await geminiService.isUserAskingQuestion(transcript);

      if (isQuestion) {
        // Handle candidate's question
        const response = await geminiService.answerCandidateQuestion(
          transcript,
          selectedResume
        );
        const aiEntry: ConversationEntry = {
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          speaker: 'ai',
          message: response,
        };
        setConversation((prev) => [...prev, aiEntry]);

        if (speechSupport.synthesis) {
          setIsAISpeaking(true);
          shouldAutoStartListening.current = true;
          try {
            await speechService.speak(response);
          } finally {
            setIsAISpeaking(false);
          }
        } else {
          setTimeout(() => {
            if (!isListening) startListening();
          }, 500);
        }
      } else {
        // Validate the answer
        const validation = await geminiService.validateAnswer(
          currentQuestion,
          transcript,
          selectedResume
        );

        // Update current question with answer and validation
        const updatedQuestion = {
          ...currentQuestion,
          candidateAnswer: transcript,
          isCorrect: validation.isCorrect,
          score: validation.score,
          feedback: validation.feedback,
        };

        // Update question progress
        if (questionProgress) {
          const updatedProgress = { ...questionProgress };
          const category = currentQuestion.category;
          const questionIndex = updatedProgress[category].questions.findIndex(
            (q) => q.id === currentQuestion.id
          );
          if (questionIndex >= 0) {
            updatedProgress[category].questions[questionIndex] =
              updatedQuestion;
            updatedProgress[category].completed += 1;
          }
          setQuestionProgress(updatedProgress);
        }

        // Provide guidance if answer is incorrect or incomplete, but only once per question
        if (
          (!validation.isCorrect || validation.score < 70) &&
          !guidanceGiven.current
        ) {
          guidanceGiven.current = true;
          const guidance = await geminiService.provideGuidance(
            currentQuestion,
            transcript,
            selectedResume
          );
          const guidanceEntry: ConversationEntry = {
            id: (Date.now() + 1).toString(),
            timestamp: new Date(),
            speaker: 'ai',
            message: guidance,
          };
          setConversation((prev) => [...prev, guidanceEntry]);

          if (speechSupport.synthesis) {
            setIsAISpeaking(true);
            shouldAutoStartListening.current = true;
            try {
              await speechService.speak(guidance);
            } finally {
              setIsAISpeaking(false);
            }
          } else {
            setTimeout(() => {
              if (!isListening) startListening();
            }, 500);
          }
        } else {
          // Move to next question or end interview
          guidanceGiven.current = false;
          const nextIndex = currentQuestionIndex + 1;
          if (nextIndex < totalQuestions && questionProgress) {
            const nextQuestion = await geminiService.getNextQuestion(
              questionProgress,
              nextIndex
            );
            if (nextQuestion) {
              setCurrentQuestion(nextQuestion);
              setCurrentQuestionIndex(nextIndex);
              setQuestionsAsked((prev) => prev + 1);

              const nextQuestionText =
                await geminiService.generateNextQuestionTransition(
                  nextQuestion,
                  selectedResume
                );
              const aiEntry: ConversationEntry = {
                id: (Date.now() + 2).toString(),
                timestamp: new Date(),
                speaker: 'ai',
                message: nextQuestionText,
                questionId: nextQuestion.id,
                category: nextQuestion.category,
              };

              setConversation((prev) => [...prev, aiEntry]);

              if (speechSupport.synthesis) {
                setIsAISpeaking(true);
                shouldAutoStartListening.current = true;
                try {
                  await speechService.speak(nextQuestionText);
                } finally {
                  setIsAISpeaking(false);
                }
              } else {
                setTimeout(() => {
                  if (!isListening) startListening();
                }, 500);
              }
            }
          } else {
            // Interview completed
            const completionMessage =
              'Thank you for completing the interview! Your responses have been recorded and analyzed. Let me provide you with detailed feedback on your performance.';
            const aiEntry: ConversationEntry = {
              id: (Date.now() + 2).toString(),
              timestamp: new Date(),
              speaker: 'ai',
              message: completionMessage,
            };

            setConversation((prev) => [...prev, aiEntry]);

            if (speechSupport.synthesis) {
              setIsAISpeaking(true);
              try {
                await speechService.speak(completionMessage);
              } finally {
                setIsAISpeaking(false);
              }
            }

            setTimeout(() => {
              endInterview();
            }, 3000);
          }
        }
      }
    } catch (err) {
      console.error('Response processing error:', err);
      const errorMessage =
        'I apologize, but I had trouble processing that. Could you please repeat your response?';
      setConversation((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          speaker: 'ai',
          message: errorMessage,
        },
      ]);

      if (speechSupport.synthesis) {
        setIsAISpeaking(true);
        shouldAutoStartListening.current = true;
        try {
          await speechService.speak(errorMessage);
        } finally {
          setIsAISpeaking(false);
        }
      } else {
        setTimeout(() => {
          if (!isListening) startListening();
        }, 500);
      }
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        isSubmitting.current = false;
        lastSubmittedText.current = '';
      }, 1000);
    }
  };

  const endInterview = async () => {
    setIsSessionActive(false);
    stopListening();
    speechService.stopSpeaking();
    shouldAutoStartListening.current = false;
    guidanceGiven.current = false;
    cleanupAllTimers();

    if (conversation.length > 0 && selectedResume && questionProgress) {
      const session: InterviewSessionType = {
        id: sessionId,
        date: startTime,
        duration: Math.floor((Date.now() - startTime.getTime()) / 1000 / 60),
        transcript: conversation,
        scores: {
          communication: 0,
          technicalKnowledge: 0,
          problemSolving: 0,
          confidence: 0,
          clarityOfThought: 0,
          overallAccuracy: 0,
        },
        feedback: {
          strengths: [],
          improvements: [],
          mistakes: [],
          tips: [],
          resources: [],
          categoryScores: {
            introduction: 0,
            technical: 0,
            experience: 0,
            certification: 0,
            careerGoals: 0,
            softSkills: 0,
          },
          correctAnswers: 0,
          totalQuestions: totalQuestions,
          accuracyPercentage: 0,
        },
        status: 'completed',
        resumeId: selectedResume.id,
        questionProgress,
        currentQuestionIndex,
        totalQuestions,
      };

      try {
        const fullTranscript = conversation
          .map((c) => `${c.speaker}: ${c.message}`)
          .join('\n');
        const evaluation = await geminiService.evaluateInterview(
          fullTranscript,
          selectedResume,
          questionProgress
        );
        session.scores = evaluation.scores;
        session.feedback = evaluation.feedback;
        storageService.saveInterview(session);
      } catch {
        storageService.saveInterview(session);
      } finally {
        window.location.href = `/feedback?session=${sessionId}`;
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='text-center'>
        <div className='flex items-center justify-center mb-4'>
          <Sparkles className='w-6 h-6 text-purple-400 mr-2' />
          <h1 className='text-3xl font-bold gradient-text'>
            AI Interview Session
          </h1>
          <Sparkles className='w-6 h-6 text-pink-400 ml-2' />
        </div>
        <p className='text-lg text-gray-300'>
          Professional interview experience with AI-powered assessment
        </p>
      </div>

      {/* Simple Progress Indicator (No Question Numbers) */}
      {isSessionActive && (
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-2'>
              <Target className='w-5 h-5 text-purple-400' />
              <h3 className='text-lg font-semibold text-white'>
                Interview Progress
              </h3>
            </div>
            <div className='text-sm text-gray-400'>
              Questions Asked: {questionsAsked}
            </div>
          </div>

          <div className='w-full bg-gray-700 rounded-full h-2 mb-4'>
            <div
              className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300'
              style={{ width: `${(questionsAsked / totalQuestions) * 100}%` }}
            />
          </div>

          <div className='text-center'>
            <p className='text-sm text-gray-400'>
              Interview in progress - Speak naturally and take natural pauses
            </p>
          </div>
        </div>
      )}

      {/* Resume Selection */}
      {!isSessionActive && (
        <div className='card'>
          <div className='flex items-center space-x-2 mb-4'>
            <h3 className='text-lg font-semibold text-white'>
              Select Resume for Interview
            </h3>
          </div>

          {resumes.length > 0 ? (
            <div className='space-y-3'>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => setSelectedResume(resume)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedResume?.id === resume.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-white'>
                        {resume.fileName}
                      </p>
                      <p className='text-sm text-gray-400'>
                        {resume.personalInfo.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        Score: {resume.analysis.overallScore}/100 • Uploaded{' '}
                        {new Date(resume.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedResume?.id === resume.id && (
                      <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
                        <div className='w-2 h-2 bg-white rounded-full' />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <FileText className='w-12 h-12 text-gray-600 mx-auto mb-4' />
              <p className='text-gray-400 mb-4'>No resumes found</p>
              <a
                href='/resume'
                className='text-purple-400 hover:text-purple-300 font-medium'
              >
                Upload a resume first
              </a>
            </div>
          )}
        </div>
      )}

      {/* Interview Controls */}
      <div className='card sticky top-20 z-10 hidden md:block'>
        <div className='flex items-center justify-center space-x-4'>
          {!isSessionActive ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInstructions(true)}
                className='flex text-[12px] md:text-16px items-center space-x-2 border border-yellow-500 bg-yellow-100 text-yellow-800 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <MessageCircleWarning className='w-5 h-5' />
                <span>{'Read Instructions'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startInterview}
                disabled={!selectedResume || isGeneratingQuestions}
                className='flex text-[12px] md:text-16px items-center space-x-2 btn-tertiary px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Play className='w-5 h-5' />
                <span>
                  {isGeneratingQuestions
                    ? 'Preparing Interview...'
                    : 'Start Interview'}
                </span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                disabled={isAISpeaking || isProcessing || isSubmitting.current}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? (
                  <MicOff className='w-5 h-5' />
                ) : (
                  <Mic className='w-5 h-5' />
                )}
                <span>{isListening ? 'Stop Speaking' : 'Start Speaking'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endInterview}
                className='flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all'
              >
                <Square className='w-5 h-5' />
                <span>End Interview</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Status Indicators */}
        <div className='flex items-center justify-center space-x-6 mt-4'>
          <div className='flex items-center space-x-2'>
            <div
              className={`w-3 h-3 rounded-full ${
                isAISpeaking ? 'bg-purple-500 animate-pulse' : 'bg-gray-600'
              }`}
            />
            <span className='text-sm text-gray-400'>AI Speaking</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div
              className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
              }`}
            />
            <span className='text-sm text-gray-400'>Listening</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div
              className={`w-3 h-3 rounded-full ${
                isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'
              }`}
            />
            <span className='text-sm text-gray-400'>Processing</span>
          </div>
          {pauseCountdown > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 rounded-full bg-orange-500 animate-pulse' />
              <span className='text-sm text-orange-400'>
                Auto-submit in {pauseCountdown}s
              </span>
            </div>
          )}
        </div>

        {/* Current Transcript */}
        <div className='py-2'>
          {currentTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-black/20 border border-purple-500 rounded-xl p-4'
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                  <Mic className='w-4 h-4 text-purple-400' />
                  <span className='text-sm font-medium text-purple-500'>
                    You're saying:
                  </span>
                </div>
              </div>
              <p className='text-purple-500'>{currentTranscript}</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className='bg-yellow-100 block md:hidden border border-yellow-500/20 rounded-xl p-4 text-yellow-800 font-semibold text-center flex items-center justify-center space-x-2'>
        <span className='block text-sm md:text-base'>
          <MessageCircleWarning className='w-5 h-5' />
        </span>
        <h1 className=''>Please Use PC/Laptop Device</h1>
      </div>

      {/* Selected Resume Info */}
      {selectedResume && isSessionActive && (
        <div className='bg-pink-500/10 border border-pink-500/20 rounded-xl p-4'>
          <div className='flex items-center space-x-2'>
            <FileText className='w-4 h-4 text-pink-400' />
            <span className='text-sm font-medium text-pink-300'>
              Interview based on: {selectedResume.fileName} (
              {selectedResume.personalInfo.name})
            </span>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className='card'>
        <div className='p-6 border-b border-white/10'>
          <div className='flex items-center space-x-2'>
            <h2 className='text-lg font-semibold text-white'>
              Interview Conversation
            </h2>
          </div>
        </div>

        <div className='p-6 space-y-4 max-h-96 overflow-y-auto'>
          <AnimatePresence>
            {conversation.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  entry.speaker === 'candidate'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${
                    entry.speaker === 'candidate'
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.speaker === 'ai'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {entry.speaker === 'ai' ? (
                      <Brain className='w-4 h-4' />
                    ) : (
                      <User className='w-4 h-4' />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-4 ${
                      entry.speaker === 'ai'
                        ? 'bg-white/5 text-gray-200 border border-white/10'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}
                  >
                    <p className='text-sm'>{entry.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        entry.speaker === 'ai'
                          ? 'text-gray-500'
                          : 'text-purple-200'
                      }`}
                    >
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {conversation.length === 0 && (
            <div className='text-center py-8'>
              <MessageCircle className='w-12 h-12 text-gray-600 mx-auto mb-4' />
              <p className='text-gray-400'>
                Your interview conversation will appear here
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Browser Support Warning */}
      {(!speechSupport.synthesis || !speechSupport.recognition) && (
        <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4'>
          <div className='flex items-center space-x-2'>
            <AlertCircle className='w-5 h-5 text-yellow-400' />
            <div>
              <h3 className='text-sm font-medium text-yellow-300'>
                Limited Browser Support
              </h3>
              <p className='text-sm text-yellow-400 mt-1'>
                {!speechSupport.synthesis &&
                  'Text-to-speech is not supported. '}
                {!speechSupport.recognition &&
                  'Speech recognition is not supported. '}
                For the best experience, please use Chrome or Edge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 '
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='bg-gray-900 rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] pb-10 overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='sticky top-0 bg-gray-900 border-b border-white/10 p-6 rounded-t-2xl'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                      <BookOpen className='w-5 h-5 text-white' />
                    </div>
                    <div>
                      <h2 className='text-xl md:text-2xl font-bold text-white'>
                        Interview Instructions
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className='w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>
              </div>

              <div className='p-6 space-y-8'>
                {/* Overview Section */}
                <div className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6'>
                  <div className='flex items-center space-x-3 mb-4'>
                    <Target className='w-6 h-6 text-purple-400' />
                    <h3 className='text-xl font-semibold text-white'>
                      Interview Overview
                    </h3>
                  </div>
                  <div className='space-y-3 text-gray-300'>
                    <p>
                      Welcome to your AI-powered interview session! This system
                      will conduct a comprehensive interview tailored to your
                      resume and experience.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      <div className='bg-white/5 rounded-lg p-4'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <Timer className='w-4 h-4 text-blue-400' />
                          <span className='text-sm font-medium text-blue-300'>
                            Duration
                          </span>
                        </div>
                        <p className='text-sm text-gray-400'>
                          25 questions, approximately 30-45 minutes
                        </p>
                      </div>
                      <div className='bg-white/5 rounded-lg p-4'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <Award className='w-4 h-4 text-green-400' />
                          <span className='text-sm font-medium text-green-300'>
                            Assessment
                          </span>
                        </div>
                        <p className='text-sm text-gray-400'>
                          Answer at least 5 questions to evaluation with instant
                          feedback
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Setup */}
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <Headphones className='w-6 h-6 text-blue-400' />
                    <h3 className='text-xl font-semibold text-white'>
                      Technical Setup
                    </h3>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
                      <div className='flex items-center space-x-2 mb-3'>
                        <Mic className='w-5 h-5 text-green-400' />
                        <h4 className='font-medium text-white'>
                          Microphone Required
                        </h4>
                      </div>
                      <ul className='space-y-1 text-sm text-gray-400'>
                        <li>• Allow microphone access when prompted</li>
                        <li>• Use a quiet environment</li>
                        <li>• Test your microphone beforehand</li>
                        <li>• Speak clearly and at normal pace</li>
                      </ul>
                    </div>
                    <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
                      <div className='flex items-center space-x-2 mb-3'>
                        <Volume2 className='w-5 h-5 text-purple-400' />
                        <h4 className='font-medium text-white'>Audio Output</h4>
                      </div>
                      <ul className='space-y-1 text-sm text-gray-400'>
                        <li>• Enable speakers or use headphones</li>
                        <li>• AI will speak questions aloud</li>
                        <li>• Adjust volume as needed</li>
                        <li>• Chrome/Edge browsers recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <Lightbulb className='w-6 h-6 text-yellow-400' />
                    <h3 className='text-xl font-semibold text-white'>
                      How It Works
                    </h3>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        1
                      </div>
                      <div>
                        <h4 className='font-medium text-white mb-1'>
                          AI Asks Questions
                        </h4>
                        <p className='text-sm text-gray-400'>
                          Questions are personalized based on your resume and
                          cover various topics including technical skills,
                          experience, and soft skills.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        2
                      </div>
                      <div>
                        <h4 className='font-medium text-white mb-1'>
                          You Respond
                        </h4>
                        <p className='text-sm text-gray-400'>
                          Click "Start Speaking" and answer naturally. The
                          system automatically processes your response after you
                          finish speaking.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        3
                      </div>
                      <div>
                        <h4 className='font-medium text-white mb-1'>
                          End Interview
                        </h4>
                        <p className='text-sm text-gray-400'>
                          Click "End Interview" and answer naturally. After you
                          finish speaking, the system automatically processes
                          your response.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        4
                      </div>
                      <div>
                        <h4 className='font-medium text-white mb-1'>
                          Real-time Assessment
                        </h4>
                        <p className='text-sm text-gray-400'>
                          Each answer is evaluated and you receive guidance if
                          needed. The AI moves to the next question
                          automatically.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                        5
                      </div>
                      <div>
                        <h4 className='font-medium text-white mb-1'>
                          Detailed Feedback
                        </h4>
                        <p className='text-sm text-gray-400'>
                          Answer al least 5 questions to complete the interview.
                          After completion, receive comprehensive feedback with
                          scores, strengths, areas for improvement, and
                          resources.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Categories */}
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <h3 className='text-xl font-semibold text-white'>
                      Question Categories
                    </h3>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {[
                      {
                        name: 'Introduction',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                      {
                        name: 'Technical Skills',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                      {
                        name: 'Experience',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                      {
                        name: 'Certifications',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                      {
                        name: 'Career Goals',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                      {
                        name: 'Soft Skills',
                        color:
                          'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      },
                    ].map((category) => (
                      <div
                        key={category.name}
                        className={`${category.color} border rounded-lg p-3 text-center`}
                      >
                        <p className='text-sm font-medium'>{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewSession;
