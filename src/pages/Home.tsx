import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Search, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 sm:py-24"
      >
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect Pet Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with local shelters and give a loving home to pets in need
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/pets"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Pets
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up to Adopt
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center p-6"
        >
          <Search className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Browse Pets</h3>
          <p className="text-gray-600">
            Search through our database of adorable pets waiting for their forever homes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center p-6"
        >
          <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Apply to Adopt</h3>
          <p className="text-gray-600">
            Submit adoption applications and connect with pet shelters
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center p-6"
        >
          <UserPlus className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
          <p className="text-gray-600">
            Set up your profile to streamline the adoption process
          </p>
        </motion.div>
      </div>
    </div>
  );
}