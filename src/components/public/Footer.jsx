const Footer = () => {
  return (
    <footer className="bg-[#122420] text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-md bg-teal-600 text-white flex items-center justify-center font-label text-base leading-none">
              ℞
            </span>
            <div>
              <p className="font-display font-semibold text-lg">MediTrack</p>
              <p className="font-label text-[11px] uppercase tracking-wider text-teal-300/70">
                Medicine availability, verified
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="font-label text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} MediTrack — Medicine Availability
            Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
