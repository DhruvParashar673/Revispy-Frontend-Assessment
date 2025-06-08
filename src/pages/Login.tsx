import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginProps {
  onLoginSuccess: () => void;
}

interface User {
  name: string;
  email: string;
  password: string;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const registeredUsers: User[] = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    const user = registeredUsers.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ name: user.name, email: user.email })
      );
      onLoginSuccess();
      navigate("/category");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-300 p-10 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black">Login</h1>
          <p className="mt-4 text-xl font-medium text-black">
            Welcome back to ECOMMERCE
          </p>
          <p className="mt-1 text-sm text-gray-600">
            The next-gen business marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-medium text-gray-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium text-gray-800"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-black underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-500 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-10 text-center text-sm">
          <span className="text-gray-700">Don’t have an account? </span>
          <Link
            to="/signup"
            className="font-semibold text-black hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
