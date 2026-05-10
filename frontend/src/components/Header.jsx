
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);


const CartIcon = () => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />;
const UserIcon = () => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />;
const MessageIcon = () => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />;
const HeartIcon = () => <Icon d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />;
const SearchIcon = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const MenuIcon = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;





export default function Header({ onMenuOpen }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* <div className="max-w-7xl mx-auto px-4 py-2 flex items-center  gap-4"> */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        <button onClick={onMenuOpen} className="text-gray-600 hover:text-blue-600 transition-colors p-1">
          <MenuIcon />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className="font-bold text-blue-600 text-base">Brand</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <CartIcon size={20} />
          <UserIcon size={20} />
        </div>
      </div>

      {/* ── MOBILE search row ── */}
      <div className="flex md:hidden items-center gap-2 px-4 pb-3">
        <div className="flex flex-1 items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5 gap-2 focus-within:border-blue-400 transition-colors">
          <span onClick={handleSearch} className="text-gray-400 cursor-pointer">
  <SearchIcon />
</span>
          <input
  className="flex-1 bg-transparent text-sm outline-none text-gray-600 placeholder-gray-400"
  placeholder="Search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
  }}
/>
        </div>
      </div>

      <div className="hidden max-w-7xl mx-auto px-4 py-2 md:flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1.5 min-w-fit">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          </div>
          <span className="font-bold text-gray-800 text-lg">Brand</span>
        </div>
        {/* Search */}
        <div className="flex flex-1 max-w-2xl">
          <input
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <select className="border-t border-b border-gray-300 px-2 py-2 text-sm bg-gray-50 outline-none text-gray-600">
            <option>All category</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        {/* Nav icons */}
        {/* <div className="flex items-center gap-5 text-gray-600 text-xs ml-auto"> */}
        <div className="flex items-center gap-5 text-gray-600 text-xs">
          {[
            { icon: <UserIcon />, label: "Profile" },
            { icon: <MessageIcon />, label: "Message" },
            { icon: <HeartIcon />, label: "Orders" },
            { icon: <CartIcon />, label: "My cart" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-0.5 hover:text-blue-600 transition-colors">
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}