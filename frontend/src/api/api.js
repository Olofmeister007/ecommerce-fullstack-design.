import useAuthStore from "../store/useAuthStore";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request(path, options = {}) {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

export const api = {
  // Auth
  login:  (body) => request("/auth/login",  { method: "POST", body: JSON.stringify(body) }),
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  // Products
  getProducts: ()       => request("/products"),
  getProduct:  (id)     => request(`/products/${id}`),
  createProduct: (body) => request("/products",     { method: "POST",   body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProduct: (id)   => request(`/products/${id}`, { method: "DELETE" }),
};