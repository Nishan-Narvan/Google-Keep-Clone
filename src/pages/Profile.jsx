import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { MdArrowBack, MdLogout } from 'react-icons/md';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();
  const { mode, bgImage } = useAppContext();

  // Use the same gif background as Archive/Trash
  const bgUrl = useMemo(
    () =>
      bgImage ||
      (mode
        ? 'https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif'
        : 'https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif'),
    [mode, bgImage]
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
        } else {
          setError(response.error || 'Failed to load profile');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen relative">
        <img
          src={bgUrl}
          className="absolute z-0 object-cover w-full h-full"
          alt="Background"
        />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 z-10"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative px-4 py-8">
      <img
        src={bgUrl}
        className="absolute z-0 object-cover w-full h-full top-0 left-0"
        alt="Background"
      />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/70 rounded-lg transition border border-transparent hover:border-slate-200"
            aria-label="Go back"
          >
            <MdArrowBack size={22} className="text-slate-700" />
          </button>
          <h1 className="ml-3 text-2xl font-semibold text-slate-800 tracking-tight">Profile</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {user && (
          <div
            className={`backdrop-blur ${mode ? 'border border-gray-700' : ''} shadow-xl rounded-2xl p-8 flex flex-col gap-8`}
            style={{ background: mode ? 'rgb(31, 41, 57)' : 'rgb(210, 235, 215)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.googleId && !avatarError ? (
                    <img
                      src={`https://lh3.googleusercontent.com/a-/` + user.googleId + `=s200-c`}
                      alt={user.name || 'User avatar'}
                      className="w-20 h-20 rounded-full object-cover border border-slate-200 shadow-sm"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-900 to-emerald-600 flex items-center justify-center text-white text-3xl font-semibold shadow-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-sm uppercase tracking-[0.18em] ${mode ? 'text-slate-300' : 'text-slate-600'}`}>Account</p>
                  <h2 className={`text-xl font-semibold leading-tight ${mode ? 'text-white' : 'text-slate-900'}`}>{user.name || 'Unnamed user'}</h2>
                  <p className={`text-sm mt-1 ${mode ? 'text-slate-100' : 'text-slate-700'}`}>{user.email}</p>
                </div>
              </div>

              <div className={`flex flex-col sm:items-end gap-2 text-sm ${mode ? 'text-slate-100' : 'text-slate-600'}`}> 
                <span className={`text-xs uppercase tracking-[0.18em] ${mode ? 'text-slate-300' : 'text-slate-500'}`}>Member since</span>
                <span className={`text-base font-medium ${mode ? 'text-white' : 'text-slate-800'}`}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 `}>
              <div className={`rounded-2xl border border-slate-100 p-5 ${mode ? 'bg-gray-600' : 'bg-slate-50/60'}`}>
                <p className={`text-xs uppercase tracking-[0.16em] mb-2 ${mode ? 'text-slate-300' : 'text-slate-600'}`}>Email</p>
                <p className={`text-base break-all ${mode ? 'text-white' : 'text-slate-900'}`}>{user.email}</p>
              </div>
              <div className={`rounded-2xl border border-slate-100 p-5 ${mode ? 'bg-gray-600' : 'bg-slate-50/60'}`}>
                <p className={`text-xs uppercase tracking-[0.16em] mb-2 ${mode ? 'text-slate-300' : 'text-slate-600'}`}>Active Notes</p>
                <p className={`text-xl font-semibold ${mode ? 'text-white' : 'text-slate-900'}`}>{user.activeNotesCount ?? '—'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
              <div className={`${mode ? 'text-slate-200' : 'text-slate-600'} text-sm ml-2` }>
                Signed in with {user.googleId ? 'Google' : 'email/password'}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition shadow-sm cursor-pointer"
              >
                <MdLogout size={18} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
