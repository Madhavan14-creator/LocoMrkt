import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import VendorCard from "./components/VendorCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fallback seed data (ready to swap with GET /api/vendors)
const INITIAL_VENDORS = [
  {
    id: 1,
    name: "Iyengar Bakery & Sweets",
    category: "Bakery",
    description: "Authentic Bengaluru butter biscuits, spicy bread roast, and fresh puffs.",
    location: "Malleshwaram, 8th Main",
    rating: 4.9,
    deliveryTime: "15 MINS",
    phone: "+91 98450 12345",
    items: [
      { id: 101, itemName: "Special Milk Bread", price: 45 },
      { id: 102, itemName: "Khara Biscuit (250g)", price: 80 },
      { id: 103, itemName: "Capsicum Veg Puff", price: 25 },
      { id: 104, itemName: "Filter Coffee Powder (200g)", price: 140 },
    ],
    reviews: [
      { id: 1, user: "Karthik R.", rating: 5, comment: "Freshly baked khara biscuits right out of the oven!" },
      { id: 2, user: "Sneha M.", rating: 5, comment: "Best evening puffs in Malleshwaram." },
    ],
  },
  {
    id: 2,
    name: "Sri Manjunatha Organics",
    category: "Groceries",
    description: "Fresh Karnataka farm produce, organic pulses, and Desi A2 milk.",
    location: "Jayanagar, 4th Block",
    rating: 4.8,
    deliveryTime: "20 MINS",
    phone: "+91 98801 23456",
    items: [
      { id: 201, itemName: "Fresh Nanjanagud Bananas (1kg)", price: 60 },
      { id: 202, itemName: "Nandi Farm Cow Milk (1L)", price: 54 },
      { id: 203, itemName: "Organic Toor Dal (1kg)", price: 165 },
      { id: 204, itemName: "Byadgi Red Chillies (250g)", price: 95 },
    ],
    reviews: [
      { id: 1, user: "Ananya S.", rating: 5, comment: "Super fresh farm produce delivered in 15 mins." },
    ],
  },
  {
    id: 3,
    name: "Namma Auto & Bike Clinic",
    category: "Services",
    description: "Quick two-wheeler servicing, puncture repair, and oil change.",
    location: "Indiranagar, 100ft Road",
    rating: 4.7,
    deliveryTime: "SAME DAY",
    phone: "+91 99002 34567",
    items: [
      { id: 301, itemName: "Scooter General Service", price: 499 },
      { id: 302, itemName: "Tubeless Puncture Fix", price: 120 },
      { id: 303, itemName: "Castrol Engine Oil (1L)", price: 380 },
    ],
    reviews: [],
  },
  {
    id: 4,
    name: "Commercial Street Silk & Cotton",
    category: "Fashion",
    description: "Handloom cotton kurtis, traditional sarees, and tailor adjustments.",
    location: "Commercial Street, Shivajinagar",
    rating: 4.6,
    deliveryTime: "30 MINS",
    phone: "+91 97403 45678",
    items: [
      { id: 401, itemName: "Block Print Cotton Kurti", price: 650 },
      { id: 402, itemName: "Pure Linen Dupatta", price: 350 },
      { id: 403, itemName: "Handmade Jute Tote", price: 280 },
    ],
    reviews: [],
  },
  {
    id: 5,
    name: "SP Road Electronics & Mobile Repair",
    category: "Electronics",
    description: "Instant phone screen replacement, cables, power banks, and accessories.",
    location: "SP Road / Koramangala 5th Block",
    rating: 4.8,
    deliveryTime: "25 MINS",
    phone: "+91 98444 56789",
    items: [
      { id: 501, itemName: "65W Type-C Fast Charger", price: 450 },
      { id: 502, itemName: "Tempered Glass Screen Protector", price: 150 },
      { id: 503, itemName: "10000mAh Power Bank", price: 899 },
    ],
    reviews: [],
  },
  {
    id: 6,
    name: "Subbamma Stores & Spices",
    category: "Groceries",
    description: "Traditional South Indian podis, pickles, and homemade papads.",
    location: "Gandhi Bazaar, Basavanagudi",
    rating: 4.9,
    deliveryTime: "20 MINS",
    phone: "+91 98860 67890",
    items: [
      { id: 601, itemName: "Gunpowder / Chutney Pudi (200g)", price: 90 },
      { id: 602, itemName: "Avakaya Mango Pickle (300g)", price: 130 },
      { id: 603, itemName: "Rice Sandige / Vadam (250g)", price: 85 },
    ],
    reviews: [],
  },
];

// 1. Dynamic Store Detail Page (/store/:id) with Item Search, Live Reviews & Sticky Cart Bar
function StoreDetailPage({
  vendors,
  isLoading,
  cart,
  onUpdateQuantity,
  onAddReview,
  onOpenCart,
  totalCartCount,
  totalCartAmount,
}) {
  const { id } = useParams();
  const [itemQuery, setItemQuery] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const store = vendors.find((v) => String(v.id) === String(id));

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 w-40 bg-gray-800 rounded mb-6"></div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-purple-900/40 space-y-4">
          <div className="h-7 w-64 bg-gray-800 rounded"></div>
          <div className="h-4 w-48 bg-gray-800 rounded"></div>
          <div className="h-4 w-full bg-gray-800 rounded"></div>
        </div>
      </main>
    );
  }

  if (!store) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Store Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">
          This vendor link may have moved or is currently offline.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          ← Back to Bengaluru Vendors
        </Link>
      </main>
    );
  }

  const getItemQuantity = (itemId) => {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const filteredItems = store.items.filter((item) =>
    item.itemName.toLowerCase().includes(itemQuery.toLowerCase())
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    onAddReview(store.id, {
      id: Date.now(),
      user: reviewerName.trim(),
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
    });
    setReviewerName("");
    setReviewRating(5);
    setReviewComment("");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition"
        >
          ← BACK TO ALL STORES
        </Link>
        <Link
          to="/orders"
          className="text-xs font-bold text-purple-400 hover:text-purple-300 transition"
        >
          MY ORDERS →
        </Link>
      </div>

      {/* Store Banner Card */}
      <div className="bg-gray-900 border border-purple-900/50 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50 mb-2">
              {store.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {store.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{store.description}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="bg-green-950 text-green-400 border border-green-800/50 text-xs font-black px-3 py-1 rounded-lg">
              ★ {store.rating}
            </span>
            <span className="text-xs font-bold text-red-400">
              {store.deliveryTime}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
          <span>📍 {store.location}</span>
          <span>📞 {store.phone}</span>
        </div>
      </div>

      {/* In-Store Search & Items Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white">Available Items & Services</h2>
          <span className="text-xs font-bold text-purple-400">
            SHOWING {filteredItems.length} OF {store.items.length} ITEMS
          </span>
        </div>

        <input
          type="text"
          value={itemQuery}
          onChange={(e) => setItemQuery(e.target.value)}
          placeholder="Search inside this store..."
          className="bg-gray-900 border border-gray-800 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none w-full sm:w-64"
        />
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const qty = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className="bg-gray-900/90 border border-gray-800 hover:border-purple-800/60 rounded-xl p-4 flex items-center justify-between transition"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{item.itemName}</h3>
                  <p className="text-red-400 font-black text-sm mt-1">₹{item.price}</p>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => onUpdateQuantity(item, 1)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    + ADD
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-950 border border-purple-800/60 rounded-lg px-2 py-1">
                    <button
                      onClick={() => onUpdateQuantity(item, -1)}
                      className="text-red-400 font-black px-2 hover:text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-white min-w-[16px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item, 1)}
                      className="text-green-400 font-black px-2 hover:text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-400">
            No items match "{itemQuery}" in this store.
          </div>
        )}
      </div>

      {/* Live Community Reviews Section */}
      <div className="bg-gray-900/80 border border-purple-900/40 rounded-2xl p-6">
        <h3 className="text-base font-black text-white mb-4">
          Community Reviews ({store.reviews?.length || 0})
        </h3>

        <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your name"
            className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-600"
            required
          />
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-600"
          >
            <option value={5}>★★★★★ (5.0)</option>
            <option value={4}>★★★★☆ (4.0)</option>
            <option value={3}>★★★☆☆ (3.0)</option>
            <option value={2}>★★☆☆☆ (2.0)</option>
            <option value={1}>★☆☆☆☆ (1.0)</option>
          </select>
          <input
            type="text"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience..."
            className="sm:col-span-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-600"
            required
          />
          <button
            type="submit"
            className="sm:col-span-4 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
          >
            POST REVIEW
          </button>
        </form>

        <div className="space-y-3">
          {store.reviews && store.reviews.length > 0 ? (
            store.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-gray-950/90 border border-gray-800 rounded-xl p-3.5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{rev.user}</span>
                  <span className="text-xs font-black text-yellow-400">
                    {"★".repeat(rev.rating)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">
              No reviews yet. Be the first to review {store.name}!
            </p>
          )}
        </div>
      </div>

      {/* Sticky Bottom Cart Bar on Store Page */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-gradient-to-r from-purple-900 to-red-700 border border-purple-500/40 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center justify-between z-40">
          <div>
            <p className="text-xs font-black text-white">
              {totalCartCount} {totalCartCount === 1 ? "ITEM" : "ITEMS"} IN CART
            </p>
            <p className="text-sm font-black text-yellow-300">₹{totalCartAmount}</p>
          </div>
          <button
            onClick={onOpenCart}
            className="bg-black hover:bg-gray-900 text-white text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            VIEW CART & CHECKOUT →
          </button>
        </div>
      )}
    </main>
  );
}

// 2. Dynamic Live Order Tracking Page (/orders)
function OrdersPage({ orders, onAdvanceOrderStatus }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Your Live Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time order receipts and Bengaluru delivery status
          </p>
        </div>
        <Link to="/" className="text-xs font-bold text-red-400 hover:underline">
          ← BACK TO STORES
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-900 border border-purple-900/40 rounded-2xl p-10 text-center">
          <p className="text-gray-400 font-bold mb-3">No orders placed yet.</p>
          <Link
            to="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition"
          >
            EXPLORE STORES
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-gray-900 border border-purple-900/50 rounded-2xl p-5 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3 mb-3">
                <div>
                  <span className="text-sm font-black text-purple-400">{order.orderId}</span>
                  <p className="text-[11px] text-gray-500">Placed at {order.createdAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-green-950 text-green-400 border border-green-800/60">
                    • {order.status}
                  </span>
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => onAdvanceOrderStatus(order.orderId)}
                      className="text-[11px] font-bold bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                      title="Simulate next delivery step"
                    >
                      Simulate Step →
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-300">
                    <span>
                      {item.itemName || item.name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-sm font-black">
                <span className="text-gray-400">Total Paid</span>
                <span className="text-red-400">₹{order.total ?? order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/vendors`)
      .then((res) => (res.ok ? res.json() : INITIAL_VENDORS))
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setVendors(data);
        } else if (active) {
          setVendors(INITIAL_VENDORS);
        }
      })
      .catch(() => {
        if (active) setVendors(INITIAL_VENDORS);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/orders`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active && Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("locomrkt_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("locomrkt_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Could not save cart to localStorage", err);
    }
  }, [cart]);

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? "" : prev));
    }, 2200);
  };

  const handleUpdateQuantity = (item, delta) => {
    if (delta > 0) {
      showToast(`Added ${item.itemName || item.name} to cart`);
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + delta;
        if (newQty <= 0) {
          return updated.filter((i) => i.id !== item.id);
        }
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      if (delta > 0) {
        return [...prevCart, { ...item, quantity: delta }];
      }
      return prevCart;
    });
  };

  const handleAddReview = (storeId, newReview) => {
    setVendors((prevVendors) =>
      prevVendors.map((v) => {
        if (v.id !== storeId) return v;
        const updatedReviews = [newReview, ...(v.reviews || [])];
        const avgRating = ((v.rating + newReview.rating) / 2).toFixed(1);
        return {
          ...v,
          rating: Number(avgRating),
          reviews: updatedReviews,
        };
      })
    );
    showToast("Review posted!");
  };

  const handleClearCart = () => setCart([]);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = (savedOrder) => {
    const fallbackOrder = {
      orderId: `LM-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Preparing Order",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const finalOrder = savedOrder || fallbackOrder;
    setOrders((prev) => [finalOrder, ...prev.filter((o) => o.orderId !== finalOrder.orderId)]);
    setIsCheckoutOpen(false);
    setCart([]);
    showToast(`Order ${finalOrder.orderId} confirmed!`);
    navigate("/orders");
  };

  const handleAdvanceOrderStatus = async (orderId) => {
    const flow = ["Preparing Order", "Out for Delivery", "Delivered"];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId !== orderId) return o;
        const nextIdx = Math.min(flow.indexOf(o.status) + 1, flow.length - 1);
        return { ...o, status: flow[nextIdx] };
      })
    );
    try {
      await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      // Keep optimistic UI state if backend is unreachable
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans relative">
      {/* Live Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 border border-purple-500 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <Routes>
          {/* Main Marketplace Route */}
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Bengaluru Community Vendors
                  </h2>
                  <div className="flex items-center gap-4">
                    <Link
                      to="/orders"
                      className="text-xs font-bold text-purple-400 hover:text-purple-300"
                    >
                      ORDERS ({orders.length})
                    </Link>
                    <span className="text-xs font-bold text-red-500">
                      {isLoading
                        ? "LOADING STORES..."
                        : `${filteredVendors.length} STORES ONLINE`}
                    </span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-52 bg-gray-900 rounded-2xl border border-purple-900/30 p-4 animate-pulse flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="h-4 w-20 bg-gray-800 rounded"></div>
                          <div className="h-5 w-40 bg-gray-800 rounded"></div>
                          <div className="h-3 w-full bg-gray-800 rounded"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-800 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <VendorCard
                          key={vendor.id}
                          vendor={vendor}
                          onSelectVendor={(v) => navigate(`/store/${v.id}`)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-gray-900 rounded-2xl border border-purple-900/40">
                        <p className="text-gray-400 font-bold">
                          No stores found matching your query.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("All");
                          }}
                          className="mt-2 text-red-400 font-bold text-sm hover:underline"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </main>
            }
          />

          {/* Dynamic Store Detail Page */}
          <Route
            path="/store/:id"
            element={
              <StoreDetailPage
                vendors={vendors}
                isLoading={isLoading}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onAddReview={handleAddReview}
                onOpenCart={() => setIsCartOpen(true)}
                totalCartCount={totalCartCount}
                totalCartAmount={totalCartAmount}
              />
            }
          />

          {/* Dynamic Live Order Tracking Page */}
          <Route
            path="/orders"
            element={
              <OrdersPage
                orders={orders}
                onAdvanceOrderStatus={handleAdvanceOrderStatus}
              />
            }
          />
        </Routes>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onCompleteOrder={handleCompleteOrder}
        apiBase={API_BASE}
      />

      <footer className="bg-gray-950 border-t border-purple-950 py-6 text-center text-purple-300 text-xs font-medium">
        © 2026 LocoMrkt • Powered by RMCUBE
      </footer>
    </div>
  );
}
