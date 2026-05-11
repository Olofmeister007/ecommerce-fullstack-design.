import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Home      from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart     from "../pages/Cart";
import LoginPage     from "../pages/LoginPage";
import SignupPage    from "../pages/SignupPage";
import AdminPage     from "../pages/AdminPage";
import ProductList from "../pages/ProductList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/" element={<ProductList />} />
        <Route path="/cart"      element={<Cart />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/signup"    element={<SignupPage />} />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}