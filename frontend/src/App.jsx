import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Verify from "./pages/Verify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ScrollToTop from "./components/ScrollToTop";
import ColdStartNotice from "./components/ColdStartNotice";
import { ToastContainer } from "react-toastify";

/** Wraps each route so navigating cross-fades instead of snapping. */
const Page = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.main>
);

const routes = [
  { path: "/", element: <Home /> },
  { path: "/collection", element: <Collection /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/product/:productId", element: <Product /> },
  { path: "/cart", element: <Cart /> },
  { path: "/login", element: <Login /> },
  { path: "/place-order", element: <PlaceOrder /> },
  { path: "/verify", element: <Verify /> },
  { path: "/orders", element: <Orders /> },
];

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink-50">
      <ToastContainer
        position="bottom-right"
        autoClose={2600}
        hideProgressBar
        newestOnTop
        closeButton={false}
        toastClassName="!rounded-2xl !shadow-lift !text-sm"
      />
      <ScrollToTop />
      <ColdStartNotice />
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SearchBar />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={<Page>{element}</Page>} />
            ))}
          </Routes>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
};

export default App;
