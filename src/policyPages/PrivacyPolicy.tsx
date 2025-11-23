import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen py-5'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold gradient-text mb-4'>
            Privacy Policy
          </h1>
          <p className='text-gray-400'>Last updated: January 2025</p>
        </div>

        <div className='space-y-8'>
          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Information We Collect</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>We collect information you provide directly to us, such as:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Account registration details (email, name)</li>
                <li>Interview practice sessions and responses</li>
                <li>Performance analytics and feedback data</li>
                <li>Communication preferences and settings</li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>
                How We Use Your Information
              </h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>We use the collected information to:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Provide and improve our AI-powered interview platform</li>
                <li>Generate personalized feedback and recommendations</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Send important updates about our services</li>
                <li>Comply with legal obligations and protect user rights</li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Data Security</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                We implement robust security measures to protect your personal
                information, including:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Limited access controls for authorized personnel only</li>
                <li>Compliance with industry-standard security practices</li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Contact Us</h2>
            </div>
            <div className='text-gray-300'>
              <p className='mb-4'>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className='space-y-2'>
                <p>Email: bs.kalendrasingh@gmail.com</p>
                <p>
                  Address: Gomti Nagar, Lucknow Uttar Pradesh, India, 226002
                </p>
                <p>MSME Registration: UDYAM-UP-50-0205170</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
