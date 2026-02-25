export interface Manager {
  id: string
  email: string
  name: string
  role: string
  ownerId: string | null
  phone?: string | null
  canCreateOwners: boolean
  canCreateProperties: boolean
  createdAt: string
}

export interface CreateManager {
  email: string
  password: string
  name: string
  canCreateOwners?: boolean
  canCreateProperties?: boolean
}
