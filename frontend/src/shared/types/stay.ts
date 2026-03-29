export interface Stay {
  id: string
  propertyId: string
  propertyTitle: string
  ownerId: string
  ownerName: string
  guestName: string
  checkIn: string
  checkOut: string
  totalAmount: number
  createdAt: string
}

export interface StaysList {
  items: Stay[]
  total: number
}

export interface CreateStay {
  propertyId: string
  guestName: string
  checkIn: string
  checkOut: string
  totalAmount: number
  commissionPercent?: number
  cleaningAmount?: number
  incomeComment?: string
  commissionComment?: string
  cleaningComment?: string
}
