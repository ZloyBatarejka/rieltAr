import { makeAutoObservable, runInAction } from 'mobx'
import { managerPropertiesApi } from '../api'
import type { Property, Owner, CreateProperty, UpdateProperty } from '@/shared/types'

class ManagerPropertiesStore {
  properties: Property[] = []
  owners: Owner[] = []
  isLoading = true
  search = ''

  isAddModalOpen = false
  isEditModalOpen = false
  editingProperty: Property | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get filteredProperties(): Property[] {
    if (!this.search) return this.properties
    const q = this.search.toLowerCase()
    return this.properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    )
  }

  setSearch(value: string): void {
    this.search = value
  }

  openAddModal(): void {
    this.isAddModalOpen = true
  }

  closeAddModal(): void {
    this.isAddModalOpen = false
  }

  openEditModal(property: Property): void {
    this.editingProperty = property
    this.isEditModalOpen = true
  }

  closeEditModal(): void {
    this.isEditModalOpen = false
  }

  async fetchAll(): Promise<void> {
    this.isLoading = true
    try {
      const [propertiesData, ownersData] = await Promise.all([
        managerPropertiesApi.getProperties(),
        managerPropertiesApi.getOwners(),
      ])
      runInAction(() => {
        this.properties = propertiesData.items
        this.owners = ownersData.items
      })
    } catch {
      // handled by caller / toast
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async addProperty(data: CreateProperty): Promise<void> {
    await managerPropertiesApi.createProperty(data)
    this.closeAddModal()
    await this.fetchAll()
  }

  async updateProperty(id: string, data: UpdateProperty): Promise<void> {
    await managerPropertiesApi.updateProperty(id, data)
    this.closeEditModal()
    await this.fetchAll()
  }

  async deleteProperty(id: string): Promise<void> {
    await managerPropertiesApi.deleteProperty(id)
    await this.fetchAll()
  }
}

export const managerPropertiesStore = new ManagerPropertiesStore()
