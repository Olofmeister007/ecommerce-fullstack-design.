import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import FooterAlibaba from "../components/Footer";
import { useProducts } from "../hooks/useProducts";
import { useParams, useNavigate } from "react-router-dom"; // ← added useNavigate
import useCartStore from "../store/useCartStore";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const HeartIcon         = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "#93c5fd"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const CheckIcon         = ({ size = 14, className = "" }) => <Icon d="M20 6L9 17l-5-5" size={size} className={className} />;
const ShieldIcon        = ({ size = 14 }) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={size} />;
const GlobeIcon         = ({ size = 14 }) => <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" size={size} />;
const MessageSquareIcon = () => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={14} />;
const ArrowLeftIcon     = () => <Icon d="M19 12H5M12 19l-7-7 7-7" size={20} />;
const ChevronLeftIcon   = () => <Icon d="M15 18l-6-6 6-6" size={16} />;
const ChevronRightIcon  = () => <Icon d="M9 18l6-6-6-6" size={16} />;
const ChevronRightSmall = () => <Icon d="M9 18l6-6-6-6" size={14} />;
const CartIcon          = ({ size = 20 }) => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" size={size} />;
const UserIcon          = ({ size = 20 }) => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" size={size} />;
const MinusIcon         = () => <Icon d="M5 12h14" size={14} />;
const PlusIcon          = () => <Icon d="M12 5v14M5 12h14" size={14} />;

// Stars
const Stars = ({ rating = 9.3, max = 10, size = 14 }) => {
  const filled = Math.round((rating / max) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= filled ? "#f59e0b" : "#e5e7eb"}
          stroke={i <= filled ? "#f59e0b" : "#e5e7eb"} strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-orange-400 font-semibold ml-1" style={{ fontSize: size - 2 }}>{rating}</span>
    </div>
  );
};

// ─── Qty Stepper ──────────────────────────────────────────────────────────────
function QtyStepper({ qty, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={onDecrease}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200">
        <MinusIcon />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-gray-800">{qty}</span>
      <button onClick={onIncrease}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-200">
        <PlusIcon />
      </button>
    </div>
  );
}

// ─── Add to Cart Button ───────────────────────────────────────────────────────
function AddToCartButton({ onClick, added, fullWidth = false }) {
  return (
    <button onClick={onClick}
      className={`
        flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl text-sm transition-all
        ${fullWidth ? "w-full" : "flex-1"}
        ${added ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
      `}>
      {added ? (
        <><CheckIcon size={14} className="text-white" />Added!</>
      ) : (
        <><CartIcon size={15} />Add to cart</>
      )}
    </button>
  );
}

// ─── Cart Popover — appears after adding, links to cart ──────────────────────
// NEW: replaces the simple "Added!" flash with a proper confirmation + navigation
function CartPopover({ product, price, qty, onClose }) {
  const navigate = useNavigate();

  return (
    // Backdrop — clicking outside dismisses
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute top-4 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
        onClick={e => e.stopPropagation()} // don't close when clicking the card itself
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <CheckIcon size={15} className="text-green-600" />
            Added to cart!
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none font-light">
            ×
          </button>
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 mb-0.5">
              {product.name}
            </p>
            <p className="text-xs text-gray-500">
              Qty: {qty} ·{" "}
              <span className="text-orange-500 font-bold">
                ${(price * qty).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Keep shopping
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
            <CartIcon size={13} />
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const relatedProducts = [
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop" },
  { name:"Xiaomi Redmi 8 Original", price:"$32.00-$40.00", img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop" },
];

const youMayLike = [
  { name:"Men Blazers Sets Elegant Formal",   price:"$7.00 - $99.50", img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&h=80&fit=crop" },
  { name:"Men Shirt Sleeve Polo Contrast",    price:"$7.00 - $99.50", img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=80&h=80&fit=crop" },
  { name:"Apple Watch Series Space Gray",     price:"$7.00 - $99.50", img:"https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=80&h=80&fit=crop" },
  { name:"Basketball Crew Socks Long Stuff",  price:"$7.00 - $99.50", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop" },
  { name:"New Summer Men's castrol T-Shirts", price:"$7.00 - $99.50", img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop" },
];

const specRows = [
  { label:"Model",       value:"#8786867" },
  { label:"Style",       value:"Classic style" },
  { label:"Certificate", value:"ISO-898921212" },
  { label:"Size",        value:"34mm x 450mm x 19mm" },
  { label:"Memory",      value:"36GB RAM" },
];

const features = [
  "Some great feature name here",
  "Lorem ipsum dolor sit amet, consectetur",
  "Duis aute irure dolor in reprehenderit",
  "Some great feature name here",
];

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE TOP BAR
// ════════════════════════════════════════════════════════════════════════════════
function MobileTopBar() {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm flex items-center justify-between px-4 py-3.5">
      <button className="text-gray-800 hover:text-blue-600 transition-colors">
        <ArrowLeftIcon />
      </button>
      <div className="flex items-center gap-3 text-gray-700">
        <CartIcon size={20} />
        <UserIcon size={20} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE GALLERY
// ════════════════════════════════════════════════════════════════════════════════
function MobileGallery({ product }) {
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
  ];
  const [selected, setSelected] = useState(0);
  const prev = () => setSelected(p => (p - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setSelected(p => (p + 1) % galleryImages.length);

  return (
    <div className="md:hidden relative bg-gray-100" style={{ height: 280 }}>
      <img src={galleryImages[selected]} alt={product.name} className="w-full h-full object-contain" />
      <button onClick={prev}
        className="absolute left-3 bottom-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:shadow-md transition-shadow">
        <ChevronLeftIcon />
      </button>
      <button onClick={next}
        className="absolute right-3 bottom-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:shadow-md transition-shadow">
        <ChevronRightIcon />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {galleryImages.map((_, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === selected ? "bg-blue-600 w-3" : "bg-gray-300"}`} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE PRODUCT INFO
// ← CHANGED: accepts onAddedToCart prop, calls it instead of local flash
// ════════════════════════════════════════════════════════════════════════════════
function MobileProductInfo({ product, onAddedToCart }) {
  const addToCart = useCartStore(s => s.addToCart);

  const [saved, setSaved]       = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tierSelected, setTier] = useState(0);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false); // keeps the button green briefly

  const tiers = [
    { label:"50-100 pcs",  price: product.price },
    { label:"100-700 pcs", price: +(product.price * 0.85).toFixed(2) },
    { label:"700+ pcs",    price: +(product.price * 0.75).toFixed(2) },
  ];

  const mobileSpecs = [
    { label:"Condition", value:"Brand new" },
    { label:"Material",  value:"Plastic" },
    { label:"Category",  value: product.category ?? "General" },
    { label:"Item num",  value:`#${product.id}` },
  ];

  const descText  = product.desc ?? product.description ?? "No description available.";
  const shortDesc = descText.length > 100 ? descText.slice(0, 100) + " ..." : descText;

  const handleAddToCart = () => {
    const selectedPrice = tiers[tierSelected].price;
    addToCart({
      id:       product.id,
      name:     product.name,
      img:      product.image,
      price:    selectedPrice,
      size:     "medium",
      color:    "default",
      material: "Plastic",
      seller:   "Guanjoi Trading LLC",
      qty,
    });

    // Keep button green for 1.5s
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    // ← Tell the root to show the popover
    onAddedToCart(selectedPrice, qty);
  };

  return (
    <div className="md:hidden bg-white px-4 pt-4 pb-2">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <Stars rating={product.rating ?? 9.3} size={14} />
        <span className="text-gray-300 text-xs">•</span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MessageSquareIcon /><span>32 reviews</span>
        </div>
        <span className="text-gray-300 text-xs">•</span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>{product.orders ?? 154} sold</span>
        </div>
      </div>

      <h1 className="font-bold text-gray-900 text-base leading-snug mb-1">{product.name}</h1>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl font-bold text-orange-500">${tiers[tierSelected].price.toFixed(2)}</span>
        <span className="text-xs text-gray-500">({tiers[tierSelected].label})</span>
        {product.oldPrice && (
          <span className="text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
        )}
      </div>

      <div className="flex gap-0 border border-orange-200 rounded-lg overflow-hidden mb-4">
        {tiers.map((t, i) => (
          <button key={i} onClick={() => setTier(i)}
            className={`flex-1 px-2 py-2 text-center border-r last:border-r-0 border-orange-200 transition-colors ${i === tierSelected ? "bg-orange-50" : "bg-white"}`}>
            <div className={`text-xs font-bold ${i === tierSelected ? "text-orange-500" : "text-gray-700"}`}>
              ${t.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">{t.label}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <QtyStepper
          qty={qty}
          onIncrease={() => setQty(p => p + 1)}
          onDecrease={() => setQty(p => Math.max(1, p - 1))}
        />
        <AddToCartButton onClick={handleAddToCart} added={added} />
        <button onClick={() => setSaved(p => !p)}
          className="w-11 h-11 border border-blue-200 rounded-xl flex items-center justify-center bg-white hover:bg-blue-50 transition-colors shrink-0">
          <HeartIcon filled={saved} size={20} />
        </button>
      </div>

      <button className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors mb-4">
        Send inquiry
      </button>

      <div className="h-px bg-gray-100 mb-3" />

      <div className="space-y-2.5 mb-3">
        {mobileSpecs.map(({ label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="text-sm text-gray-400 w-24 shrink-0">{label}</span>
            <span className="text-sm text-gray-800 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-gray-100 mb-3" />

      <p className="text-sm text-gray-600 leading-relaxed mb-1">
        {expanded ? descText : shortDesc}
      </p>
      {descText.length > 100 && (
        <button onClick={() => setExpanded(p => !p)} className="text-blue-600 text-sm font-semibold hover:underline">
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE SUPPLIER CARD
// ════════════════════════════════════════════════════════════════════════════════
function MobileSupplierCard() {
  return (
    <div className="md:hidden bg-white mt-2 mx-0 border-t border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center font-bold text-teal-600 text-lg shrink-0">
          R
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Supplier</p>
          <p className="text-sm font-semibold text-gray-800">Guanjoi Trading LLC</p>
        </div>
        <ChevronRightSmall />
      </div>
      <div className="flex items-center justify-around px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-600"><span>🇩🇪</span><span>Germany</span></div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-600"><ShieldIcon size={13} /><span>Verified</span></div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-600"><GlobeIcon size={13} /><span>Shipping</span></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE SIMILAR PRODUCTS
// ════════════════════════════════════════════════════════════════════════════════
function MobileSimilarProducts() {
  return (
    <div className="md:hidden bg-white mt-2 px-4 pt-4 pb-5">
      <h2 className="font-bold text-gray-900 text-base mb-4">Similar products</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {relatedProducts.map((p, i) => (
          <div key={i} className="flex-shrink-0 w-32 cursor-pointer group">
            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-32 mb-2">
              <img src={p.img} alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-bold text-gray-900 text-sm mb-0.5">$10.30</p>
            <p className="text-xs text-gray-500 leading-tight line-clamp-2">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════
function Breadcrumb() {
  const crumbs = ["Home", "Clothings", "Men's wear", "Summer clothing"];
  return (
    <div className="hidden md:block bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1 text-xs text-gray-500">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1">
            {i > 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
            <span className={i === crumbs.length - 1 ? "text-gray-800 font-medium" : "hover:text-blue-600 cursor-pointer"}>{c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductGallery({ product }) {
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1625910513870-8a95e33da94e?w=400&h=400&fit=crop",
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: 300 }}>
        <img src={galleryImages[selected]} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex gap-2">
        {galleryImages.map((src, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === selected ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-400"}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PricingTiers({ product, onTierChange }) {
  const [selected, setSelected] = useState(0);
  const base = product?.price ?? 0;
  const tiers = [
    { label:"50-100 pcs",  price: base },
    { label:"100-700 pcs", price: +(base * 0.85).toFixed(2) },
    { label:"700+ pcs",    price: +(base * 0.75).toFixed(2) },
  ];
  const handleSelect = (i) => {
    setSelected(i);
    onTierChange?.(tiers[i].price);
  };
  return (
    <div className="flex gap-0 border border-orange-200 rounded-lg overflow-hidden">
      {tiers.map((t, i) => (
        <button key={i} onClick={() => handleSelect(i)}
          className={`flex-1 px-4 py-2.5 text-center border-r last:border-r-0 border-orange-200 transition-colors ${i === selected ? "bg-orange-50" : "bg-white hover:bg-orange-50"}`}>
          <div className={`text-sm font-bold ${i === selected ? "text-orange-500" : "text-gray-800"}`}>${t.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
        </button>
      ))}
    </div>
  );
}

function ProductInfoTable({ product }) {
  const rows = [
    { label:"Price:",         value: product.oldPrice ? `$${product.oldPrice.toFixed(2)} (was)` : "Negotiable" },
    { label:"Type:",          value: product.category ?? "Classic shoes" },
    { label:"Material:",      value:"Plastic material" },
    { label:"Design:",        value:"Modern nice" },
    { label:"Customization:", value:"Customized logo and design custom packages" },
    { label:"Protection:",    value:"Refund Policy" },
    { label:"Warranty:",      value:"2 years full warranty" },
  ];
  return (
    <div className="mt-4 space-y-2.5">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-start gap-4 border-b border-gray-100 pb-2.5 last:border-0">
          <span className="text-sm text-gray-400 w-28 shrink-0">{label}</span>
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ← CHANGED: accepts onAddedToCart prop, calls it instead of local flash only
function SupplierCard({ product, selectedPrice, onAddedToCart }) {
  const addToCart = useCartStore(s => s.addToCart);

  const [saved, setSaved] = useState(false);
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id:       product.id,
      name:     product.name,
      img:      product.image,
      price:    selectedPrice,
      size:     "medium",
      color:    "default",
      material: "Plastic",
      seller:   "Guanjoi Trading LLC",
      qty,
    });

    // Keep button green briefly
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    // ← Tell the root to show the popover
    onAddedToCart(selectedPrice, qty);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 h-fit">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center font-bold text-teal-600 text-lg">R</div>
        <div>
          <p className="text-xs text-gray-500">Supplier</p>
          <p className="text-sm font-semibold text-gray-800">Guanjoi Trading LLC</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-600"><span>🇩🇪</span><span>Germany, Berlin</span></div>
        <div className="flex items-center gap-2 text-xs text-gray-600"><ShieldIcon /><span>Verified Seller</span></div>
        <div className="flex items-center gap-2 text-xs text-gray-600"><GlobeIcon /><span>Worldwide shipping</span></div>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Quantity</span>
          <QtyStepper
            qty={qty}
            onIncrease={() => setQty(p => p + 1)}
            onDecrease={() => setQty(p => Math.max(1, p - 1))}
          />
        </div>
        <AddToCartButton onClick={handleAddToCart} added={added} fullWidth />
      </div>

      <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
        Send inquiry
      </button>
      <button className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
        Seller's profile
      </button>
      <button onClick={() => setSaved(p => !p)}
        className="flex items-center justify-center gap-2 text-blue-500 text-sm hover:text-blue-700">
        <HeartIcon filled={saved} /><span>Save for later</span>
      </button>
    </div>
  );
}

function DescriptionSection({ product }) {
  const [tab, setTab] = useState("Description");
  const tabs = ["Description", "Reviews", "Shipping", "About seller"];
  const desc = product?.desc ?? product?.description ?? "No description available.";
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tab === "Description" && (
          <>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-5 w-1/2">
              {specRows.map((row, i) => (
                <div key={row.label} className={`flex text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="w-36 px-4 py-2.5 text-gray-500 border-r border-gray-200 shrink-0">{row.label}</div>
                  <div className="px-4 py-2.5 text-gray-700">{row.value}</div>
                </div>
              ))}
            </div>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckIcon size={14} className="text-gray-500 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </>
        )}
        {tab === "Reviews"      && <p className="text-sm text-gray-500">Customer reviews will appear here.</p>}
        {tab === "Shipping"     && <p className="text-sm text-gray-500">Shipping information will appear here.</p>}
        {tab === "About seller" && <p className="text-sm text-gray-500">Seller information will appear here.</p>}
      </div>
    </div>
  );
}

function YouMayLike() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">You may like</h3>
      <div className="space-y-3">
        {youMayLike.map((item, i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors">
            <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-800 leading-tight mb-1">{item.name}</p>
              <p className="text-xs text-gray-500">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProducts() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-bold text-gray-800 text-base mb-4">Related products</h2>
      <div className="grid grid-cols-6 gap-3">
        {relatedProducts.map((p, i) => (
          <div key={i} className="cursor-pointer group">
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-2 bg-gray-50 h-32">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-xs font-medium text-gray-700 leading-tight mb-0.5">{p.name}</p>
            <p className="text-xs text-gray-500">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="rounded-xl overflow-hidden flex items-center justify-between px-8 py-6"
      style={{ background:"linear-gradient(135deg, #1a6eb5 0%, #0d4f8c 60%, #1e3a5f 100%)" }}>
      <div className="text-white">
        <h3 className="text-xl font-bold mb-1">Super discount on more than 100 USD</h3>
        <p className="text-blue-200 text-sm">Have you ever finally just write dummy info</p>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shrink-0">
        Shop now
      </button>
    </div>
  );
}

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
// ← CHANGED: owns popover state, passes onAddedToCart down to both layouts
// ════════════════════════════════════════════════════════════════════════════════
export default function ProductDetail() {
  const { id }   = useParams();
  const products = useProducts();
  const product  = products.find(p => String(p.id) === String(id));

  const [selectedPrice, setSelectedPrice] = useState(null);

  // ── Popover state: null = hidden, { price, qty } = visible ──
  const [popover, setPopover] = useState(null);

  const handleAddedToCart = (price, qty) => {
    setPopover({ price, qty });
    // Auto-dismiss after 4 s
    setTimeout(() => setPopover(null), 4000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Product not found.</p>
      </div>
    );
  }

  const activePrice = selectedPrice ?? product.price;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ── Popover renders over everything, both on mobile + desktop ── */}
      {popover && (
        <CartPopover
          product={product}
          price={popover.price}
          qty={popover.qty}
          onClose={() => setPopover(null)}
        />
      )}

      <MobileTopBar />
      <div className="hidden md:block">
        <Header />
        <Navbar />
        <Breadcrumb />
      </div>

      {/* ════════ MOBILE ════════ */}
      <div className="md:hidden bg-gray-50">
        <MobileGallery product={product} />
        {/* ← pass onAddedToCart */}
        <MobileProductInfo product={product} onAddedToCart={handleAddedToCart} />
        <MobileSupplierCard />
        <MobileSimilarProducts />
      </div>

      {/* ════════ DESKTOP ════════ */}
      <main className="hidden md:block max-w-7xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex gap-6">
            <div className="w-72 shrink-0">
              <ProductGallery product={product} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-2">
                <CheckIcon size={13} className="text-green-600" />In stock
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <Stars rating={product.rating ?? 9.3} />
                <span className="text-gray-300 text-sm">|</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquareIcon /><span>32 reviews</span>
                </div>
                <span className="text-gray-300 text-sm">|</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  <span>{product.orders ?? 154} sold</span>
                </div>
              </div>
              <div className="mb-4">
                <PricingTiers product={product} onTierChange={setSelectedPrice} />
              </div>
              <ProductInfoTable product={product} />
            </div>
            <div className="w-52 shrink-0">
              {/* ← pass onAddedToCart */}
              <SupplierCard
                product={product}
                selectedPrice={activePrice}
                onAddedToCart={handleAddedToCart}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <DescriptionSection product={product} />
          </div>
          <div className="w-52 shrink-0">
            <YouMayLike />
          </div>
        </div>

        <RelatedProducts />
        <PromoBanner />
      </main>

      <Newsletter />
      <FooterAlibaba />
    </div>
  );
}