import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Spinner from "../components/ui/Spinner";

/** Text field with a leading icon and inline error message. */
function Field({ icon: Icon, error, children, ...props }) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 transition-colors focus-within:border-ink-900 ${
          error ? "border-accent-500" : "border-ink-200"
        }`}
      >
        <Icon className="shrink-0 text-ink-400" />
        <input
          {...props}
          className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-ink-400"
        />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 pl-1 text-xs text-accent-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Login() {
  const { setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = currentState === "Sign Up";

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";
    // The backend requires 8+ characters on register, so match it here
    else if (isSignUp && password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (isSignUp && !name) newErrors.name = "Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    try {
      const endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
      const payload = isSignUp ? { name, email, password } : { email, password };

      const response = await axios.post(backendUrl + endpoint, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(isSignUp ? "Account created" : "Welcome back");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchState = () => {
    setCurrentState(isSignUp ? "Login" : "Sign Up");
    setErrors({});
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-ink-200 bg-white p-8 shadow-soft sm:p-10"
      >
        <div className="text-center">
          <h1 className="prata-regular text-3xl text-ink-950">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <div className="mx-auto mt-3 h-px w-12 bg-ink-900" />
          <p className="mt-4 text-sm text-ink-500">
            {isSignUp
              ? "Join us and keep track of every order."
              : "Sign in to pick up where you left off."}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="mt-8 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Field
                  icon={FiUser}
                  error={errors.name}
                  type="text"
                  placeholder="Full name"
                  value={name}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            icon={FiMail}
            error={errors.email}
            type="email"
            placeholder="Email address"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Field
            icon={FiLock}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
          >
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="shrink-0 text-ink-400 transition-colors hover:text-ink-900"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </Field>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Spinner className="h-4 w-4" light />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : isSignUp ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={switchState}
            className="font-medium text-ink-900 underline underline-offset-4 transition-colors hover:text-accent-600"
          >
            {isSignUp ? "Sign in" : "Create one"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
