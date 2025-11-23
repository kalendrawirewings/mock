import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className='w-full px-4 '>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className='border-t border-white/10 mt-8 pt-8 text-center'
        >
          <p className='text-gray-400'>
            © {new Date().getFullYear()} Growvira. All rights reserved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <ul className='space-y-3 text-gray-400 flex flex-col md:flex-row md:space-y-0 md:space-x-6 justify-center mt-4 mb-4'>
            <li>
              <Link
                to='/privacy-policy'
                className='hover:text-purple-400 transition flex items-center gap-2'
              >
                <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to='/terms'
                className='hover:text-purple-400 transition flex items-center gap-2'
              >
                <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to='/refund-policy'
                className='hover:text-purple-400 transition flex items-center gap-2'
              >
                <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to='/cookie-policy'
                className='hover:text-purple-400 transition flex items-center gap-2'
              >
                <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                Cookie Policy
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
