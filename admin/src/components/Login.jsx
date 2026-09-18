import axios from "axios";
import React, { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import Spinner from "./ui/Spinner";

const Login = ({ setToken }) => {
  // Deliberately empty. These fields used to be pre-filled with the live admin
  // credentials, which meant anyone opening the deployed panel was one click
  // from full access.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await axios.post(backendUrl + `/api/user/admin`, {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="animate-fade-up w-full max-w-sm rounded-3xl border border-ink-200 bg-white p-8 shadow-soft">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          Forever
        </p>
        <h1 className="prata-regular mt-2 text-2xl text-ink-950">
          Admin panel
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Sign in to manage products and move orders through to delivery.
        </p>

        {/* autoComplete is off throughout: this panel had the live admin
            credentials hardcoded as defaults, and the browser should not put
            them back either. */}
        <form
          onSubmit={onSubmitHandler}
          autoComplete="off"
          className="mt-7 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-xs font-medium text-ink-600"
            >
              Email address
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="admin-email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full rounded-xl border border-ink-200 py-2.5 pl-10 pr-3 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
                type="email"
                autoComplete="off"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-xs font-medium text-ink-600"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="admin-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full rounded-xl border border-ink-200 py-2.5 pl-10 pr-3 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-70"
          >
            {submitting && <Spinner />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
