
export default function FooterAlibaba() {
  const cols = [
    { title: "About", links: ["About Us","Find store","Categories","Blogs"] },
    { title: "Partnership", links: ["About Us","Find store","Categories","Blogs"] },
    { title: "Information", links: ["Help Center","Money Refund","Shipping","Contact us"] },
    { title: "For users", links: ["Login","Register","Settings","My Orders"] },
  ];
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 md:pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Brand */}
          <div className="w-full md:w-52 shrink-0">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </div>
              <span className="font-bold text-gray-800">Brand</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-sm">Best information about the company goes here but now lorem ipsum is</p>
            <div className="flex gap-2">
              {["f","t","in","in","📷"].map((s, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 hover:bg-blue-100 cursor-pointer">{s}</div>
              ))}
            </div>
          </div>

          {/* Cols */}
          <div className="grid grid-cols-2 md:flex md:flex-1 gap-6 md:gap-0">
            {cols.map(col => (
              <div key={col.title} className="md:flex-1">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Get app */}
          <div className="shrink-0">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Get app</h4>
            <div className="flex sm:flex-col gap-2">
              {["App Store","Google Play"].map(store => (
                <button key={store} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors">
                  {store === "App Store" ? "🍎" : "▶️"} {store}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-gray-500">© 2023 Ecommerce.</p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>🇺🇸</span> English
          </div>
        </div>
      </div>
    </footer>
  );
}
