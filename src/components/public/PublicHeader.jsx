import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#about', label: 'About' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-teal-100">
      {/* Global font import — loaded once, available to every route */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-md bg-teal-700 text-white flex items-center justify-center font-label text-lg leading-none">
            ℞
          </span>
          <span className="font-display font-semibold text-xl text-gray-800 tracking-tight">
            MediTrack
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label text-xs uppercase tracking-wider text-gray-500 hover:text-teal-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="font-label text-xs uppercase tracking-wider text-teal-700 hover:text-teal-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-800 transition-colors"
          >
            Get started
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-teal-100 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label text-xs uppercase tracking-wider text-gray-500 hover:text-teal-700"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="font-label text-xs uppercase tracking-wider text-teal-700"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-teal-700 text-white px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-teal-800"
            onClick={() => setIsOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;