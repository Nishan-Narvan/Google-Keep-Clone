import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 to-indigo-50">
      <div className="bg-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        
        <h2 className=" text-4xl font-bold font-serif text-center mb-6 text-gray-800">Create Your Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 bg-gray-400 mb-4 border rounded-lg outline-none focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-400 border rounded-lg outline-none "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-gray-400 border rounded-lg outline-none "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-black transition"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-800 underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
