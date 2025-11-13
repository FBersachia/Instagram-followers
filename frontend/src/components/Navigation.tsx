import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Upload,
  UserX,
  UserMinus,
  Shield,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { CopyScriptButton } from './CopyScriptButton';
import { useAuth } from '../contexts/AuthContext';

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { to: '/upload', label: 'Upload JSON', icon: <Upload className="h-5 w-5" /> },
  { to: '/whitelist', label: 'Whitelist', icon: <Shield className="h-5 w-5" /> },
  { to: '/non-followers', label: 'Non-Followers', icon: <UserX className="h-5 w-5" /> },
  { to: '/ex-followers', label: 'Ex-Followers', icon: <UserMinus className="h-5 w-5" /> }
];

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-lg sm:text-xl font-bold text-blue-600">
                  IG Follower Tracker
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-1 md:items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    inline-flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActive(link.to)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
              <CopyScriptButton />
              <div className="ml-2 pl-2 border-l border-gray-300 flex items-center space-x-2">
                {user && (
                  <span className="text-sm text-gray-600 px-2">
                    {user.username}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-red-50 hover:text-red-700"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button - Touch-friendly 44x44px min */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with Backdrop */}
      {/* Backdrop overlay */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300
          ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div
        ref={mobileMenuRef}
        className={`
          fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
                min-h-[44px] touch-manipulation
                ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                }
              `}
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </Link>
          ))}
          <div className="px-4 pt-2">
            <CopyScriptButton />
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            {user && (
              <div className="px-4 py-2 text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user.username}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-700 active:bg-red-100 min-h-[44px] touch-manipulation"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
