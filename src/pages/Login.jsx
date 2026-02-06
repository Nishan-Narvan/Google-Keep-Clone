import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Handle OAuth callback from Google
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if we have a token in URL or from popup communication
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('authToken', token);
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirect to home
          navigate('/');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Redirect to home page after successful login
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      // Open Google OAuth in a popup window
      const width = 500;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        'http://localhost:5000/api/auth/google',
        'GoogleAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setError('Please enable popups to use Google login');
        setGoogleLoading(false);
        return;
      }

      // Listen for messages from popup window
      const handleMessage = (event) => {
        console.log('Message received:', event.data);
        
        // Accept messages from popup with token
        if (event.data && event.data.source === 'oauth-callback') {
          console.log('OAuth callback message received');
          
          if (event.data.token) {
            console.log('Token received, storing and redirecting...');
            localStorage.setItem('authToken', event.data.token);
            console.log('Token stored in localStorage');
            
            setGoogleLoading(false);
            if (popup && !popup.closed) {
              popup.close();
            }
            // Remove listener before navigating
            window.removeEventListener('message', handleMessage);
            
            // Use window.location.href for immediate redirect
            console.log('Redirecting to homepage...');
            window.location.href = '/';
          } else if (event.data.error) {
            console.log('Error from callback:', event.data.error);
            setError(event.data.error);
            setGoogleLoading(false);
            if (popup && !popup.closed) {
              popup.close();
            }
            // Remove listener
            window.removeEventListener('message', handleMessage);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Poll for popup close
      let popupCheckInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(popupCheckInterval);
            // Remove listener when popup closes
            window.removeEventListener('message', handleMessage);
            setGoogleLoading(false);
          }
        } catch (e) {
          console.log('Popup check error:', e);
        }
      }, 500);

    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to initiate Google login');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 to-indigo-50">
      <div className="bg-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        
        <h1 className="text-2xl font-bold font-serif text-center mb-6 text-gray-800">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 p-3 rounded-lg hover:bg-gray-100 transition border border-gray-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/20 text-gray-700">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border rounded-lg outline-none bg-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg outline-none bg-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
          />

          <button
            type="submit"
            className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || googleLoading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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
