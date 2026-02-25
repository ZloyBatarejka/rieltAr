export interface Owner {
  id: string
  name: string
  phone?: string | null
  propertiesCount: number
  balance: number
  createdAt: string
}

export interface OwnerDetail extends Owner {
  email: string
}

export interface OwnersList {
  items: Owner[]
  total: number
}

export interface CreateOwner {
  email: string
  password: string
  name: string
  phone?: string
}

export interface UpdateOwner {
  phone?: string
}
