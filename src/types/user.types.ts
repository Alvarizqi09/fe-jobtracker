export interface AppUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface BackendUser {
  _id: string
  firebaseUid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
}

