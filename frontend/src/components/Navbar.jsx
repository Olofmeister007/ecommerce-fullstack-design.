import { navItems } from "../data";

const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);


const ChevronDown = () => <Icon d="M6 9l6 6 6-6" size={14} />;
const MenuIcon = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;



export default function Navbar() {
  return (
    <nav className="hidden md:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 text-sm text-gray-700">
        <button className="flex items-center gap-2 font-medium hover:text-blue-600">
          <MenuIcon /> All category
        </button>
        <div className="w-px h-5 bg-gray-300" />
        {navItems.map(item => (
          <button key={item} className="hover:text-blue-600 transition-colors flex items-center gap-1">
            {item} {item === "Help" && <ChevronDown />}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-4 text-gray-600 text-xs">
          <button className="flex items-center gap-1">English, USD <ChevronDown /></button>
          <button className="flex items-center gap-1">Ship to 🇩🇪 <ChevronDown /></button>
        </div>
      </div>
    </nav>
  );
}