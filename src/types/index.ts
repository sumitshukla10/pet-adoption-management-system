export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  images: string[];
  status: 'available' | 'adopted' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  fullName: string;
  email: string;
  phone: string;
  address: string;
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  reasonForAdoption: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}