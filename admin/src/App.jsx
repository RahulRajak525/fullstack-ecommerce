import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Edit from "./pages/Edit";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // The admin token expires after a day. On 401/403 drop it so the login
  // screen comes back, instead of every admin action failing silently.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          setToken("");
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  return (
    <div className="min-h-screen bg-ink-50">
      <ToastContainer position="bottom-right" theme="light" />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex">
            <Sidebar />
            <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
              <div className="mx-auto max-w-5xl">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/edit/:id" element={<Edit token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
