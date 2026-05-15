import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import useAuthStore from "../store/useAuthStore";

const EMPTY_FORM = { name: "", price: "", category: "", image: "", description: "" };

export default function AdminPage() {
  const navigate = useNavigate();
  const logout   = useAuthStore(s => s.logout);
  const user     = useAuthStore(s => s.user);

  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);  // null = creating, id = editing
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);

  // ── Load all products ──────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api.getProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const startEdit = (product) => {
    setEditId(product.id);
    setForm({
      name:        product.name,
      price:       product.price,
      category:    product.category ?? "",
      image:       product.image ?? "",
      description: product.description ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: +form.price };
      if (editId) {
        const updated = await api.updateProduct(editId, payload);
        setProducts(p => p.map(x => x.id === editId ? updated : x));
      } else {
        const created = await api.createProduct(payload);
        setProducts(p => [...p, created]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      setProducts(p => p.filter(x => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">Admin Panel</h1>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              ← Back to shop
            </button>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="bg-red-50 text-red-600 border border-red-200 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* ── Form: create or edit ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 text-base mb-5">
            {editId ? "Edit product" : "Add new product"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label:"Product name",  key:"name",        type:"text",   placeholder:"e.g. Blue Backpack" },
              { label:"Price (USD)",   key:"price",       type:"number", placeholder:"e.g. 29.99" },
              { label:"Category",      key:"category",    type:"text",   placeholder:"e.g. Bags" },
              { label:"Image URL",     key:"image",       type:"url",    placeholder:"https://..." },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  required={key !== "image"}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* Description spans full width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                placeholder="Product description…"
              />
            </div>

            {/* Image preview */}
            {form.image && (
              <div className="md:col-span-2">
                <img src={form.image} alt="preview"
                  className="h-32 rounded-xl object-cover border border-gray-200"
                  onError={e => e.target.style.display = "none"}
                />
              </div>
            )}

            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                {saving ? "Saving…" : editId ? "Save changes" : "Add product"}
              </button>
              {editId && (
                <button type="button" onClick={resetForm}
                  className="border border-gray-300 text-gray-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Product table ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-base">
              All products
              <span className="ml-2 text-sm font-normal text-gray-400">({products.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No products yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Image","Name","Category","Price","Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-gray-50"
                          onError={e => e.target.src = "https://placehold.co/48x48?text=?"}
                        />
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                        {product.name}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{product.category ?? "—"}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        ${(+product.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(product)}
                            className="text-blue-600 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(product.id)}
                            className="text-red-500 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}