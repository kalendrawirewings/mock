import React from 'react';

const RefundPolicy = () => {
  return (
    <div className='min-h-screen py-5'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold gradient-text mb-4'>
            Refund Policy
          </h1>
          <p className='text-gray-400'>Last updated: January 2025</p>
        </div>

        <div className='space-y-8'>
          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>
                Free Platform Commitment
              </h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                InterviewAce AI is committed to providing 100% free access to
                our core AI-powered interview preparation platform. Our mission
                is to break down financial barriers to quality education.
              </p>
              <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='font-semibold text-green-400'>
                    Always Free Services
                  </span>
                </div>
                <ul className='text-green-300 space-y-1'>
                  <li>• AI-powered mock interviews</li>
                  <li>• Instant feedback and analytics</li>
                  <li>• Skill assessments</li>
                  <li>• Multi-industry preparation</li>
                </ul>
              </div>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Donation Policy</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                We accept voluntary donations to support our mission of keeping
                the platform free. Please note:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>All donations are voluntary and non-refundable</li>
                <li>
                  Donations support infrastructure, development, and maintenance
                  costs
                </li>
                <li>
                  No additional services or features are provided in exchange
                  for donations
                </li>
                <li>
                  Donation receipts can be provided upon request for tax
                  purposes
                </li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <div className='flex items-center gap-3 mb-4'>
              <h2 className='text-2xl font-semibold'>Future Paid Features</h2>
            </div>
            <div className='text-gray-300 space-y-4'>
              <p>
                Should we introduce premium features in the future, the
                following refund policy will apply:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>30-day money-back guarantee for any paid subscriptions</li>
                <li>
                  Refund requests must be submitted within 30 days of purchase
                </li>
                <li>Refunds processed within 5-7 business days</li>
                <li>
                  Core interview preparation features will always remain free
                </li>
              </ul>
            </div>
          </section>

          <section className='card'>
            <h2 className='text-2xl font-semibold mb-4'>Contact for Support</h2>
            <div className='text-gray-300'>
              <p className='mb-4'>
                For any questions about donations or our refund policy:
              </p>
              <div className='space-y-2'>
                <p>Email: bs.kalendrasingh@gmail.com</p>
                <p>UPI Payment ID: 9170331589@ptyes</p>
                <p>MSME Registration: UDYAM-UP-50-0205170</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
