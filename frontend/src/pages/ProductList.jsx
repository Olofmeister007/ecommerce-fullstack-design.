import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import FooterAlibaba from "../components/Footer";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useSearchParams, useNavigate } from "react-router-dom";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const HeartIcon    = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "#93c5fd"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const ChevronDown  = ({ size = 14 }) => <Icon d="M6 9l6 6 6-6" size={size} />;
const ChevronUp    = ({ size = 14 }) => <Icon d="M18 15l-6-6-6 6" size={size} />;
const XIcon        = ({ size = 10 }) => <Icon d="M18 6L6 18M6 6l12 12" size={size} />;
const ChevronLeft  = () => <Icon d="M15 18l-6-6 6-6" size={14} />;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" size={14} />;
const ArrowLeft    = () => <Icon d="M19 12H5M12 19l-7-7 7-7" size={20} />;
const CartIcon     = ({ size = 20 }) => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" size={size} />;
const UserIcon     = ({ size = 20 }) => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" size={size} />;
const SearchIcon   = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={16} />;
const FilterIcon   = () => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={14} />;
const SortIcon     = () => <Icon d="M3 6h18M6 12h12M9 18h6" size={14} />;

const GridViewIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const ListViewIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// Stars
const Stars = ({ rating = 7.5, max = 10 }) => {
  const filled = Math.round((rating / max) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= filled ? "#f59e0b" : "#e5e7eb"}
          stroke={i <= filled ? "#f59e0b" : "#e5e7eb"} strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-orange-400 text-xs font-medium ml-1">{rating}</span>
    </div>
  );
};

// ─── Static data ───────────────────────────────────────────────────────────────
const youMayLike = [
  { name:"Solid Backpack blue jeans large size",   price:"$10.30", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
  { name:"T-shirts with multiple colors, for men", price:"$10.30", img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
  { name:"Jeans shorts for men blue color",        price:"$10.30", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { name:"Canon camera black, 100x zoom",          price:"$9.99",  img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop" },
];

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — top bar
// ════════════════════════════════════════════════════════════════════════════════
function MobileTopBar() {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-gray-800 hover:text-blue-600 transition-colors">
          <ArrowLeft />
        </Link>
        <h1 className="font-bold text-gray-900 text-base">Mobile accessory</h1>
        <div className="flex items-center gap-3 text-gray-700">
          <CartIcon size={20} />
          <UserIcon size={20} />
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 bg-gray-100 rounded-xl px-4 py-2.5 focus-within:bg-gray-50 focus-within:ring-1 focus-within:ring-blue-300 transition-all">
          <span className="text-gray-400"><SearchIcon /></span>
          <input
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — subcategory pill tabs
// ════════════════════════════════════════════════════════════════════════════════
function MobileSubcategoryTabs() {
  const tabs = ["Tablets","Phones","Ipads","Ipod","Jackets","Watches","Bags"];
  const [active, setActive] = useState(1);
  return (
    <div className="md:hidden bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
      <div className="flex gap-0 px-3 py-2.5 w-max">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)}
            className={`px-4 py-1 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              i === active
                ? "text-blue-600 border-blue-600"
                : "text-blue-500 border-transparent hover:text-blue-600"
            }`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — Sort + Filter + View toolbar
// ════════════════════════════════════════════════════════════════════════════════
function MobileToolbar({ viewMode, setViewMode, activeFilters, onFilterOpen }) {
  return (
    <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2">
      <button className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
        <SortIcon />
        Sort: Newest
      </button>
      <button
        onClick={onFilterOpen}
        className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
        <FilterIcon />
        Filter ({activeFilters.length})
      </button>
      <div className="ml-auto flex items-center gap-0.5 border border-gray-200 rounded-lg p-1 bg-white">
        <button onClick={() => setViewMode("grid")}
          className={`p-1 rounded transition-colors ${viewMode === "grid" ? "bg-blue-50" : ""}`}>
          <GridViewIcon active={viewMode === "grid"} />
        </button>
        <button onClick={() => setViewMode("list")}
          className={`p-1 rounded transition-colors ${viewMode === "list" ? "bg-blue-50" : ""}`}>
          <ListViewIcon active={viewMode === "list"} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — active filter chips row
// ════════════════════════════════════════════════════════════════════════════════
function MobileFilterChips({ activeFilters, removeFilter }) {
  if (!activeFilters.length) return null;
  return (
    <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {activeFilters.map(f => (
        <div key={f}
          className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 bg-white whitespace-nowrap shrink-0">
          {f}
          <button onClick={() => removeFilter(f)} className="text-gray-400 hover:text-red-500 transition-colors">
            <XIcon size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — filter bottom sheet
// ════════════════════════════════════════════════════════════════════════════════
function MobileFilterSheet({ open, onClose, condition, setCondition }) {
  const [brands, setBrands] = useState({ Samsung: true, Apple: true, Huawei: false, Pocco: true, Lenovo: false });
  return (
    <>
      <div onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-300 ${open ? "bg-black/40 pointer-events-auto" : "bg-transparent pointer-events-none"}`} />
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">Filters</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <XIcon size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">Brands</p>
            <div className="grid grid-cols-2 gap-y-2.5">
              {Object.entries(brands).map(([brand, checked]) => (
                <label key={brand} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={checked}
                    onChange={() => setBrands(p => ({ ...p, [brand]: !p[brand] }))}
                    className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">Condition</p>
            <div className="space-y-2.5">
              {["Any","Refurbished","Brand new","Old items"].map(c => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="mob-cond" checked={condition === c}
                    onChange={() => setCondition(c)}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">Price range</p>
            <div className="flex gap-3">
              <input className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Min" />
              <input className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Max" />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Reset
          </button>
          <button onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// BREADCRUMB (desktop only)
// ════════════════════════════════════════════════════════════════════════════════
function Breadcrumb() {
  const crumbs = ["Home","Clothings","Men's wear","Summer clothing"];
  return (
    <div className="hidden md:block bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1 text-xs text-gray-500">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            )}
            {i === 0 ? (
              <Link to="/" className="hover:text-blue-600 cursor-pointer">{c}</Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "text-gray-800 font-medium" : "hover:text-blue-600 cursor-pointer"}>{c}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR
// ════════════════════════════════════════════════════════════════════════════════
function Sidebar({ viewMode, priceRange, setPriceRange, condition, setCondition }) {
  const [openSections, setOpenSections] = useState({
    category: true, brands: true, features: true,
    price: viewMode === "list", condition: viewMode === "list", ratings: viewMode === "list"
  });
  const [brands, setBrands]     = useState({ Samsung:true, Apple:true, Huawei:false, Pocco:true, Lenovo:false });
  const [features, setFeatures] = useState({ Metallic:true, "Plastic cover":false, "8GB Ram":false, "Super power":false, "Large Memory":false });
  const [ratings, setRatings]   = useState([false,false,false,false]);

  const toggle = s => setOpenSections(p => ({ ...p, [s]: !p[s] }));

  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col gap-1.5">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("category")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Category {openSections.category ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.category && (
          <div className="px-4 pb-3 space-y-1.5">
            {["Mobile accessory","Electronics","Smartphones","Modern tech"].map(cat => (
              <button key={cat} className="block text-sm text-gray-600 hover:text-blue-600 w-full text-left py-0.5">{cat}</button>
            ))}
            <button className="text-blue-600 text-xs font-medium">See all</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("brands")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Brands {openSections.brands ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.brands && (
          <div className="px-4 pb-3 space-y-2">
            {Object.entries(brands).map(([brand, checked]) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={checked} onChange={() => setBrands(p => ({ ...p, [brand]: !p[brand] }))}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <span className="text-sm text-gray-700 group-hover:text-blue-600">{brand}</span>
              </label>
            ))}
            <button className="text-blue-600 text-xs font-medium mt-1">See all</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("features")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Features {openSections.features ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.features && (
          <div className="px-4 pb-3 space-y-2">
            {Object.entries(features).map(([feat, checked]) => (
              <label key={feat} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={checked} onChange={() => setFeatures(p => ({ ...p, [feat]: !p[feat] }))}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <span className="text-sm text-gray-700 group-hover:text-blue-600">{feat}</span>
              </label>
            ))}
            <button className="text-blue-600 text-xs font-medium mt-1">See all</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("price")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Price range {openSections.price ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.price && (
          <div className="px-4 pb-4">
            <div className="w-full h-1.5 bg-gray-200 rounded-full relative mb-3 mt-1">
              <div className="absolute h-1.5 bg-blue-600 rounded-full" style={{ left:`${priceRange[0]/1000*100}%`, right:`${100-priceRange[1]/1000*100}%` }} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <input value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500" placeholder="0" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <input value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500" placeholder="999999" />
              </div>
            </div>
            <button className="w-full mt-3 border border-blue-600 text-blue-600 text-xs py-1.5 rounded hover:bg-blue-50">Apply</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("condition")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Condition {openSections.condition ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.condition && (
          <div className="px-4 pb-3 space-y-2">
            {["Any","Refurbished","Brand new","Old items"].map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="condition" checked={condition === c} onChange={() => setCondition(c)}
                  className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-gray-700">{c}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button onClick={() => toggle("ratings")} className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Ratings {openSections.ratings ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.ratings && (
          <div className="px-4 pb-3 space-y-2">
            {[5,4,3,2].map((r, i) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={ratings[i]}
                  onChange={() => setRatings(p => { const n=[...p]; n[i]=!n[i]; return n; })}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                      fill={s<=r?"#f59e0b":"#e5e7eb"} stroke={s<=r?"#f59e0b":"#e5e7eb"} strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  {r < 5 && <span className="text-gray-400 text-xs ml-0.5">& above</span>}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 text-sm">
          Manufacturer <ChevronDown />
        </button>
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD — Desktop grid
// Wrapped in Link so the whole card is clickable
// ════════════════════════════════════════════════════════════════════════════════
function ProductCardGrid({ product }) {
  const [liked, setLiked] = useState(false);
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer relative">
        {/* Heart button stops propagation so it doesn't navigate */}
        <button
          onClick={e => { e.preventDefault(); setLiked(p => !p); }}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md">
          <HeartIcon filled={liked} />
        </button>
        <div className="bg-gray-50 flex items-center justify-center h-44 overflow-hidden">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice?.toFixed(2)}</span>}
          </div>
          <Stars rating={product.rating} />
          <p className="text-xs text-gray-600 mt-1.5 leading-tight line-clamp-2">{product.name}</p>
        </div>
      </div>
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD — Desktop list
// ════════════════════════════════════════════════════════════════════════════════
function ProductCardList({ product }) {
  const [liked, setLiked] = useState(false);
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex gap-4 p-4 cursor-pointer group">
        <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice?.toFixed(2)}</span>}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={product.rating} />
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-xs text-gray-500">{product.orders} orders</span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-xs text-green-600 font-medium">{product.shipping}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.desc}</p>
          <span className="mt-2 inline-block text-blue-600 text-xs font-medium hover:underline">View details</span>
        </div>
        <button
          onClick={e => { e.preventDefault(); setLiked(p => !p); }}
          className="self-start ml-2 w-7 h-7 flex items-center justify-center rounded-full border border-blue-200 bg-white hover:shadow-md shrink-0">
          <HeartIcon filled={liked} />
        </button>
      </div>
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD — Mobile list row
// ════════════════════════════════════════════════════════════════════════════════
function MobileProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white border-b border-gray-200 flex gap-3 p-3 active:bg-gray-50">
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-sm font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">{product.name}</p>
          <p className="text-base font-bold text-gray-900 mb-1">
            ${product.price?.toFixed(2)}
            {product.oldPrice && (
              <span className="ml-2 text-xs text-gray-400 font-normal line-through">${product.oldPrice?.toFixed(2)}</span>
            )}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <Stars rating={product.rating} />
            <span className="text-gray-300 text-[10px]">•</span>
            <span className="text-xs text-gray-500">{product.orders} orders</span>
          </div>
          <p className="text-xs text-green-600 font-semibold">{product.shipping}</p>
        </div>
        <button
          onClick={e => { e.preventDefault(); setLiked(p => !p); }}
          className="self-start mt-0.5 w-7 h-7 flex items-center justify-center rounded-full border border-blue-200 bg-white shrink-0">
          <HeartIcon filled={liked} />
        </button>
      </div>
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE — You may also like
// ════════════════════════════════════════════════════════════════════════════════
function YouMayAlsoLike() {
  return (
    <section className="md:hidden bg-white pt-6 pb-2">
      <h2 className="font-bold text-gray-900 text-base px-4 mb-4">You may also like</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {youMayLike.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-36 cursor-pointer group">
            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-36 mb-2">
              <img src={item.img} alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-bold text-gray-900 text-sm mb-0.5">{item.price}</p>
            <p className="text-xs text-gray-500 leading-tight line-clamp-2">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ACTIVE FILTER TAG (desktop)
// ════════════════════════════════════════════════════════════════════════════════
function FilterTag({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 bg-white hover:border-gray-400">
      {label}
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors"><XIcon /></button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PAGINATION (desktop)
// ════════════════════════════════════════════════════════════════════════════════
function Pagination({ page, setPage }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      <div className="flex items-center gap-1 mr-3">
        <span className="text-xs text-gray-600">Show</span>
        <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
          <option>10</option><option>20</option><option>50</option>
        </select>
      </div>
      <button onClick={() => setPage(p => Math.max(1, p - 1))}
        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"><ChevronLeft /></button>
      {[1,2,3].map(n => (
        <button key={n} onClick={() => setPage(n)}
          className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium border transition-colors ${page===n?"bg-blue-600 text-white border-blue-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
          {n}
        </button>
      ))}
      <button onClick={() => setPage(p => Math.min(3, p + 1))}
        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"><ChevronRight /></button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// NEWSLETTER
// ════════════════════════════════════════════════════════════════════════════════
function Newsletter() {
  return (
    <section className="bg-gray-100 py-8 md:py-10 text-center px-4">
      <h2 className="font-bold text-gray-800 text-lg md:text-xl mb-1">Subscribe on our newsletter</h2>
      <p className="text-gray-500 text-xs md:text-sm mb-5">Get daily news on upcoming offers from many suppliers all over the world</p>
      <div className="flex justify-center">
        <div className="flex items-center border border-gray-300 bg-white rounded-l-md px-3 gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
          </svg>
          <input className="py-2 md:py-2.5 text-sm outline-none w-40 md:w-52 text-gray-700 bg-transparent" placeholder="Email" />
        </div>
        <button className="bg-blue-600 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Subscribe
        </button>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ════════════════════════════════════════════════════════════════════════════════
export default function ProductListing() {
  const [viewMode, setViewMode]           = useState("grid");
  const [verifiedOnly, setVerifiedOnly]   = useState(false);
  const [page, setPage]                   = useState(1);
  const [priceRange, setPriceRange]       = useState([0, 999999]);
  const [condition, setCondition]         = useState("Any");
  const [activeFilters, setActiveFilters] = useState(["Huawei","Apple","64GB"]);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const products = useProducts();
  const [params] = useSearchParams();
  const navigate  = useNavigate();

  const search = params.get("search") || "";

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const removeFilter = f => setActiveFilters(p => p.filter(x => x !== f));
  const clearAll     = () => setActiveFilters([]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      <MobileFilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        condition={condition}
        setCondition={setCondition}
      />

      <MobileTopBar />

      <div className="hidden md:block">
        <Header />
        <Navbar />
      </div>

      <MobileSubcategoryTabs />
      <Breadcrumb />

      <MobileToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeFilters={activeFilters}
        onFilterOpen={() => setFilterSheetOpen(true)}
      />

      <MobileFilterChips activeFilters={activeFilters} removeFilter={removeFilter} />

      {/* ── MOBILE product list ── */}
      <div className="md:hidden bg-gray-50">
        <div className="bg-white">
          {filtered.map(p => <MobileProductCard key={p.id} product={p} />)}
        </div>

        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-2">
          <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none mr-2">
            <option>Show 10</option><option>Show 20</option>
          </select>
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600"><ChevronLeft /></button>
          {[1,2,3].map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium border ${page===n?"bg-blue-600 text-white border-blue-600":"border-gray-300 text-gray-700"}`}>
              {n}
            </button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600"><ChevronRight /></button>
        </div>
      </div>

      {/* ── DESKTOP: sidebar + product grid/list ── */}
      <main className="hidden md:block max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">

          <Sidebar
            viewMode={viewMode}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            condition={condition}
            setCondition={setCondition}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 mb-3">
              <p className="text-sm text-gray-600 flex-1">
                <span className="font-bold text-gray-800">{filtered.length}</span> items in <strong>Mobile accessory</strong>
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly(p => !p)}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <span className="text-xs text-gray-600">Verified only</span>
              </label>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-blue-500 bg-white">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <button onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode==="grid"?"bg-blue-50":""}`}>
                  <GridViewIcon active={viewMode==="grid"} />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${viewMode==="list"?"bg-blue-50":""}`}>
                  <ListViewIcon active={viewMode==="list"} />
                </button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {activeFilters.map(f => (
                  <FilterTag key={f} label={f} onRemove={() => removeFilter(f)} />
                ))}
                <button onClick={clearAll} className="text-blue-600 text-xs font-medium hover:underline ml-1">
                  Clear all filter
                </button>
              </div>
            )}

            {viewMode === "grid" ? (
              <div className="grid grid-cols-3 gap-3">
                {filtered.map(p => <ProductCardGrid key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(p => <ProductCardList key={p.id} product={p} />)}
              </div>
            )}

            <Pagination page={page} setPage={setPage} />
          </div>
        </div>
      </main>

      <YouMayAlsoLike />
      <Newsletter />
      <FooterAlibaba />
    </div>
  );
}