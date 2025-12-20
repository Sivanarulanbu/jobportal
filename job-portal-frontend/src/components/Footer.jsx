import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-white hover:text-[#0A66C2] transition-colors">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center">
                <Logo className="w-full h-full object-cover transform scale-[3.0]" />
              </div>
              <span>DreamRoute</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find your perfect job match with DreamRoute - where opportunities meet talent.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] rounded-md transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] rounded-md transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] rounded-md transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] rounded-md transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Advanced Search
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Saved Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Job Alerts
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-[#0A66C2] flex-shrink-0" />
                <span>support@dreamroute.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-[#0A66C2] flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-[#0A66C2] flex-shrink-0" />
                <span>123 Tech Street, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2025 DreamRoute. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
