import { useEffect } from 'react';

/**
 * GoogleAuthCallback Component
 * This page handles the OAuth callback from the backend
 * It receives the JWT token and sends it back to the parent window
 */
export default function GoogleAuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('userId');
        const email = urlParams.get('email');

        if (token && window.opener) {
          // Send token back to parent window (the login page)
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
            user: { userId, email }
          }, window.location.origin);

          // Close this popup
          window.close();
        }
      } catch (error) {
        console.error('Callback error:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            message: 'Authentication failed'
          }, window.location.origin);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-700 font-semibold">Completing authentication...</p>
        <p className="text-gray-500 text-sm mt-2">This window will close automatically</p>
      </div>
    </div>
  );
}
