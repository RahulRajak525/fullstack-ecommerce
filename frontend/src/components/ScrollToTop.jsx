import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router keeps the scroll position across navigations, so moving from
 * the bottom of the collection into a product page used to land you halfway
 * down. Reset it on every path change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
