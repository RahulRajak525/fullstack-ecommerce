import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const handleOpenUserMenu = (event) => {
    if (token === " " || token.trim() === "") {
      navigate("/login");
      return;
    }

    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
    handleCloseUserMenu();
  };

  const goTOOrderPageHandler = () => {
    navigate("/order");
  };
  return (
    <>
      <div className="flex items-center justify-between py-5 px-4 md:px-10 font-medium">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="w-36 cursor-pointer" alt="" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 font-medium text-gray-700">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative group  ${isActive ? "text-blue-500" : "text-gray-700"}`
            }
          >
            {({ isActive }) => (
              <>
                HOME
                <span
                  className={`absolute left-0 bottom-0 h-[2px] w-full bg-blue-500 transition-all duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </>
            )}
          </NavLink>

          {/* Collection */}
          <NavLink
            to="/collection"
            className={({ isActive }) =>
              `relative group ${isActive ? "text-black" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                COLLECTION
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </>
            )}
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative group ${isActive ? "text-black" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                ABOUT
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </>
            )}
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative group ${isActive ? "text-black" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                CONTACT
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700 text-xl">
          <FiSearch
            onClick={() => setShowSearch(true)}
            className="cursor-pointer hover:text-black"
          />

          {/* User Menu */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <FiUser className="hover:text-black" />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>My Profile</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/orders");
                handleCloseUserMenu();
              }}
            >
              <Typography>Orders</Typography>
            </MenuItem>
            <MenuItem onClick={() => logoutHandler()}>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Cart */}
          <NavLink to="/cart" className="relative cursor-pointer">
            <FiShoppingBag className="hover:text-black" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1 py-[1px] rounded-full">
              {getCartCount()}
            </span>
          </NavLink>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            {mobileMenuOpen ? (
              <FiX
                className="cursor-pointer text-2xl"
                onClick={() => setMobileMenuOpen(false)}
              />
            ) : (
              <FiMenu
                className="cursor-pointer text-2xl"
                onClick={() => setMobileMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-5 px-6 flex flex-col gap-5 text-gray-700 font-medium">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            HOME
          </NavLink>
          <NavLink to="/collection" onClick={() => setMobileMenuOpen(false)}>
            COLLECTION
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
            CONTACT
          </NavLink>
        </div>
      )}
    </>
  );
}
