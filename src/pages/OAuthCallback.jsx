import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/api";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    // Get token from query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const errorMsg = params.get("error");

    console.log('🔵 OAuthCallback: Loaded', { 
      token: token ? token.substring(0, 20) + '...' : 'NONE',
      error: errorMsg,
      isPopup: window.opener && !window.opener.closed
    });

    // Handle error case
    if (errorMsg) {
      console.log('🔴 OAuthCallback: Error received', errorMsg);
      if (window.opener && !window.opener.closed) {
        // Popup mode: send error to parent window
        console.log('🔴 OAuthCallback: Sending error to parent window');
        window.opener.postMessage(
          { error: errorMsg, source: 'oauth-callback' },
          "*"
        );
        setTimeout(() => window.close(), 200);
      } else {
        // Main window mode: show error
        setError(errorMsg);
      }
      return;
    }

    // Handle success case with token
    if (token) {
      console.log('🟢 OAuthCallback: Token received');
      
      // Check if this is a popup window (has opener)
      if (window.opener && !window.opener.closed) {
        // Send token to parent window via postMessage
        console.log('🟢 OAuthCallback: Sending token to parent window via postMessage');
        window.opener.postMessage(
          { token, source: 'oauth-callback' },
          "*"
        );
        
        // Close popup after sending message
        setTimeout(() => {
          console.log('🟢 OAuthCallback: Closing popup');
          window.close();
        }, 200);
      } else {
        // Not a popup, store token and redirect (fallback for full-page redirect)
        console.log('🟢 OAuthCallback: Not a popup, storing token and redirecting');
        setAuthToken(token);
        navigate("/", { replace: true });
      }
    } else {
      // No token or error
      console.log('🔴 OAuthCallback: No token and no error - checking for popup');
      if (window.opener && !window.opener.closed) {
        console.log('🔴 OAuthCallback: Closing empty popup');
        window.close();
      } else {
        setError("No authentication token received");
      }
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 to-indigo-50">
        <div className="bg-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Authentication Error
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-black transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-900 to-indigo-50">
      <div className="bg-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Authenticating...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
