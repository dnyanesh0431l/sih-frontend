import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-700 flex items-center gap-2">
          🏥 MediTrack
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-teal-600 transition">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 transition">How It Works</a>
          <a href="#about" className="text-gray-600 hover:text-teal-600 transition">About</a>
          <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">Login</Link>
          <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
            Get Started
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 flex flex-col gap-3">
          <a href="#features" className="text-gray-600 hover:text-teal-600" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-teal-600" onClick={() => setIsOpen(false)}>How It Works</a>
          <a href="#about" className="text-gray-600 hover:text-teal-600" onClick={() => setIsOpen(false)}>About</a>
          <Link to="/login" className="text-teal-600 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-700" onClick={() => setIsOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;