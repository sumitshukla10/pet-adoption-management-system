import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PawPrint } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">PetAdopt</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/pets" className="text-gray-700 hover:text-purple-600">
              Find Pets
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-purple-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-purple-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}