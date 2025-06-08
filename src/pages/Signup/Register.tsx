import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

function Register({ onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      if (
        existingUsers.some(
          (user: { email: string }) => user.email === formData.email
        )
      ) {
        setErrors((prev) => ({ ...prev, email: "Email already registered" }));
        setLoading(false);
        return;
      }

      const newUser = { ...formData };
      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      sessionStorage.setItem("registrationEmail", formData.email);

      const verificationCode = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      sessionStorage.setItem("verificationCode", verificationCode);
      console.log("Verification code:", verificationCode);

      onRegisterSuccess();
      navigate("/verify-email", { replace: true });
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Registration failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md min-h-[450px] flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="text-black font-medium mb-2">Name</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
              required
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <div className="text-black font-medium mb-2">Email</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
              required
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <div className="text-black font-medium mb-2">Password</div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
              required
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-center text-sm mt-4">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg uppercase font-medium tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-black uppercase font-medium tracking-wider hover:underline"
          >
            Have an Account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Register;
