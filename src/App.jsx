import { Routes, Route } from "react-router-dom";
import AppFeaturesPage from "./pages/appfeature";
import './App.css'
import BlogsPage from "./pages/blogPage";
import BlogAdminPanel from "./pages/blogadmin";

function App() {
  return (
<>

    <Routes>
      <Route path="/" element={<AppFeaturesPage />} />
      <Route path="/blog" element={<BlogsPage />} />
      <Route path="/admin" element={<BlogAdminPanel />} />
    </Routes>
    </>
  );
}

export default App;