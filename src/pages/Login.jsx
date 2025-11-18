import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 to-indigo-50">
      <div className="bg-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        
        <h1 className="text-2xl font-bold font-serif text-center mb-6 text-gray-800">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg outline-none bg-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg outline-none bg-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-black transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-800 underline">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}
