import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import UserDashboard from './pages/userdashboard';
import CertificateForm from './pages/certificateform';
import ViewCertificate from './pages/viewcertificate';
import VerifyCertificate from './pages/verification';
import ViewPublicCertificate from './pages/viewpubliccertificate';
import PdfStamping from './pages/pdfstamping';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/certificateform" element={<CertificateForm />} />
        <Route path="/certificate/:certificateNumber" element={<ViewCertificate />} />
        <Route path="/verification" element={<VerifyCertificate />} />
        <Route path="/publiccertificate/:certificateNumber" element={<ViewPublicCertificate />} />
        <Route path="/pdfstamping" element={<PdfStamping />} />
      </Routes>
    </Router>
  );
}

export default App;
