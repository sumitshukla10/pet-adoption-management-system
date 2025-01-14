import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPets } from '../lib/api';
import AdoptionForm from '../components/AdoptionForm';
import type { Pet } from '../types';

export default function PetList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'adopted'>('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const fetchedPets = await getPets();
        setPets(fetchedPets);
      } catch (error) {
        console.error('Error loading pets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const handleAdoptClick = (pet: Pet) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setSelectedPet(pet);
  };

  const handleAdoptionSuccess = () => {
    setSelectedPet(null);
    // Refresh the pet list to show updated status
    getPets().then(setPets);
  };

  const filteredPets = pets
    .filter(pet => filter === 'all' || pet.status === filter)
    .filter(pet =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Pets</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'available' | 'adopted')}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Pets</option>
              <option value="available">Available</option>
              <option value="adopted">Adopted</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={pet.images[0]}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{pet.name}</h2>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    pet.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{pet.breed}</p>
                <p className="text-gray-500 mb-4">{pet.age} years old</p>
                <button
                  onClick={() => handleAdoptClick(pet)}
                  className={`w-full py-2 rounded-md transition-colors ${
                    pet.status === 'available'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={pet.status !== 'available'}
                >
                  {pet.status === 'available' ? 'Adopt Me' : 'Already Adopted'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedPet && (
        <AdoptionForm
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onSuccess={handleAdoptionSuccess}
        />
      )}
    </div>
  );
}