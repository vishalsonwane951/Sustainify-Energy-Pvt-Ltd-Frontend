import { Routes, Route } from "react-router-dom";
import AppFeaturesPage from "./pages/appfeature";
import './App.css'
import BlogsPage from "./pages/blogPage";
import BlogAdminPanel from "./pages/blogadmin";
import Home from "./pages/Home";
import Home1 from "./pages/Home1";
import PrivacyPolicyPage from "./pages/Privacypolicy";
import PrivacyPolicy from "./pages/Privacy";

function App() {
  return (
<>

    <Routes>
      <Route path="/app" element={<AppFeaturesPage />} />
      <Route path="/blog" element={<BlogsPage />} />
      <Route path="/admin" element={<BlogAdminPanel />} />
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home1 />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/privacy1" element={<PrivacyPolicy />} />
    </Routes>
    </>
  );
}

export default App;