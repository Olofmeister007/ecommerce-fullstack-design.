import { useState } from "react";
import Header from "../components/Header";
import FooterAlibaba from "../components/Footer";
import useCartStore  from "../store/useCartStore";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const CartIcon     = ({ size = 16 }) => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" size={size} />;
const UserIcon     = ({ size = 16 }) => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" size={size} />;
const ChevronDown  = ({ size = 14 }) => <Icon d="M6 9l6 6 6-6" size={size} />;
const ArrowLeft    = ({ size = 14 }) => <Icon d="M19 12H5M12 19l-7-7 7-7" size={size} />;
const CartMoveIcon = () => <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" size={14} />;
const LockIcon     = () => <Icon d="M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" size={28} />;
const SupportIcon  = () => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={28} />;
const TruckIcon    = () => <Icon d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 17h6m4 0h2m-2 0a2 2 0 11-4 0 2 2 0 014 0zm-10 0a2 2 0 11-4 0 2 2 0 014 0zM13 5h5l3 5" size={28} />;
const MinusIcon    = () => <Icon d="M5 12h14" size={16} />;
const PlusIcon     = () => <Icon d="M12 5v14M5 12h14" size={16} />;
const DotsIcon     = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);

// ─── SAVED ITEMS (local UI state — not in global store) ───────────────────────
const initialSavedItems = [
  { id: "s1", name: "Regular Fit Resort Shirt", price: 57.70, img: "https://images.unsplash.com/photo-1599669454699-248893623440?w=200&h=200&fit=crop" },
  { id: "s2", name: "Regular Fit Resort Shirt", price: 57.70, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" },
  { id: "s3", name: "Regular Fit Resort Shirt", price: 57.70, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: "s4", name: "Regular Fit Resort Shirt", price: 57.70, img: "https://images.unsplash.com/photo-1498049860654-af1a5de87d4a?w=200&h=200&fit=crop" },
];

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE TOP BAR
// ════════════════════════════════════════════════════════════════════════════════
function MobileTopBar() {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm flex items-center gap-3 px-4 py-3.5">
      <button className="text-gray-800 hover:text-blue-600 transition-colors mr-1">
        <ArrowLeft size={20} />
      </button>
      <h1 className="font-bold text-gray-900 text-base flex-1">Shopping cart</h1>
      <div className="flex items-center gap-3 text-gray-700">
        <CartIcon size={20} />
        <UserIcon size={20} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE CART ITEM
// ════════════════════════════════════════════════════════════════════════════════
function MobileCartItem({ item, onRemove, onSaveLater, onIncrease, onDecrease }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3 px-4 pt-4 pb-2 relative">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-sm font-semibold text-gray-800 leading-snug mb-0.5">{item.name}</p>
          <p className="text-xs text-gray-400">Size: {item.size}, Color: {item.color}</p>
          <p className="text-xs text-gray-400">Seller: {item.seller}</p>
        </div>
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen(p => !p)} className="text-gray-400 hover:text-gray-600 p-1">
            <DotsIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden w-36">
              <button onClick={() => { onSaveLater(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
                Save for later
              </button>
              <button onClick={() => { onRemove(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border-t border-gray-100">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        {/* ± stepper wired to store increaseQty / decreaseQty */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={onDecrease}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200">
            <MinusIcon />
          </button>
          <span className="w-12 text-center text-sm font-semibold text-gray-800">{item.qty}</span>
          <button
            onClick={onIncrease}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-200">
            <PlusIcon />
          </button>
        </div>
        <span className="text-base font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE ORDER SUMMARY
// ════════════════════════════════════════════════════════════════════════════════
function MobileOrderSummary({ cartItems }) {
  const itemsTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 10;
  const tax = 7;
  const total = itemsTotal + shipping + tax;

  return (
    <div className="bg-white px-4 py-5 border-t border-gray-100">
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)}):</span>
          <span className="font-medium text-gray-800">${itemsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping:</span>
          <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tax:</span>
          <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-900 text-base">Total:</span>
        <span className="font-bold text-gray-900 text-xl">${total.toFixed(2)}</span>
      </div>
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors">
        Checkout ({cartItems.reduce((s, i) => s + i.qty, 0)} items)
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE SAVED FOR LATER
// ════════════════════════════════════════════════════════════════════════════════
function MobileSavedForLater({ items, onMoveToCart, onRemove }) {
  if (!items.length) return null;
  return (
    <div className="bg-gray-50 pt-6">
      <h2 className="font-bold text-gray-900 text-base px-4 mb-3">Saved for later</h2>
      <div className="space-y-3 px-4 pb-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 flex items-center gap-3 p-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1">{item.name}</p>
              <p className="text-sm font-bold text-gray-900 mb-2">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => onMoveToCart(item.id)}
                  className="border border-blue-500 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  Move to cart
                </button>
                <button onClick={() => onRemove(item.id)}
                  className="border border-red-300 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP — CartItem
// ════════════════════════════════════════════════════════════════════════════════
function DesktopCartItem({ item, onRemove, onSaveLater, onSetQty }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{item.name}</p>
        <p className="text-xs text-gray-500 mb-0.5">Size: {item.size}, Color: {item.color}, Material: {item.material}</p>
        <p className="text-xs text-gray-500 mb-2">Seller: {item.seller}</p>
        <div className="flex items-center gap-2">
          <button onClick={onRemove}
            className="text-xs text-red-500 border border-red-200 rounded px-3 py-1 hover:bg-red-50 font-medium">
            Remove
          </button>
          <button onClick={onSaveLater}
            className="text-xs text-blue-600 border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 font-medium">
            Save for later
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        {/* Show line total (price × qty) */}
        <span className="text-base font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          {/* Dropdown calls setQty from the store */}
          <select
            value={item.qty}
            onChange={e => onSetQty(+e.target.value)}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white outline-none cursor-pointer appearance-none pr-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>Qty: {n}</option>
            ))}
          </select>
          <div className="pointer-events-none -ml-5 pr-2"><ChevronDown size={12} /></div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP — OrderSummary
// ════════════════════════════════════════════════════════════════════════════════
function DesktopOrderSummary({ subtotal }) {
  const discount = 60, tax = 14;
  const total = subtotal - discount + tax;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
      <p className="text-sm font-semibold text-gray-800 mb-3">Have a coupon?</p>
      <div className="flex mb-5">
        <input className="flex-1 min-w-0 border border-gray-300 rounded-l-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Add coupon" />
        <button className="bg-white border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 whitespace-nowrap">Apply</button>
      </div>
      <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal:</span><span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-gray-600"><span>Discount:</span><span className="font-semibold text-red-500">- $60.00</span></div>
        <div className="flex justify-between text-sm text-gray-600"><span>Tax:</span><span className="font-semibold text-green-600">+ $14.00</span></div>
      </div>
      <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-4">
        <span className="text-base font-bold text-gray-800">Total:</span>
        <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
      </div>
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-colors">Checkout</button>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-9 h-6 rounded bg-blue-700 flex items-center justify-center"><span className="text-white text-[8px] font-bold">AMEX</span></div>
        <div className="w-9 h-6 rounded bg-white border border-gray-200 flex items-center justify-center gap-0.5">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-90" /><div className="w-3 h-3 rounded-full bg-yellow-400 opacity-90 -ml-1.5" />
        </div>
        <div className="w-9 h-6 rounded bg-white border border-gray-200 flex items-center justify-center"><span className="text-blue-700 text-[9px] font-bold">PP</span></div>
        <div className="w-9 h-6 rounded bg-white border border-gray-200 flex items-center justify-center"><span className="text-blue-800 text-[9px] font-bold italic">VISA</span></div>
        <div className="w-9 h-6 rounded bg-white border border-gray-200 flex items-center justify-center"><span className="text-gray-800 text-[8px] font-bold">⌘Pay</span></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP — TrustBadges
// ════════════════════════════════════════════════════════════════════════════════
function TrustBadges() {
  const badges = [
    { icon: <LockIcon />, title: "Secure payment", sub: "Have you ever finally just" },
    { icon: <SupportIcon />, title: "Customer support", sub: "Have you ever finally just" },
    { icon: <TruckIcon />, title: "Free delivery", sub: "Have you ever finally just" },
  ];
  return (
    <div className="flex items-center gap-8 py-4 px-2">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-gray-400">{b.icon}</div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{b.title}</p>
            <p className="text-xs text-gray-400">{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP — SavedForLater
// ════════════════════════════════════════════════════════════════════════════════
function DesktopSavedForLater({ items, onMoveToCart }) {
  if (!items.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-bold text-gray-800 text-base mb-4">Saved for later</h2>
      <div className="grid grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="cursor-pointer group">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-3 h-44">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-sm font-bold text-gray-800 mb-0.5">${item.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500 leading-tight mb-3">{item.name}</p>
            <button onClick={() => onMoveToCart(item.id)}
              className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:text-blue-800">
              <CartMoveIcon />Move to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP — PromoBanner
// ════════════════════════════════════════════════════════════════════════════════
function PromoBanner() {
  return (
    <div className="rounded-xl overflow-hidden flex items-center justify-between px-8 py-6"
      style={{ background: "linear-gradient(135deg, #1a6eb5 0%, #0d4f8c 60%, #1e3a5f 100%)" }}>
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
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
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
export default function CartPage() {
  // ── Zustand store ────────────────────────────────────────────────────────────
  const cart          = useCartStore(s => s.cart);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const increaseQty   = useCartStore(s => s.increaseQty);
  const decreaseQty   = useCartStore(s => s.decreaseQty);
  const setQty        = useCartStore(s => s.setQty);   // add this to your store
  const clearCart     = useCartStore(s => s.clearCart);
  const addToCart     = useCartStore(s => s.addToCart);

  // ── Saved-for-later stays local (UI concern only) ────────────────────────────
  const [saved, setSaved] = useState(initialSavedItems);
  

  // Move from cart → saved
  const saveForLater = (id) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      setSaved(p => [...p, item]);
      removeFromCart(id);           // ← store action
    }
  };

  // Move from saved → cart
  const moveToCart = (id) => {
    const item = saved.find(i => i.id === id);
    if (item) {
      addToCart({ ...item, size: "medium", color: "blue", material: "Plastic", seller: "Artel Market" }); // ← store action
      setSaved(p => p.filter(i => i.id !== id));
    }
  };

  const removeSaved = (id) => setSaved(p => p.filter(i => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <MobileTopBar />
      <div className="hidden md:block"><Header /></div>

      {/* ════════ MOBILE LAYOUT ════════ */}
      <div className="md:hidden bg-gray-50">
        <div className="bg-white mb-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-gray-400 px-4">
              <CartIcon size={40} />
              <p className="mt-3 text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <MobileCartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onSaveLater={() => saveForLater(item.id)}
                onIncrease={() => increaseQty(item.id)}
                onDecrease={() => decreaseQty(item.id)}
              />
            ))
          )}
        </div>
        <div className="bg-white mb-3">
          <MobileOrderSummary cartItems={cart} />
        </div>
        <MobileSavedForLater items={saved} onMoveToCart={moveToCart} onRemove={removeSaved} />
      </div>

      {/* ════════ DESKTOP LAYOUT ════════ */}
      <main className="hidden md:block max-w-6xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">My cart ({cart.length})</h1>
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 px-5 pt-2 pb-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <CartIcon /><p className="mt-3 text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <DesktopCartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeFromCart(item.id)}
                    onSaveLater={() => saveForLater(item.id)}
                    onSetQty={qty => setQty(item.id, qty)}
                  />
                ))
              )}
              <div className="flex items-center justify-between mt-4 pt-2">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  <ArrowLeft /> Back to shop
                </button>
                <button onClick={clearCart} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                  Remove all
                </button>
              </div>
            </div>
            <TrustBadges />
          </div>
          <div className="w-64 shrink-0">
            <DesktopOrderSummary subtotal={subtotal} />
          </div>
        </div>
        <DesktopSavedForLater items={saved} onMoveToCart={moveToCart} />
        <PromoBanner />
      </main>

      <Newsletter />
      <FooterAlibaba />
    </div>
  );
}