import React from 'react';

const CookiePolicy = () => {
  return (
    <div className='min-h-screen py-5'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold gradient-text mb-4'>
            Cookie Policy
          </h1>
          <p className='text-gray-400'>Last updated: January 2025</p>
        </div>

        <div className='space-y-8'>
          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>What Are Cookies</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                Cookies are small text files that are placed on your computer or
                mobile device when you visit our website. They are widely used
                to make websites work more efficiently and provide information
                to website owners.
              </p>
              <p>
                At InterviewAce AI, we use cookies to enhance your experience,
                analyze usage patterns, and improve our AI-powered interview
                preparation platform while maintaining our commitment to free
                education.
              </p>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>
                Managing Your Cookie Preferences
              </h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>You have several options to control and manage cookies:</p>

              <div className='bg-purple-500/10 border border-purple-500/20 rounded-lg p-4'>
                <h3 className='font-semibold text-purple-400 mb-2'>
                  Browser Settings
                </h3>
                <p>
                  Most web browsers allow you to control cookies through their
                  settings:
                </p>
                <ul className='list-disc list-inside space-y-1 mt-2 ml-4'>
                  <li>Block all cookies or specific types</li>
                  <li>Delete existing cookies</li>
                  <li>Set preferences for future cookies</li>
                  <li>Receive notifications when cookies are set</li>
                </ul>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-4'>
                <h3 className='font-semibold text-blue-400 mb-2'>
                  Platform Settings
                </h3>
                <p>Within InterviewAce AI, you can:</p>
                <ul className='list-disc list-inside space-y-1 mt-2 ml-4'>
                  <li>Adjust privacy preferences in your account settings</li>
                  <li>Opt out of non-essential analytics tracking</li>
                  <li>Clear stored preferences and session data</li>
                </ul>
              </div>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Third-Party Cookies</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                We may use trusted third-party services that set cookies on our
                behalf to help us provide better services:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  <strong>Analytics Services:</strong> To understand user
                  behavior and improve our platform
                </li>
                <li>
                  <strong>Security Services:</strong> To protect against fraud
                  and ensure platform security
                </li>
                <li>
                  <strong>Performance Monitoring:</strong> To ensure optimal
                  platform performance
                </li>
              </ul>
              <p>
                These third parties are contractually bound to use cookies only
                for the purposes we specify and in accordance with our privacy
                standards.
              </p>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Updates to This Policy</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify users of any significant
                changes through our platform or via email.
              </p>
              <p>
                As a registered MSME entity (UDYAM-UP-50-0205170), we are
                committed to transparency and compliance with applicable data
                protection regulations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
