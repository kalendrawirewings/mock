import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SparklesCore } from '../sparklet/SparklesCore';
import logo from '../assets/logo/growvira-logo.png';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ emailOrPhone, password });

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
          id='loginSparkles'
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
              <h2 className='text-3xl font-bold gradient-text'>Welcome Back</h2>
              <Sparkles className='w-5 h-5 text-pink-400 ml-2 animate-pulse' />
            </div>
            <p className='text-gray-400 text-sm'>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
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
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  required
                  className='input pl-10 w-full'
                  placeholder='Email or Phone Number'
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                  <Phone className='h-4 w-4 text-gray-500' />
                </div>
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='password'
                  required
                  className='input pl-10 w-full'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
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
                  New to Growvira?
                </span>
              </div>
            </div>

            <Link to='/signup'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='button'
                className='w-full btn-secondary py-3 px-4 flex items-center justify-center border border-purple-500/30'
              >
                Create an account
                <Sparkles className='w-4 h-4 ml-2' />
              </motion.button>
            </Link>

            <p className='text-center text-xs text-gray-500 mt-4'>
              By signing in, you agree to our{' '}
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
          AI-powered mock interviews for your success
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
