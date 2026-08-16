const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} MediTrack – Medicine Availability Platform. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <a href="#" className="text-gray-400 hover:text-teal-300">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-teal-300">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-teal-300">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;