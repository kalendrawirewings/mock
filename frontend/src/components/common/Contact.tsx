import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ChevronDown } from 'lucide-react';
import { Disclosure, Transition } from '@headlessui/react';
import { SparklesCore } from '../../sparklet/SparklesCore';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      question: 'Is the AI interview platform really free?',
      answer:
        'Yes! Our platform is 100% free with no subscription fees, hidden charges, or premium tiers. We believe quality interview preparation shouldn’t be limited by financial constraints.',
    },
    {
      question: 'How does the AI-powered interview feedback work?',
      answer:
        'Our advanced AI technology analyzes your responses in real-time, providing instant detailed feedback on communication skills, technical knowledge, confidence, and areas for improvement across multiple industries.',
    },
    {
      question: 'What types of interviews can I practice?',
      answer:
        'We offer mock interviews for various industries including tech, finance, healthcare, marketing, and more. Practice behavioral questions, technical assessments, and industry-specific scenarios.',
    },
    {
      question: 'Can I upload and get feedback on my resume?',
      answer:
        'Absolutely! Upload your resume for AI-powered analysis and receive detailed suggestions for improvements, formatting tips, and content optimization to make your resume stand out.',
    },
    {
      question: 'How do you keep the platform free without ads?',
      answer:
        'We maintain our free service through community support and donations. We are MSME certified and committed to providing an ad-free, distraction-free learning environment for all students worldwide.',
    },
    {
      question: 'What new features are coming soon?',
      answer:
        'We are developing an E-Learning platform with comprehensive courses and an interactive Code Playground for technical interviews with real-time code execution and AI-powered code review.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        'service_rfr8f5h',
        'template_rma753q',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'dTcV9cihnCg6SstGP'
      )
      .then(
        () => {
          alert('Message sent successfully!');
          setFormData({ name: '', email: '', subject: '', message: '' });
        },
        (error) => {
          console.error('FAILED...', error.text);
          alert('Failed to send message. Please try again.');
        }
      );
  };

  return (
    <>
      <div className='min-h-screen'>
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          <div className='absolute inset-0 h-[400px]'>
            <SparklesCore
              id='tsparticlesfullpage'
              background='transparent'
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className='w-full h-full'
              particleColor='#8B5CF6'
            />
          </div>

          <div className='container mx-auto px-4 relative'>
            <div className='max-w-4xl mx-auto text-center pb-16'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='text-2xl md:text-4xl lg:text-4xl font-bold mb-6'
              >
                Let's Start a
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                  {' '}
                  Conversation
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-xl text-gray-400'
              >
                Have questions? We're here to help and provide you with the best
                support possible.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className='container mx-auto max-w-7xl px-4 -mt-8 relative z-10'>
          <div className='grid md:grid-cols-3 gap-6'>
            {[
              {
                icon: <Phone className='text-purple-400' />,
                title: 'Phone',
                info: '+91 9170331589',
                subInfo: 'Mon-Sat 10AM-6PM',
              },
              {
                icon: <Mail className='text-purple-400' />,
                title: 'Email',
                info: 'bs.kalendrasingh@gmail.com',
                subInfo: 'Online support',
              },
              {
                icon: <MapPin className='text-purple-400' />,
                title: 'Address',
                info: 'Gomti Nagar, Lucknow',
                subInfo: 'Uttar Pradesh, India, 226002',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className='glass rounded-xl p-6 hover:bg-purple-500/5 transition-colors duration-300'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center'>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='font-semibold gradient-text'>
                      {item.title}
                    </h3>
                    <p className='text-white'>{item.info}</p>
                    <p className='text-sm text-gray-400'>{item.subInfo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className='container mx-auto max-w-7xl px-4 py-16'>
          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className='glass rounded-xl p-4 hover:bg-purple-500/5 transition-colors duration-300'
            >
              <h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Your Name
                    </label>
                    <input
                      type='text'
                      className='w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Your Email
                    </label>
                    <input
                      type='email'
                      className='w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Subject
                  </label>
                  <input
                    type='text'
                    className='w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500'
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Message
                  </label>
                  <textarea
                    className='w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-32'
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='w-full py-3 btn-primary rounded-lg font-semibold flex items-center justify-center gap-2'
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className='glass rounded-xl p-4 hover:bg-purple-500/5 transition-colors duration-300'
            >
              <h2 className='text-2xl font-bold mb-6'>
                Frequently Asked Questions
              </h2>
              <div className='space-y-4'>
                {faqs.map((faq, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <div className='bg-white/5 rounded-lg overflow-hidden'>
                        <Disclosure.Button className='w-full px-4 py-3 text-left flex justify-between items-center hover:bg-purple-500/10 transition-colors'>
                          <span className='font-medium'>{faq.question}</span>
                          <ChevronDown
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 text-purple-400 transition-transform duration-200`}
                          />
                        </Disclosure.Button>
                        <Transition
                          enter='transition duration-100 ease-out'
                          enterFrom='transform scale-95 opacity-0'
                          enterTo='transform scale-100 opacity-100'
                          leave='transition duration-75 ease-out'
                          leaveFrom='transform scale-100 opacity-100'
                          leaveTo='transform scale-95 opacity-0'
                        >
                          <Disclosure.Panel className='px-4 py-3 text-gray-400 bg-white/5'>
                            {faq.answer}
                          </Disclosure.Panel>
                        </Transition>
                      </div>
                    )}
                  </Disclosure>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
