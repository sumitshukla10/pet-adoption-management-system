import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Pet, AdoptionApplication, UserProfile } from '../types';

// Pets
export async function getPets() {
  const petsRef = collection(db, 'pets');
  const q = query(petsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
}

export async function getPet(id: string) {
  const docRef = doc(db, 'pets', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Pet;
}

export async function createPet(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) {
  const petsRef = collection(db, 'pets');
  const docRef = await addDoc(petsRef, {
    ...pet,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePet(id: string, pet: Partial<Pet>) {
  const docRef = doc(db, 'pets', id);
  await updateDoc(docRef, {
    ...pet,
    updatedAt: serverTimestamp(),
  });
}

// Adoption Applications
export async function createAdoptionApplication(application: Omit<AdoptionApplication, 'id' | 'createdAt'>) {
  const applicationsRef = collection(db, 'adoptionApplications');
  const docRef = await addDoc(applicationsRef, {
    ...application,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllAdoptionApplications() {
  const applicationsRef = collection(db, 'adoptionApplications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdoptionApplication));
}

export async function getAdoptionApplications(userId: string) {
  const applicationsRef = collection(db, 'adoptionApplications');
  const q = query(
    applicationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdoptionApplication));
}

export async function updateAdoptionApplication(id: string, status: AdoptionApplication['status']) {
  const docRef = doc(db, 'adoptionApplications', id);
  await updateDoc(docRef, { 
    status,
    updatedAt: serverTimestamp()
  });

  // If approved, update pet status to adopted
  if (status === 'approved') {
    const application = await getDoc(docRef);
    if (application.exists()) {
      const { petId } = application.data() as AdoptionApplication;
      await updatePet(petId, { status: 'adopted' });
    }
  }
}

// User Profiles
export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
  const profilesRef = collection(db, 'userProfiles');
  const docRef = await addDoc(profilesRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserProfile(userId: string) {
  const docRef = doc(db, 'userProfiles', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as UserProfile;
}

export async function updateUserProfile(id: string, profile: Partial<UserProfile>) {
  const docRef = doc(db, 'userProfiles', id);
  await updateDoc(docRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  });
}