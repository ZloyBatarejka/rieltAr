export interface Payout {
  id: string
  ownerId: string
  ownerName: string
  propertyId: string
  propertyTitle: string
  amount: number
  comment: string | null
  paidAt: string
  createdAt: string
}

export interface PayoutsList {
  items: Payout[]
  total: number
}

export interface CreatePayout {
  propertyId: string
  amount: number
  comment?: string
}
