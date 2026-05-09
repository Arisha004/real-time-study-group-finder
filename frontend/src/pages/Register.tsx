import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("All fields are required"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
      toast.success("Account created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
