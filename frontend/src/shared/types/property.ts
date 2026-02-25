export interface Property {
  id: string
  title: string
  address: string
  ownerId: string
  ownerName: string
  createdAt: string
}

export interface PropertiesList {
  items: Property[]
  total: number
}

export interface CreateProperty {
  title: string
  address: string
  ownerId: string
}

export interface UpdateProperty {
  title?: string
  address?: string
  ownerId?: string
}
