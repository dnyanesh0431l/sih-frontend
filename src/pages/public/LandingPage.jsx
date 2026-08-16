import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Building2, 
  Search, 
  MapPin, 
  Bell, 
  FileCheck, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Find Medicines <br />
              <span className="text-teal-600">Instantly. Fairly.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg md:mx-0 mx-auto">
              A real-time platform connecting patients, pharmacies, and government to ensure medicine availability and price transparency.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/register" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
              <a href="#features" className="border border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100">
              <img 
                src="https://placehold.co/400x300/0d9488/ffffff?text=Medicine+Availability" 
                alt="Medicine availability illustration" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features: Three Pillars */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Our Three‑Pillar Ecosystem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Seamless integration for patients, pharmacies, and government to solve medicine shortages and price anomalies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Patients */}
            <div className="bg-teal-50 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">For Patients</h3>
              <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><Search size={16} className="text-teal-500 mt-1" /> Search medicines by name or generic</li>
                <li className="flex items-start gap-2"><MapPin size={16} className="text-teal-500 mt-1" /> Find nearby stores with stock & price</li>
                <li className="flex items-start gap-2"><Bell size={16} className="text-teal-500 mt-1" /> Report shortages or price anomalies</li>
                <li className="flex items-start gap-2"><FileCheck size={16} className="text-teal-500 mt-1" /> Compare prices and track complaints</li>
              </ul>
            </div>

            {/* Pillar 2: Medical Stores */}
            <div className="bg-teal-50 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">For Medical Stores</h3>
              <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><ShoppingBag size={16} className="text-teal-500 mt-1" /> Real‑time inventory management</li>
                <li className="flex items-start gap-2"><Bell size={16} className="text-teal-500 mt-1" /> Low‑stock alerts & reorder insights</li>
                <li className="flex items-start gap-2"><FileCheck size={16} className="text-teal-500 mt-1" /> Audit trail of all price/stock changes</li>
                <li className="flex items-start gap-2"><MapPin size={16} className="text-teal-500 mt-1" /> QR code for easy store discovery</li>
              </ul>
            </div>

            {/* Pillar 3: Government */}
            <div className="bg-teal-50 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">For Government</h3>
              <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><TrendingUp size={16} className="text-teal-500 mt-1" /> Real‑time dashboard & shortage heatmaps</li>
                <li className="flex items-start gap-2"><Bell size={16} className="text-teal-500 mt-1" /> Price anomaly detection</li>
                <li className="flex items-start gap-2"><FileCheck size={16} className="text-teal-500 mt-1" /> Complaint resolution with admin notes</li>
                <li className="flex items-start gap-2"><Search size={16} className="text-teal-500 mt-1" /> Data‑driven policy making</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A simple feedback loop that ensures medicines reach those who need them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h4 className="font-semibold text-gray-800">Stores Update</h4>
              <p className="text-sm text-gray-600 mt-2">Pharmacy owners update stock, prices, and expiry in real‑time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h4 className="font-semibold text-gray-800">Patients Search</h4>
              <p className="text-sm text-gray-600 mt-2">Find medicines, compare prices, and locate nearby stores instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h4 className="font-semibold text-gray-800">Report Issues</h4>
              <p className="text-sm text-gray-600 mt-2">Patients report shortages or price anomalies with GPS location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h4 className="font-semibold text-gray-800">Government Acts</h4>
              <p className="text-sm text-gray-600 mt-2">Admin monitors dashboards, resolves complaints, and takes action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Impact */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Why MediTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <h4 className="font-semibold text-gray-800">Real‑time Data</h4>
              <p className="text-sm text-gray-600 mt-1">Instant updates for accurate availability.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <h4 className="font-semibold text-gray-800">Geolocation Search</h4>
              <p className="text-sm text-gray-600 mt-1">Find the nearest stores with stock.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h4 className="font-semibold text-gray-800">Price Transparency</h4>
              <p className="text-sm text-gray-600 mt-1">Compare prices and avoid overcharging.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-800">Audit Trail</h4>
              <p className="text-sm text-gray-600 mt-1">Complete history for trust and fraud detection.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <h4 className="font-semibold text-gray-800">QR Integration</h4>
              <p className="text-sm text-gray-600 mt-1">Easy store discovery via scan.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏛️</div>
              <h4 className="font-semibold text-gray-800">Government Monitoring</h4>
              <p className="text-sm text-gray-600 mt-1">Real‑time insights for proactive intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-teal-700 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to be part of the solution?</h2>
          <p className="mt-2 text-teal-100 max-w-lg mx-auto">
            Join the platform as a patient, pharmacy owner, or government authority and help build a transparent healthcare ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started Free
            </Link>
            <Link to="/login" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (already separate) */}
    </div>
  );
};

export default LandingPage;