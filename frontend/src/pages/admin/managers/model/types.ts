export type PermissionField = 'canCreateOwners' | 'canCreateProperties'

export interface CreateManagersColumnsParams {
  onDeleteManager: (id: string, name: string) => Promise<void>
  onPermissionChange: (
    managerId: string,
    field: PermissionField,
    value: boolean,
  ) => void
}
