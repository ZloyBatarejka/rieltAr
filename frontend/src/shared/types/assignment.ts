export interface Assignment {
  id: string
  userId: string
  propertyId: string
  userName: string
  propertyTitle: string
  propertyAddress: string
  assignedAt: string
}

export interface AssignProperty {
  userId: string
  propertyId: string
}
