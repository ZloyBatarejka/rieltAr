import type {
  ManagerPropertyResponseDto,
  AssignPropertyDto,
} from '../generated/Api'
import type { Assignment, AssignProperty } from '@/shared/types'

export function fromApiAssignment(dto: ManagerPropertyResponseDto): Assignment {
  return {
    id: dto.id,
    userId: dto.userId,
    propertyId: dto.propertyId,
    userName: dto.userName,
    propertyTitle: dto.propertyTitle,
    propertyAddress: dto.propertyAddress,
    assignedAt: dto.assignedAt,
  }
}

export function toApiAssignProperty(data: AssignProperty): AssignPropertyDto {
  return {
    userId: data.userId,
    propertyId: data.propertyId,
  }
}
