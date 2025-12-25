import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import About from "./components/About";

import Cart from "./components/Cart";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Menu from "./components/Menu";
import NavBar from "./components/Navbar";
import OrderTracking from "./components/OrderTracking";
import Register from "./components/Register";



import AdminLayout from "./admin/AdminLayout";
import AdminMenu from "./admin/AdminMenu";
import AdminMessages from "./admin/AdminMessages";
import AdminOrders from "./admin/AdminOrders";
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/home" />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar cartCount={cartCount} user={user} logout={logout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login setUser={setUser} />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register setUser={setUser} />
                </PublicRoute>
              } 
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <Menu addToCart={addToCart} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart
                    cartItems={cartItems}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-tracking"
              element={
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

           
            <Route path="/admin" element={<AdminLayout />}>
  <Route path="orders" element={<AdminOrders />} />
  <Route path="menu" element={<AdminMenu />} />
  <Route path="messages" element={<AdminMessages />} />
</Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>

    
  );
}

export default App;