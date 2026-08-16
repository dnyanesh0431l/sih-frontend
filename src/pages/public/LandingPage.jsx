import {
  AlertCircle,
  ArrowRight,
  Bell,
  Building2,
  Eye,
  FileCheck,
  LineChart,
  MapPin,
  Pill,
  QrCode,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const ticks = [
  {
    status: "ok",
    text: "Amoxicillin 500mg restocked — Kranti Chowk, Aurangabad",
  },
  { status: "warn", text: "Price flagged — Insulin Glargine, Nagpur" },
  { status: "ok", text: "New pharmacy verified — Shivajinagar, Pune" },
  { status: "alert", text: "Shortage reported — Azithromycin, Nashik" },
  {
    status: "ok",
    text: "Stock confirmed across 214 pharmacies in the last hour",
  },
  {
    status: "warn",
    text: "Price flagged — Paracetamol 650mg, Chhatrapati Sambhajinagar",
  },
];

const statusDot = {
  ok: "bg-teal-400",
  warn: "bg-amber-400",
  alert: "bg-red-400",
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState("");

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    setSearchError("");
    try {
      const res = await axios.get(
        `/medicines/search?q=${encodeURIComponent(query)}`,
      );
      setSearchResults(res.data.data || []);
      if (res.data.data?.length === 0) {
        setSearchError("No medicines found for that name.");
      }
    } catch (err) {
      console.error("Search failed", err);
      setSearchError("Search failed. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleFindNearby = (medicineName) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/patient/dashboard?search=${encodeURIComponent(medicineName)}`);
    } else {
      navigate(`/login?redirect=search&q=${encodeURIComponent(medicineName)}`);
    }
  };

  return (
    <div className="bg-white">
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FBF9F4]">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0f766e14 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative container mx-auto px-4 pt-8 pb-20 md:pt-12 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-label inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
                Real-time · Verified · Statewide
              </span>

              <h1 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-[1.08] mt-6">
                Find medicines.
                <br />
                Instantly. <span className="text-teal-600">Fairly.</span>
              </h1>

              <p className="mt-5 text-lg text-gray-600 max-w-md leading-relaxed">
                One shared ledger of stock and price for patients, pharmacies,
                and government — so a shortage gets noticed the hour it happens,
                not the week after.
              </p>

              {/* 🔍 Search Bar */}
              <div className="mt-6 max-w-md">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition"
                >
                  <div className="pl-3 text-gray-400">
                    <Pill size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for a medicine (e.g. Paracetamol)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-2.5 px-2 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-teal-700 text-white px-4 py-2.5 text-sm font-medium hover:bg-teal-800 transition-colors flex items-center gap-1.5"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-1.5 font-label tracking-wide">
                  Try: Paracetamol, Amoxicillin, Insulin
                </p>
              </div>

              {/* Search Results */}
              {loadingSearch && (
                <div className="mt-4 text-sm text-gray-500">Searching…</div>
              )}
              {searchError && !loadingSearch && (
                <div className="mt-4 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={16} /> {searchError}
                </div>
              )}
              {!loadingSearch && searchResults.length > 0 && (
                <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((med) => (
                    <div
                      key={med.id}
                      className="px-4 py-3 hover:bg-teal-50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {med.name}
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                          {med.genericName && (
                            <span>Generic: {med.genericName}</span>
                          )}
                          {med.strength && <span>• {med.strength}</span>}
                          {med.manufacturer && (
                            <span>• {med.manufacturer}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleFindNearby(med.name)}
                        className="bg-teal-600 text-white px-3 py-1.5 rounded text-xs hover:bg-teal-700 transition flex items-center gap-1"
                      >
                        <MapPin size={14} /> Find Nearby
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-800 transition-colors flex items-center gap-2"
                >
                  Get started <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-teal-600 hover:text-teal-700 transition-colors"
                >
                  See how it works
                </a>
              </div>

              <p className="font-label text-xs text-gray-400 mt-8 uppercase tracking-wide">
                Built for patients, pharmacy owners, and health department staff
                — on the same data.
              </p>
            </div>

            {/* Right side: image */}
            <div className="relative flex justify-center">
              <img
                src="https://i.pinimg.com/736x/cd/64/32/cd6432f13da18cb51fac2596b6b426be.jpg"
                alt="MediTrack illustration"
                className="rounded-xl shadow-xl border border-gray-100 max-w-sm w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ticker – unchanged */}
      <div className="bg-[#0f2622] py-3 overflow-hidden border-y border-white/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...ticks, ...ticks].map((t, i) => (
            <span
              key={i}
              className="font-label text-xs text-teal-100/80 flex items-center gap-2 mx-6"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status]}`}
              />
              {t.text}
            </span>
          ))}
        </div>
      </div>

      {/* Features – unchanged */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-3xl text-center text-gray-800 mb-3">
            Three sides, one strip of data
          </h2>
          <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto">
            Patients, pharmacies, and government don't use separate tools — they
            read and write to the same record, like panels on one medicine
            strip.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-teal-200 border border-dashed border-teal-200 rounded-2xl overflow-hidden">
            {/* Pillar 1: Patients */}
            <div className="bg-teal-50/60 p-8 hover:bg-teal-50 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-teal-700 shadow-sm">
                  <Users size={20} />
                </div>
                <span className="font-label text-[11px] text-teal-600/70 tracking-widest">
                  PATIENT / 01
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-800">
                For patients
              </h3>
              <ul className="mt-4 space-y-2.5 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <Search size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Search medicines by name or generic
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Find nearby stores with stock &amp; price
                </li>
                <li className="flex items-start gap-2">
                  <Bell size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Report shortages or price anomalies
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck
                    size={15}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />{" "}
                  Compare prices and track complaints
                </li>
              </ul>
            </div>

            {/* Pillar 2: Stores */}
            <div className="bg-teal-50/60 p-8 hover:bg-teal-50 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-teal-700 shadow-sm">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-label text-[11px] text-teal-600/70 tracking-widest">
                  STORE / 02
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-800">
                For medical stores
              </h3>
              <ul className="mt-4 space-y-2.5 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ShoppingBag
                    size={15}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />{" "}
                  Real-time inventory management
                </li>
                <li className="flex items-start gap-2">
                  <Bell size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Low-stock alerts &amp; reorder insights
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck
                    size={15}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />{" "}
                  Audit trail of all price/stock changes
                </li>
                <li className="flex items-start gap-2">
                  <QrCode size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  QR code for easy store discovery
                </li>
              </ul>
            </div>

            {/* Pillar 3: Government */}
            <div className="bg-teal-50/60 p-8 hover:bg-teal-50 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-teal-700 shadow-sm">
                  <Building2 size={20} />
                </div>
                <span className="font-label text-[11px] text-teal-600/70 tracking-widest">
                  GOV / 03
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-800">
                For government
              </h3>
              <ul className="mt-4 space-y-2.5 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <LineChart
                    size={15}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />{" "}
                  Real-time dashboard &amp; shortage heatmaps
                </li>
                <li className="flex items-start gap-2">
                  <Bell size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Price anomaly detection
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck
                    size={15}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />{" "}
                  Complaint resolution with admin notes
                </li>
                <li className="flex items-start gap-2">
                  <Search size={15} className="text-teal-500 mt-0.5 shrink-0" />{" "}
                  Data-driven policy making
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works – unchanged */}
      <section id="how-it-works" className="py-20 bg-[#FBF9F4]">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-3xl text-center text-gray-800 mb-3">
            How it works
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
            A simple feedback loop that keeps medicines moving toward the people
            who need them.
          </p>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-7 left-0 right-0 border-t-2 border-dashed border-teal-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {[
                {
                  n: "1",
                  title: "Stores update",
                  body: "Pharmacy owners update stock, prices, and expiry in real time.",
                },
                {
                  n: "2",
                  title: "Patients search",
                  body: "Find medicines, compare prices, and locate nearby stores instantly.",
                },
                {
                  n: "3",
                  title: "Issues get reported",
                  body: "Patients flag shortages or price anomalies with GPS location.",
                },
                {
                  n: "4",
                  title: "Government acts",
                  body: "Admins monitor dashboards, resolve complaints, and take action.",
                },
              ].map((step) => (
                <div key={step.n} className="relative text-center">
                  <div className="relative z-10 w-14 h-14 bg-white border-2 border-teal-600 text-teal-700 rounded-full flex items-center justify-center font-label font-semibold text-lg mx-auto mb-4">
                    {step.n}
                  </div>
                  <h4 className="font-display font-semibold text-gray-800">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About / Impact – unchanged */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-3xl text-center text-gray-800 mb-14">
            Why MediTrack?
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 lg:divide-x sm:divide-x divide-gray-200 border-t border-b border-gray-200">
            {[
              {
                icon: Radio,
                title: "Real-time data",
                body: "Instant updates for accurate availability.",
              },
              {
                icon: MapPin,
                title: "Geolocation search",
                body: "Find the nearest stores with stock.",
              },
              {
                icon: Eye,
                title: "Price transparency",
                body: "Compare prices and avoid overcharging.",
              },
              {
                icon: ShieldCheck,
                title: "Audit trail",
                body: "Complete history for trust and fraud detection.",
              },
              {
                icon: QrCode,
                title: "QR integration",
                body: "Easy store discovery via scan.",
              },
              {
                icon: LineChart,
                title: "Government monitoring",
                body: "Real-time insights for proactive intervention.",
              },
            ].map((item) => (
              <div key={item.title} className="p-8 text-center">
                <item.icon size={22} className="text-teal-600 mx-auto mb-3" />
                <h4 className="font-display font-semibold text-gray-800">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1.5">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action – unchanged */}
      <section className="relative bg-teal-700 py-20 overflow-hidden">
        <div className="hidden md:flex absolute top-8 right-10 w-24 h-24 rounded-full border-2 border-dashed border-teal-300/60 items-center justify-center -rotate-6">
          <span className="font-label text-[10px] uppercase tracking-widest text-teal-100 text-center leading-tight">
            Verified
            <br />
            access
          </span>
        </div>
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="font-display font-semibold text-3xl md:text-4xl">
            Ready to be part of the solution?
          </h2>
          <p className="mt-3 text-teal-100 max-w-lg mx-auto">
            Join as a patient, pharmacy owner, or government authority and help
            build a transparent healthcare ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-teal-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="border border-white/70 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
