import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Sparkles, ArrowRight, Phone, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SparklesCore } from '../sparklet/SparklesCore';
import logo from '../assets/logo/growvira-logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      emailOrPhone: formData.emailOrPhone,
      password: formData.password,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <SparklesCore
          id='signupSparkles'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className='w-full h-full'
          particleColor='#FFFFFF'
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md z-10 relative'
      >
        <div className='glass rounded-2xl p-8 shadow-2xl border border-purple-500/20'>
          <div className='text-center mb-8'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className='w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center'
            >
              <img src={logo} alt='Logo' className='w-full h-full' />
            </motion.div>

            <div className='flex items-center justify-center mb-2'>
              <Sparkles className='w-5 h-5 text-purple-400 mr-2 animate-pulse' />
              <h2 className='text-3xl font-bold gradient-text'>Create Account</h2>
              <Sparkles className='w-5 h-5 text-pink-400 ml-2 animate-pulse' />
            </div>
            <p className='text-gray-400 text-sm'>Start your journey with us today</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='bg-red-500/10 border border-red-500/50 rounded-lg p-3'
              >
                <p className='text-red-400 text-sm'>{error}</p>
              </motion.div>
            )}

            <div className='space-y-4'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  name='name'
                  required
                  className='input pl-10 w-full'
                  placeholder='Full Name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  name='emailOrPhone'
                  required
                  className='input pl-10 w-full'
                  placeholder='Email or Phone Number'
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                  <Phone className='h-4 w-4 text-gray-500' />
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start space-x-2'>
                <Info className='h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <p className='text-xs text-blue-300'>
                  For phone: Use Indian number starting with +91, 91, or 10 digits (6-9)
                </p>
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='password'
                  name='password'
                  required
                  className='input pl-10 w-full'
                  placeholder='Password (min 6 characters)'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='password'
                  name='confirmPassword'
                  required
                  className='input pl-10 w-full'
                  placeholder='Confirm Password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loading}
              className='w-full btn-tertiary py-3 px-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className='w-5 h-5 ml-2' />
                </>
              )}
            </motion.button>

            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-white/10'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-transparent text-gray-400'>
                  Already have an account?
                </span>
              </div>
            </div>

            <Link to='/login'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='button'
                className='w-full btn-secondary py-3 px-4 flex items-center justify-center border border-purple-500/30'
              >
                Sign in instead
                <Sparkles className='w-4 h-4 ml-2' />
              </motion.button>
            </Link>

            <p className='text-center text-xs text-gray-500 mt-4'>
              By creating an account, you agree to our{' '}
              <Link to='/terms' className='text-purple-400 hover:text-purple-300'>
                Terms
              </Link>{' '}
              and{' '}
              <Link to='/privacy-policy' className='text-purple-400 hover:text-purple-300'>
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='text-center text-gray-500 text-sm mt-6'
        >
          Join thousands preparing for their dream job
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
