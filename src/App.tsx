import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Components/Navigation";
import Footer from "./Components/Footer";
import useScrollToTop from "./hooks/useScrollToTop";
import { Analytics } from "@vercel/analytics/react";

import Home from "./Pages/Home";
import About from "./Pages/Aboutus";
import Services from "./Pages/Services";
import Login from "./Pages/LoginPage";
import ClientDashboard from "./Pages/ClientDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import CorporatePage from "./Pages/Corperate";
import SignupPage from "./Pages/Signup";
import ContactPage from "./Pages/ContactPage";
import Forgotpassword from "./Pages/Forgotpassword";
import UpdatePassword from "./Pages/UpdatePassword";
import WealthManagement from "./Pages/wealthmanagement";
import InsuranceServices from "./Pages/insuranceservices";
import AdminLoginPage from "./Pages/AdminLoginPage";

function App() {
  return (
    <Router>
      {/* Scroll hook must be inside Router */}
      <ScrollToTopWrapper>
        <Toaster />
        <Navbar />
        <main className="min-h-screen pt-20 md:pt-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/wealth-management" element={<WealthManagement />} />
            <Route path="/insurance-services" element={<InsuranceServices />} />
            <Route
              path="*"
              element={
                <h1 className="text-center text-3xl mt-20">
                  404 - Page Not Found
                </h1>
              }
            />
            <Route path="/admin-login" element={<AdminLoginPage />} />
          </Routes>
        </main>
        <Footer />
      </ScrollToTopWrapper>
      <Analytics />
    </Router>
  );
}

// Wrapper component to use the hook correctly
function ScrollToTopWrapper({ children }: { children: React.ReactNode }) {
  useScrollToTop();
  return <>{children}</>;
}

export default App;
