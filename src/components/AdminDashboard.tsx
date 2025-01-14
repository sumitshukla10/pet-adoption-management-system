import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Check, X } from 'lucide-react';
import { createPet, getAllAdoptionApplications, updateAdoptionApplication, getPet } from '../lib/api';
import type { Pet, AdoptionApplication } from '../types';

export default function AdminDashboard() {
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [applications, setApplications] = useState<(AdoptionApplication & { pet?: Pet })[]>([]);
  const [newPet, setNewPet] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    images: [] as string[],
    status: 'available' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await getAllAdoptionApplications();
      
      // Fetch pet details for each application
      const appsWithPets = await Promise.all(
        apps.map(async (app) => {
          const pet = await getPet(app.petId);
          return { ...app, pet };
        })
      );
      
      setApplications(appsWithPets);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image');
        return;
      }
    }

    setNewPet(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPet.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const age = parseInt(newPet.age);
    if (isNaN(age) || age < 0) {
      setError('Please enter a valid age');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await createPet({
        ...newPet,
        age,
      });
      
      setNewPet({
        name: '',
        breed: '',
        age: '',
        description: '',
        images: [],
        status: 'available',
      });
      
      setIsAddingPet(false);
    } catch (error) {
      console.error('Error creating pet:', error);
      setError('Failed to create pet');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateAdoptionApplication(applicationId, status);
      // Refresh applications list
      await loadApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <button
              onClick={() => setIsAddingPet(!isAddingPet)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Pet
            </button>
          </div>

          {/* Add Pet Form */}
          {isAddingPet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-6"
            >
              <h3 className="text-lg font-semibold mb-4">Add New Pet</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={newPet.name}
                    onChange={(e) => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Breed</label>
                  <input
                    type="text"
                    required
                    value={newPet.breed}
                    onChange={(e) => setNewPet(prev => ({ ...prev, breed: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPet.age}
                    onChange={(e) => setNewPet(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={newPet.description}
                    onChange={(e) => setNewPet(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {newPet.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newPet.images.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingPet(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding Pet...' : 'Add Pet'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Adoption Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Adoption Applications</h2>
          
          {applications.length === 0 ? (
            <p className="text-gray-600">No adoption applications yet.</p>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Application for {application.pet?.name || 'Unknown Pet'}
                      </h3>
                      <p className="text-gray-600">From: {application.fullName}</p>
                      <p className="text-gray-600">Email: {application.email}</p>
                      <p className="text-gray-600">Phone: {application.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Reason for Adoption</h4>
                    <p className="text-gray-600">{application.reasonForAdoption}</p>
                  </div>

                  {application.hasOtherPets && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Other Pets</h4>
                      <p className="text-gray-600">{application.otherPetsDetails}</p>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                        className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApplicationUpdate(application.id, 'approved')}
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}