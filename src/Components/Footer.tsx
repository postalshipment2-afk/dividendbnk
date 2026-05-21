import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaPhone,
  FaUniversity,
  FaBuilding,
  FaChartLine,
  FaShieldAlt,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Brand
        <div>
          <h3 className="text-xl font-bold mb-4">Doksanlar Bank</h3>
          <p className="text-slate-400">
            Combining traditional values with cutting-edge financial technology.
          </p>
        </div> */}

        <div className="max-w-xs">
          {/* CRYSTAL GRADIENT LOGO: Metallic effect */}
          <h3 className="text-3xl font-black mb-6 tracking-tighter italic bg-linear-to-tr from-white via-blue-400 to-white bg-clip-text text-transparent drop-shadow-sm">
            Dividend-{" "}
            <span className="text-blue-600 not-italic font-light">Bank</span>
            {/* <span className="text-blue-600 not-italic font-light">Bank</span> */}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
            Combining traditional values with cutting-edge financial technology.
            Governed by Swiss-grade security and global excellence.
          </p>

          {/* Social Media Grid with Authentic Brand Colors */}
          <div className="flex items-center gap-4">
            {[
              {
                icon: <FaLinkedinIn />,
                path: "/login",
                label: "LinkedIn",
                brandBg: "bg-[#0077B5] border-[#0077B5]/50",
              },
              {
                icon: <FaTwitter />,
                path: "/signup",
                label: "Twitter",
                brandBg: "bg-[#1DA1F2] border-[#1DA1F2]/50",
              },
              {
                icon: <FaInstagram />,
                path: "/login",
                label: "Instagram",
                brandBg:
                  "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border-transparent",
              },
              {
                icon: <FaFacebookF />,
                path: "/signup",
                label: "Facebook",
                brandBg: "bg-[#1877F2] border-[#1877F2]/50",
              },
            ].map((social, idx) => (
              <Link
                key={idx}
                to={social.path}
                aria-label={social.label}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border text-white shadow-lg shadow-black/40 hover:-translate-y-1.5 hover:brightness-110 transition-all duration-500 ${social.brandBg}`}
              >
                <span className="text-lg drop-shadow-md">{social.icon}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaInfoCircle /> About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaServicestack /> Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaPhone /> Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaUniversity /> Personal Banking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/corporate"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaBuilding /> Corporate Banking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wealth-management"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaChartLine /> Wealth Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/insurance-services"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <FaShieldAlt /> Insurance Services
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4 text-white">Contact Us</h4>
          <address className="not-italic text-slate-400 space-y-3">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Ziya Gökalp, Süleyman Demirel Blv No:7, 34490 Başakşehir <br />
                İstanbul, Türkiye{" "}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 shrink-0" />
              <a
                href="tel:+905349534720"
                className="hover:text-white transition-colors"
              >
                +90 534 953 47 20{" "}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <a
                href="mailto:support@nexussaving.com"
                className="hover:text-white transition-colors"
              >
                info@dividendbks.com
              </a>
            </div>
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-600 mt-12 pt-8 text-center text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} Dividend-Bank. All rights reserved
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
