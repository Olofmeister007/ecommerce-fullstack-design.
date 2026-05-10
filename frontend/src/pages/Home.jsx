import Header from "../components/Header";
import Navbar from "../components/Navbar";
import FooterAlibaba from "../components/Footer";
import { categories, dealItems, homeItems, electronicsItems, recommendedItems, services, suppliers } from "../data";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import productServices from "../services/productServices";
import { useProducts } from "../hooks/useProducts";

// ─── Icons (inline SVG helpers) ───────────────────────────────────────────────

const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const SearchIcon  = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const CartIcon    = ({ size=16 }) => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" size={size}/>;
const UserIcon    = ({ size=16 }) => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" size={size}/>;
const MessageIcon = () => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />;
const HeartIcon   = ({ size=16 }) => <Icon d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" size={size}/>;
const ChevronDown = ({ size=14 }) => <Icon d="M6 9l6 6 6-6" size={size} />;
const MenuIcon    = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;
const XIcon       = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const HomeNavIcon = () => <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />;
const ListNavIcon = () => <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />;
const GlobeIcon   = () => <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />;
const PhoneIcon   = () => <Icon d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.82A16 16 0 0013.18 15.91l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />;
const InfoIcon    = () => <Icon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" />;
const ArrowRight  = () => <Icon d="M5 12h14M12 5l7 7-7 7" size={14}/>;
const ClipboardIcon=()=> <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />;
// ─── DATA ──────────────────────────────────────────────────────────────────────

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────


function MobileCategoryTabs() {
  const tabs = ["All category","Gadgets","Clothes","Accessories","Electronics","Sports"];
  const [active, setActive] = useState(0);
  return (
    <div className="md:hidden bg-white border-b border-gray-100 overflow-x-auto">
      <div className="flex gap-2 px-4 py-2.5 w-max">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${i === active ? "bg-blue-600 text-white" : "text-blue-600 border border-blue-200 hover:bg-blue-50"}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
 

function MobileSidebar({ open, onClose }) {
  const primaryItems = [
    { icon: <HomeNavIcon />,    label: "Home" },
    { icon: <ListNavIcon />,    label: "Categories" },
    { icon: <HeartIcon size={16}/>, label: "Favorites" },
    { icon: <ClipboardIcon />,  label: "My orders" },
  ];
  const secondaryItems = [
    { icon: <GlobeIcon />, label: "English | USD" },
    { icon: <PhoneIcon />, label: "Contact us" },
    { icon: <InfoIcon />,  label: "About" },
  ];
 
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] transition-all duration-300 ${open ? "bg-black/50 pointer-events-auto" : "bg-transparent pointer-events-none"}`}
      />
 
      {/* Drawer panel */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-[100] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
 
        {/* User strip */}
        <div className="bg-gray-100 px-5 pt-10 pb-5 flex items-start justify-between shrink-0">
          <div>
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-3 border-2 border-white shadow">
              <UserIcon size={22} />
            </div>
            <p className="text-sm text-gray-700 font-medium">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Sign in</span>
              <span className="mx-2 text-gray-400 font-normal">|</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Register</span>
            </p>
          </div>
          <button onClick={onClose} className="mt-1 p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
            <XIcon />
          </button>
        </div>
 
        {/* Primary nav */}
        <div className="border-b border-gray-100 py-2 shrink-0">
          {primaryItems.map(({ icon, label }) => (
            <button key={label}
              className="w-full flex items-center gap-4 px-6 py-3.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left">
              <span className="text-gray-400 w-5 flex justify-center">{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
 
        {/* Secondary nav */}
        <div className="border-b border-gray-100 py-2 shrink-0">
          {secondaryItems.map(({ icon, label }) => (
            <button key={label}
              className="w-full flex items-center gap-4 px-6 py-3.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left">
              <span className="text-gray-400 w-5 flex justify-center">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
 
        {/* Footer links */}
        <div className="px-6 pt-5 space-y-4 flex-1">
          {["User agreement", "Partnership", "Privacy policy"].map(link => (
            <button key={link} className="block text-sm text-gray-500 hover:text-blue-600 transition-colors text-left">
              {link}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}


function SectionMain() {
  return (
    <>
    <section className="md:hidden bg-gray-100 px-3 pt-3 pb-1">
        <div className="relative rounded-2xl overflow-hidden" style={{background:"linear-gradient(135deg,#a8edea 0%,#6dc8c8 50%,#4db8b8 100%)",minHeight:165}}>
          <div className="absolute inset-0 flex flex-col justify-center pl-5 pr-36">
            <p className="text-gray-700 text-xs mb-0.5">Latest trending</p>
            <h1 className="text-[22px] font-bold text-gray-900 leading-tight mb-3">Electronic<br/>items</h1>
            <button className="bg-white text-gray-800 px-4 py-1.5 rounded-full text-xs font-semibold w-fit shadow-sm">Learn more</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=220&fit=crop"
            alt="hero" className="absolute right-0 bottom-0 h-full w-36 object-cover"
          />
        </div>
      </section>

     <section className="hidden md:block bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-48 bg-white rounded-md py-2 shrink-0">
          {categories.map((cat, i) => (
            <button key={cat} className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${i === 0 ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-700"}`}>
              {cat}
            </button>
          ))}
        </div>
        {/* Hero Banner */}
        <div className="flex-1 rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #a8edea 0%, #6dc8c8 50%, #4db8b8 100%)", minHeight: 240 }}>
          <div className="absolute inset-0 flex flex-col justify-center pl-10 pr-56">
            <p className="text-gray-800 text-sm mb-1">Latest trending</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">Electronic<br/>items</h1>
            <Link
              to="/products"
              className="bg-white text-gray-800 px-5 py-2 rounded-full text-sm font-medium hover:shadow-md transition-shadow w-fit inline-block"
            >
              Shop now
            </Link>
          </div>
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=260&fit=crop" alt="headphones" className="absolute right-0 bottom-0 h-full w-64 object-cover" />
        </div>
        {/* Right panel */}
        <div className="w-44 flex flex-col gap-2 shrink-0">
          <div className="bg-white rounded-md p-3 text-sm text-center">
            <p className="text-gray-600 mb-2">Hi, user<br/><span className="font-semibold text-gray-800">let's get started</span></p>
            <button className="w-full bg-blue-600 text-white py-1.5 rounded text-xs font-medium mb-1 hover:bg-blue-700">Join now</button>
            <button className="w-full border border-blue-600 text-blue-600 py-1.5 rounded text-xs font-medium hover:bg-blue-50">Log in</button>
          </div>
          <div className="bg-orange-400 text-white rounded-md p-3 text-xs font-medium cursor-pointer hover:bg-orange-500">Get US $10 off with a new supplier</div>
          <div className="bg-teal-500 text-white rounded-md p-3 text-xs font-medium cursor-pointer hover:bg-teal-600">Send quotes with supplier preferences</div>
        </div>
      </div>
    </section>
    </>
   
  );
}

function SectionSale() {
  return (
    <section className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl p-4">
          {/* Mobile top row: text on left, timer on right */}
          <div className="md:hidden flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="font-semibold text-gray-800 text-base leading-tight">Deals and offers</h2>
              <p className="text-gray-500 text-xs">Hygiene equipments</p>
            </div>
            <div className="flex gap-1">
              {[["04","Days"],["13","Hour"],["34","Min"],["56","Sec"]].map(([val, label]) => (
                <div key={label} className="bg-gray-800 text-white rounded px-1.5 py-1 text-center min-w-9">
                  <div className="text-xs font-bold leading-none">{val}</div>
                  <div className="text-[8px] text-gray-300 leading-none mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: show ~2.5 cards and allow horizontal scroll */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
            {dealItems.map(item => (
              <div key={item.name} className="shrink-0 basis-2/5 border border-gray-200 rounded-lg p-2 text-center cursor-pointer snap-start">
                <img src={item.img} alt={item.name} className="w-full h-20 object-cover rounded-md mb-2" />
                <p className="text-[11px] text-gray-700 font-medium leading-tight mb-1">{item.name}</p>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.discount}</span>
              </div>
            ))}
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-start gap-6">
            <div className="w-52 shrink-0">
              <h2 className="font-semibold text-gray-800 text-base mb-1">Deals and offers</h2>
              <p className="text-gray-500 text-xs mb-3">Hygiene equipments</p>
              <Link to="/products" className="text-xs text-blue-600 font-medium hover:underline mb-3 inline-block">
                View all products
              </Link>
              <div className="flex gap-1">
                {[["04","Days"],["13","Hour"],["34","Min"],["56","Sec"]].map(([val, label]) => (
                  <div key={label} className="bg-gray-800 text-white rounded px-2 py-1 text-center">
                    <div className="text-sm font-bold">{val}</div>
                    <div className="text-[9px] text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 flex-1 overflow-x-auto pb-1">
              {dealItems.map(item => (
                <div key={item.name} className="flex-shrink-0 w-46.5 border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <img src={item.img} alt={item.name} className="w-full h-28 object-cover rounded-md mb-2" />
                  <p className="text-xs text-gray-700 font-medium mb-1">{item.name}</p>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{item.discount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlockItemsGroup({ title, img, items, bgColor }) {
  return (
    <section className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
         {/* ── MOBILE ── */}
         <div className="md:hidden">
          <h3 className="font-bold text-gray-800 text-base mb-3">{title}</h3>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {items.slice(0, 6).map((item, i) => (
              <div key={i} className="flex-shrink-0 w-28 cursor-pointer">
                <div className="bg-gray-50 rounded-xl border border-gray-200 h-24 flex items-center justify-center mb-1.5 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                </div>
                <p className="text-xs font-medium text-gray-800 leading-tight">{item.name}</p>
                <p className="text-xs text-gray-400">From {item.price}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline">
            Source now <ArrowRight />
          </button>
        </div>

        <div className={`${bgColor || "bg-white"} hidden md:block rounded-xl overflow-hidden`}>
          <div className="flex">
            {/* Left promo */}
            <div className="w-44 p-5 flex flex-col justify-between shrink-0 relative overflow-hidden" style={{ background: bgColor ? undefined : "#f0faf5" }}>
              <div>
                <h3 className="font-bold text-gray-800 text-base mb-2">{title}</h3>
                <button className="bg-white border border-gray-300 text-gray-700 text-xs px-4 py-1.5 rounded-full hover:bg-gray-50 font-medium">Source now</button>
              </div>
              <img src={img} alt={title} className="w-full h-28 object-cover rounded-lg mt-3 opacity-80" />
            </div>
            {/* Grid */}
            <div className="flex-1 grid grid-cols-4 divide-x divide-y divide-gray-200">
              {items.map(item => (
                <div key={item.name + item.from} className="p-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors flex flex-col gap-1">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <p className="text-xs font-medium text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-500">From<br/><span className="font-semibold text-gray-700">{item.price}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionInquiry() {
  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile: heading + button only */}
        <div
          className="md:hidden rounded-xl px-5 py-6"
          style={{ background: "linear-gradient(135deg, #1a6eb5 0%, #0d4f8c 60%, #1e3a5f 100%)" }}
        >
          <div className="text-white">
            <h2 className="text-lg font-bold mb-4 leading-snug">An easy way to send requests<br />to all suppliers</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors">
              Send inquiry
            </button>
          </div>
        </div>

        {/* Desktop: existing full layout */}
        <div
          className="hidden md:flex rounded-xl px-8 py-8 items-center gap-10"
          style={{ background: "linear-gradient(135deg, #1a6eb5 0%, #0d4f8c 60%, #1e3a5f 100%)" }}
        >
          <div className="text-white flex-1">
            <h2 className="text-2xl font-bold mb-3">An easy way to send<br/>requests to all suppliers</h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
          </div>
          <div className="bg-white rounded-xl p-5 w-80 shrink-0 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Send quote to suppliers</h3>
            <p className="text-sm text-gray-600 mb-2">What item you need?</p>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 outline-none focus:border-blue-500" placeholder="Type more details" />
            <div className="flex items-center gap-2 mb-4">
              <input className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Quantity" />
              <select className="border border-gray-300 rounded px-3 py-2 text-sm bg-white outline-none">
                <option>Pcs</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors">Send inquiry</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionRecommend({ products = [] }) {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-bold text-gray-800 text-xl mb-5">
          Recommended items
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {products.slice(0, 10).map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="bg-gray-50 p-3 flex justify-center">
                <img
                  src={item.image || "https://picsum.photos/200"}
                  alt={item.name}
                  className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3">
                <p className="font-bold text-gray-800 text-sm mb-0.5">
                  ${item.price}
                </p>

                <p className="text-xs text-gray-500 leading-tight">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionService() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-bold text-gray-800 text-xl mb-5">Our extra services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {services.map(s => (
            <div key={s.name} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative">
                <img src={s.img} alt={s.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-sm">{s.icon}</div>
              </div>
              <p className="text-sm font-medium text-gray-700 p-3 leading-tight">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionCountry() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-bold text-gray-800 text-xl mb-5">Suppliers by region</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {suppliers.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-2xl">{s.flag}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{s.country}</p>
                <p className="text-xs text-gray-400">{s.domain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterAlibaba() {
  return (
    <section className="bg-gray-100 py-10 text-center">
      <h2 className="font-bold text-gray-800 text-xl mb-1">Subscribe on our newsletter</h2>
      <p className="text-gray-500 text-sm mb-5">Get daily news on upcoming offers from many suppliers all over the world</p>
      <div className="flex justify-center gap-0">
        <div className="flex items-center border border-gray-300 bg-white rounded-l-md px-3 gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
          <input className="py-2.5 text-sm outline-none w-52 text-gray-700 bg-transparent" placeholder="Email" />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors">Subscribe</button>
      </div>
    </section>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const products = (useProducts());
  console.log("Products in Home:", products); // Debug log to check products data

  const filteredProducts = products?.filter((p) => {
  const query = search.toLowerCase();

  return (
    p.name?.toLowerCase().includes(query) ||
    p.category?.toLowerCase().includes(query)
  );
});

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Layout/header-alibaba */}
      <Header onMenuOpen={() => setSidebarOpen(true)} />
      {/* Layout/navbar-alibaba */}
      <Navbar />
      {/* Section-main */}
      <MobileCategoryTabs />
      <SectionMain />
      {/* Section-sale */}
      <SectionSale />



      {/* Block-items-group: Home and outdoor */}
      <BlockItemsGroup
        title="Home and outdoor"
        img="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=180&h=120&fit=crop"
        items={products.slice(5, 9)}
        bgColor=""
      />
      {/* Block-items-group: Consumer electronics */}
      <BlockItemsGroup
        title="Consumer electronics and gadgets"
        img="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=180&h=120&fit=crop"
        items={products.slice(5, 9)}
        bgColor=""
      />
      {/* Section-inquiry */}
      <SectionInquiry />
      {/* Section-recommend */}
      <SectionRecommend products={products} />
      {/* Section-service */}
      <SectionService />
      {/* Section-country */}
      <SectionCountry />
      {/* Layout/newsletter-alibaba */}
      <NewsletterAlibaba />
      {/* Layout/footer-alibaba */}
      <FooterAlibaba />
    </div>
  );
}
