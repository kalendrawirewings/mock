import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import {
  Users,
  Target,
  BookOpen,
  Code,
  GraduationCap,
  DollarSign,
  Server,
  Globe,
  CheckCircle,
} from 'lucide-react';

import qr from '../../assets/QR/payment-QR.png';
import MSME from '../../assets/logo/msme.png';

function HelpUs() {
  const supportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (supportRef.current) {
      supportRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const quickActions = [
    {
      title: 'For Every Student',
      description:
        'Making quality interview preparation accessible to students from all economic backgrounds.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      title: 'AI-Powered Excellence',
      description:
        'Cutting-edge AI technology providing personalized feedback and realistic scenarios.',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
    },
    {
      title: 'Comprehensive Learning',
      description:
        'Covering every aspect of interview preparation across multiple industries.',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  ];

  const currentFeatures = [
    {
      title: 'Mock Interviews',
      description: 'AI-powered realistic interview scenarios',
      icon: Target,
      color: 'text-blue-400',
    },
    {
      title: 'Instant Feedback',
      description: 'Detailed analysis and improvement suggestions',
      icon: BookOpen,
      color: 'text-green-400',
    },
    {
      title: 'Skill Assessment',
      description: 'Comprehensive evaluation of your abilities',
      icon: GraduationCap,
      color: 'text-purple-400',
    },
    {
      title: 'Multiple Industries',
      description: 'Tech, finance, healthcare, and more',
      icon: Users,
      color: 'text-pink-400',
    },
  ];

  const supportItems = [
    {
      title: 'Server & Infrastructure Costs',
      description: 'High-performance AI processing and reliable hosting',
      icon: Server,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Domain & Maintenance',
      description: 'Keeping the platform secure and up-to-date',
      icon: Globe,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Content Development',
      description: 'Creating new interview questions and learning materials',
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Developers Cost',
      description: 'Building new tools and improving existing ones',
      icon: Code,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <>
      <div className=''>
        {/* Ambient background with moving particles */}

        <div className='relative z-10'>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative max-w-7xl mx-auto px-4  mt-4'
          >
            <div className='text-center'>
              <div className='flex items-center justify-center mb-6'>
                <h1 className='text-2xl md:text-4xl font-bold gradient-text mb-6 leading-tight'>
                  Help Us Build a Better Future
                </h1>
              </div>
              <p className='text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed'>
                Empowering students with free AI-powered interview preparation
                and career development tools
              </p>
            </div>
          </motion.div>

          {/* Mission Section */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-center mb-16'
            >
              <h2 className='text-3xl md:text-4xl font-bold text-white py-4'>
                Our Mission
              </h2>
              <p className='text-lg text-gray-300 max-w-3xl mx-auto'>
                We believe that career growth opportunities shouldn't be limited
                by financial constraints. That's why we're building the world's
                most comprehensive free AI interview platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='grid md:grid-cols-3 gap-8 mb-20'
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className='card hover-effect group'
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-6`}
                  >
                    <action.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors'>
                    {action.title}
                  </h3>
                  <p className='text-gray-400 leading-relaxed'>
                    {action.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='card mb-20'
            >
              <div className='text-center mb-10'>
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                  The Problem We're Solving
                </h2>
              </div>

              <div className='grid md:grid-cols-2 gap-12 items-center'>
                <div>
                  <h3 className='text-2xl font-semibold text-white mb-6'>
                    Current Challenges
                  </h3>
                  <ul className='space-y-4'>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-red-500/20 p-2 rounded-full mt-1'>
                        <DollarSign className='h-4 w-4 text-red-400' />
                      </div>
                      <span className='text-gray-300'>
                        Most interview preparation platforms charge expensive
                        monthly fees
                      </span>
                    </li>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-red-500/20 p-2 rounded-full mt-1'>
                        <Users className='h-4 w-4 text-red-400' />
                      </div>
                      <span className='text-gray-300'>
                        Limited access for students from developing countries
                        and low-income families
                      </span>
                    </li>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-red-500/20 p-2 rounded-full mt-1'>
                        <Target className='h-4 w-4 text-red-400' />
                      </div>
                      <span className='text-gray-300'>
                        Lack of personalized feedback and AI-driven insights
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-2xl font-semibold text-white mb-6'>
                    Our Solution
                  </h3>
                  <ul className='space-y-4'>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-green-500/20 p-2 rounded-full mt-1'>
                        <CheckCircle className='h-4 w-4 text-green-400' />
                      </div>
                      <span className='text-gray-300'>
                        100% free platform with no subscription fees or hidden
                        charges
                      </span>
                    </li>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-green-500/20 p-2 rounded-full mt-1'>
                        <CheckCircle className='h-4 w-4 text-green-400' />
                      </div>
                      <span className='text-gray-300'>
                        Advanced AI technology providing instant, detailed
                        feedback
                      </span>
                    </li>
                    <li className='flex items-start space-x-3'>
                      <div className='bg-green-500/20 p-2 rounded-full mt-1'>
                        <CheckCircle className='h-4 w-4 text-green-400' />
                      </div>
                      <span className='text-gray-300'>
                        Accessible worldwide, breaking down financial barriers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Current Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-center mb-16'
            >
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                What We Offer Today
              </h2>
              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {currentFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className='card hover-effect'
                  >
                    <div className='bg-white/5 p-3 rounded-full w-fit mx-auto mb-4 border border-white/10'>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className='font-semibold text-white mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-sm text-gray-400'>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className=' mb-20'
            >
              <div className='text-center mb-10'>
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                  Coming Soon
                </h2>
                <p className='text-lg text-gray-400'>
                  Exciting new features in development
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-8'>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className='bg-white/5 p-8 rounded-2xl border border-white/10 hover-effect'
                >
                  <div className='bg-indigo-500/20 p-3 rounded-full w-fit mb-6'>
                    <BookOpen className='h-8 w-8 text-indigo-400' />
                  </div>
                  <h3 className='text-2xl font-semibold text-white mb-4'>
                    E-Learning Platform
                  </h3>
                  <p className='text-gray-400 leading-relaxed'>
                    Comprehensive courses covering interview skills,
                    communication techniques, and industry-specific knowledge to
                    boost your confidence.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className='bg-white/5 p-8 rounded-2xl border border-white/10 hover-effect'
                >
                  <div className='bg-purple-500/20 p-3 rounded-full w-fit mb-6'>
                    <Code className='h-8 w-8 text-purple-400' />
                  </div>
                  <h3 className='text-2xl font-semibold text-white mb-4'>
                    Code Playground
                  </h3>
                  <p className='text-gray-400 leading-relaxed'>
                    Interactive coding environment for technical interviews with
                    real-time code execution and AI-powered code review.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Support Section */}
            <motion.div
              ref={supportRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className=' mb-20'
            >
              <div className='text-center mb-12'>
                <h2 className='text-3xl md:text-4xl font-bold gradient-text mb-6'>
                  Help Us Keep It Free
                </h2>
                <p className='text-lg text-gray-300 max-w-3xl mx-auto'>
                  Running a free platform requires significant resources. Your
                  support helps us maintain and improve our services without
                  compromising our commitment to free education.
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-12 items-center'>
                <div>
                  <h3 className='text-2xl font-semibold text-white mb-6'>
                    What Your Support Covers
                  </h3>
                  <ul className='space-y-4'>
                    {supportItems.map((item, index) => (
                      <li key={index} className='flex items-start space-x-3'>
                        <div
                          className={`${item.bgColor} p-2 rounded-full mt-1`}
                        >
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div>
                          <span className='font-medium text-white'>
                            {item.title}
                          </span>
                          <p className='text-sm text-gray-400'>
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className='mt-8 p-4 bg-white/5 rounded-lg border border-yellow-500/30'>
                    <p className='text-sm text-gray-300 font-medium'>
                      🚫 <span className='text-red-400'>No Advertisements</span>{' '}
                      - We maintain a clean, distraction-free learning
                      environment
                    </p>
                  </div>
                </div>

                <div className='text-center'>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className='bg-white/5 p-8 rounded-2xl border border-white/10 max-w-sm mx-auto hover-effect'
                  >
                    <h3 className='text-xl font-semibold text-white mb-6'>
                      Support Our Mission
                    </h3>

                    {/* QR Code Placeholder */}
                    <div className='bg-white/5 p-8 rounded-xl mb-6 border border-white/10'>
                      <div className='w-40 h-40 mx-auto bg-white/10 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-500'>
                        <img src={qr} alt='QR Code' className='w-36 h-36' />
                      </div>
                      <p className='text-sm text-gray-400 mt-4'>
                        Scan to donate via 9170331589@ptyes
                      </p>
                    </div>

                    <p className='text-sm text-gray-400 mb-4'>
                      Every contribution, no matter how small, makes a
                      difference in a student's life.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* MSME Certificate Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className='text-center'>
                <div className='flex justify-center mb-6'>
                  <div className=' rounded-full'>
                    <img src={MSME} alt='MSME Logo' className='h-28 w-28' />
                  </div>
                </div>
                <h2 className='text-2xl md:text-3xl font-bold text-white mb-6'>
                  Officially MSME Certified
                </h2>

                <div className='bg-gradient-to-r from-green-500/10 to-blue-500/10 p-8 rounded-2xl border border-green-500/30 max-w-2xl mx-auto'>
                  <div className='bg-white/5 p-6 rounded-xl border border-white/10'>
                    <p className='text-sm text-gray-300 leading-relaxed'>
                      We are proud to be registered and certified under the
                      Ministry of Micro, Small and Medium Enterprises,
                      Government of India. This certification validates our
                      commitment to quality education and transparent business
                      practices.
                    </p>

                    <div className='mt-4 pt-4 border-t border-white/10'>
                      <p className='text-xs text-white'>
                        REGISTRATION NUMBER : UDYAM-UP-50-0205170
                      </p>
                    </div>
                  </div>
                </div>

                <p className='text-gray-400 mt-6 max-w-2xl mx-auto'>
                  This recognition ensures that your support goes to a
                  legitimate organization committed to making quality education
                  accessible to all.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpUs;
