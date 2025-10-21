"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        router.push("dashboard/wisents");
      } else {
        setError("Invalid credentials. Try admin / 1234");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-xl">
            <span className="text-5xl">🦬</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            WisentMatch
          </h1>
          <p className="text-green-600">Wisent Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3.5 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 shrink-0"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="#"
              className="text-sm text-green-600 hover:text-green-700 block"
            >
              Forgot password?
            </a>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Contact administrator
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-sm">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Username: <span className="font-mono">admin</span></p>
            <p>Password: <span className="font-mono">1234</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}