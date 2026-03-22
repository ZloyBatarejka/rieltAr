import { makeAutoObservable, runInAction } from 'mobx'
import { managerOwnersApi } from '../api'
import type { Owner, CreateOwner } from '@/shared/types'

class ManagerOwnersStore {
  owners: Owner[] = []
  isLoading = true
  search = ''
  isModalOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  get filteredOwners(): Owner[] {
    if (!this.search) return this.owners
    const q = this.search.toLowerCase()
    return this.owners.filter((o) => o.name.toLowerCase().includes(q))
  }

  setSearch(value: string): void {
    this.search = value
  }

  openModal(): void {
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

  async fetchOwners(): Promise<void> {
    this.isLoading = true
    try {
      const data = await managerOwnersApi.getOwners()
      runInAction(() => {
        this.owners = data.items
      })
    } catch {
      // toast handled by components
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async addOwner(values: CreateOwner): Promise<void> {
    await managerOwnersApi.createOwner(values)
    this.closeModal()
    await this.fetchOwners()
  }
}

export const managerOwnersStore = new ManagerOwnersStore()
