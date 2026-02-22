import React, { useContext, useState } from "react";

import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Name validation (only for Sign Up)
    if (currentState === "Sign Up" && !name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(backendUrl, name, email, currentState, "rkkk");
      // Handle form submission
      // console.log("Form submitted:", { email, password, name });
      try {
        if (currentState === "Sign Up") {
          console.log(backendUrl, name, email, "rkkk0sdjfbn");
          const response = await axios.post(backendUrl + "/api/user/register", {
            name,
            email,
            password,
          });
          console.log(response);
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Account created successfully");
            setCurrentState("Login");
          } else {
            console.log(response.data.message);
            toast.error(response.data.message);
          }
        } else {
          const response = await axios.post(backendUrl + "/api/user/login", {
            email,
            password,
          });
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            navigate("/");
          } else {
            console.log(response.data.message);
            toast.error(response.data.message);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <div className="w-full">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-800"
            }`}
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
      )}

      <div className="w-full">
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className={`w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="w-full">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className={`w-full px-3 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}

export default Login;
