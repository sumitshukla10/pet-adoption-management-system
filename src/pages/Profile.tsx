import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

export default function Profile() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{currentUser?.email}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}