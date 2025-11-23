import React from 'react';

const TermsOfService = () => {
  return (
    <div className='min-h-screen py-5'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold gradient-text mb-4'>
            Terms of Service
          </h1>
          <p className='text-gray-400'>Last updated: January 2025</p>
        </div>

        <div className='space-y-8'>
          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Acceptance of Terms</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                By accessing and using InterviewAce AI, you accept and agree to
                be bound by the terms and provision of this agreement. Our
                platform is designed to provide free AI-powered interview
                preparation tools to students worldwide.
              </p>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Service Availability</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>Our core services include:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  Free AI-powered mock interviews across multiple industries
                </li>
                <li>Instant feedback and performance analytics</li>
                <li>Skill assessment and improvement recommendations</li>
                <li>Access to comprehensive learning resources</li>
              </ul>
              <p className='mt-4'>
                We strive to maintain 99.9% uptime but reserve the right to
                perform maintenance as needed to improve our services.
              </p>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>User Responsibilities</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>Users agree to:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  Provide accurate and truthful information during registration
                </li>
                <li>
                  Use the platform for legitimate interview preparation purposes
                </li>
                <li>
                  Respect intellectual property rights and platform guidelines
                </li>
                <li>
                  Not attempt to reverse engineer or exploit our AI systems
                </li>
                <li>Report any bugs or security vulnerabilities responsibly</li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>
                Limitation of Liability
              </h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                InterviewAce AI provides services "as is" without warranty of
                any kind. We shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of our platform.
              </p>
              <p>
                As a registered MSME entity (UDYAM-UP-50-0205170), we operate
                under Indian jurisdiction and comply with applicable laws and
                regulations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
