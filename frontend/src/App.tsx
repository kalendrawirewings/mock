import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ResumeUpload from './components/resume/ResumeUpload';
import InterviewSession from './components/interview/InterviewSession';
import FeedbackResults from './components/feedback/FeedbackResults';
import InterviewHistory from './components/history/InterviewHistory';
import HelpUs from './components/help/HelpUs';
import Contact from './components/common/Contact';
import Resume from './resume-builder/resume/Resume';
import TermsOfService from './policyPages/TermsOfServices';
import PrivacyPolicy from './policyPages/PrivacyPolicy';
import RefundPolicy from './policyPages/RefundPolicy';
import CookiePolicy from './policyPages/CookiePolicy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='resume' element={<ResumeUpload />} />
          <Route path='resume-builder' element={<Resume />} />
          <Route path='interview' element={<InterviewSession />} />
          <Route path='feedback' element={<FeedbackResults />} />
          <Route path='history' element={<InterviewHistory />} />
          <Route path='history' element={<InterviewHistory />} />
          <Route path='help-us' element={<HelpUs />} />
          <Route path='contact-us' element={<Contact />} />
          <Route path='privacy-policy' element={<PrivacyPolicy />} />
          <Route path='terms' element={<TermsOfService />} />
          <Route path='refund-policy' element={<RefundPolicy />} />
          <Route path='cookie-policy' element={<CookiePolicy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
