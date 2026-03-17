"use client"

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const hasFirebaseConfig =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId)

const app = hasFirebaseConfig ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null
export const auth: Auth | null = app ? getAuth(app) : null
export const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  if (!auth) throw new Error('Firebase is not configured. Check NEXT_PUBLIC_FIREBASE_* env vars.')
  return signInWithPopup(auth, googleProvider)
}
export const logOut = () => {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}

