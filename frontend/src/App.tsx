import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route path='/' element={<Layout />}>
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='resume' element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path='resume-builder' element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path='interview' element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
            <Route path='feedback' element={<ProtectedRoute><FeedbackResults /></ProtectedRoute>} />
            <Route path='history' element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
            <Route path='help-us' element={<ProtectedRoute><HelpUs /></ProtectedRoute>} />
            <Route path='contact-us' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path='privacy-policy' element={<PrivacyPolicy />} />
            <Route path='terms' element={<TermsOfService />} />
            <Route path='refund-policy' element={<RefundPolicy />} />
            <Route path='cookie-policy' element={<CookiePolicy />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
