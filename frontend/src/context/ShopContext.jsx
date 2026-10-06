import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

// Logged-out favourites live in the browser and move into the account on login
const GUEST_WISHLIST_KEY = "kora:wishlist";

function readGuestWishlist() {
  try {
    const ids = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY));
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeGuestWishlist(ids) {
  try {
    if (ids.length) localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
    else localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // Storage blocked: favourites still work for this visit
  }
}

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  // Drives the skeleton placeholders instead of flashing an empty grid
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Product id currently being added, so its button can show a spinner
  const [addingToCart, setAddingToCart] = useState(null);
  // True while a stored session's cart is still being fetched. Seeded from
  // localStorage so the first render already knows a cart is on its way.
  const [loadingCart, setLoadingCart] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  // Favourite product ids, oldest first. A stored session starts empty and
  // fills from the account; a guest starts from the browser's copy.
  const [wishlist, setWishlist] = useState(() =>
    localStorage.getItem("token") ? [] : readGuestWishlist(),
  );
  const [loadingWishlist, setLoadingWishlist] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  const addToCart = useCallback(
    async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size first");
      return false;
    }

    setAddingToCart(itemId);

    // Optimistic update - the badge reacts instantly, the request catches up
    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        setCartItems(cartItems); // roll back to the pre-click cart
        toast.error(error.response?.data?.message || error.message);
        setAddingToCart(null);
        return false;
      }
    }

      // No success toast - the cart badge already confirms the add.
      setAddingToCart(null);
      return true;
    },
    [cartItems, token, backendUrl],
  );

  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (qty > 0) totalCount += qty;
      }
    }
    return totalCount;
  }, [cartItems]);

  const updateQuantity = useCallback(
    async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      // Drop the entry entirely rather than leaving a zero behind
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        setCartItems(cartItems);
          toast.error(error.response?.data?.message || error.message);
        }
      }
    },
    [cartItems, token, backendUrl],
  );

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      // The product may have been removed from the catalogue since it was added
      if (!itemInfo) continue;
      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (qty > 0) totalAmount += itemInfo.price * qty;
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  const toggleWishlist = useCallback(
    async (itemId) => {
      const saved = wishlist.includes(itemId);
      const next = saved
        ? wishlist.filter((id) => id !== itemId)
        : [...wishlist, itemId];
      setWishlist(next);

      if (!token) {
        writeGuestWishlist(next);
        return;
      }

      try {
        await axios.post(
          backendUrl + (saved ? "/api/wishlist/remove" : "/api/wishlist/add"),
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        // Undo just this item, leaving any other toggles made meanwhile
        setWishlist((current) =>
          saved
            ? current.includes(itemId)
              ? current
              : [...current, itemId]
            : current.filter((id) => id !== itemId),
        );
        toast.error(error.response?.data?.message || error.message);
      }
    },
    [wishlist, token, backendUrl],
  );

  const getProductsList = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getUserCart = async (authToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: authToken } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingCart(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlist([]);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    getProductsList();
  }, []);

  // Tokens now expire. When the server says the session is gone, clear it and
  // send the user to login instead of letting every request fail silently.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken("");
          setCartItems({});
          setWishlist([]);
          navigate("/login");
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Restore the session once on mount. This previously had no dependency
  // array, so it re-ran on every single render of the whole app.
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
      getUserCart(stored);
    } else {
      setLoadingCart(false);
    }
  }, []);

  // Whenever a session starts (restored on load, or a fresh login), merge any
  // favourites saved while logged out into the account and load the result.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await axios.post(
          backendUrl + "/api/wishlist/sync",
          { itemIds: readGuestWishlist().slice(-200) },
          { headers: { token } },
        );
        if (!cancelled && response.data.success) {
          setWishlist(response.data.wishlist);
          writeGuestWishlist([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setLoadingWishlist(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, backendUrl]);

  const value = useMemo(
    () => ({
      products,
      currency,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      setCartItems,
      backendUrl,
      token,
      setToken,
      navigate,
      loadingProducts,
      loadingCart,
      addingToCart,
      logout,
      wishlist,
      toggleWishlist,
      loadingWishlist,
    }),
    [
      products,
      search,
      showSearch,
      cartItems,
      token,
      loadingProducts,
      loadingCart,
      addingToCart,
      getCartCount,
      getCartAmount,
      addToCart,
      updateQuantity,
      logout,
      backendUrl,
      navigate,
      wishlist,
      toggleWishlist,
      loadingWishlist,
    ],
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
