import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import BlogList from './pages/BlogList';
import HowToFindYourCelebrityLookAlike from './pages/blog/HowToFindYourCelebrityLookAlike';
import WhatIsFacialHarmony from './pages/blog/WhatIsFacialHarmony';
import HistoryOfDoppelgangers from './pages/blog/HistoryOfDoppelgangers';
import HowToFindYourTwin from './pages/blog/HowToFindYourTwin';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/how-to-find-your-celebrity-look-alike" element={<HowToFindYourCelebrityLookAlike />} />
          <Route path="/blog/what-is-facial-harmony" element={<WhatIsFacialHarmony />} />
          <Route path="/blog/history-of-doppelgangers" element={<HistoryOfDoppelgangers />} />
          <Route path="/blog/how-to-find-your-twin" element={<HowToFindYourTwin />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

export default App;
