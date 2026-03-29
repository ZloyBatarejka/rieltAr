import { makeAutoObservable } from 'mobx'

const STORAGE_KEY = 'balivi-dark-theme'

class ThemeStore {
  isDark: boolean

  constructor() {
    this.isDark = localStorage.getItem(STORAGE_KEY) === 'true'
    makeAutoObservable(this)
  }

  toggle = () => {
    this.isDark = !this.isDark
    localStorage.setItem(STORAGE_KEY, String(this.isDark))
  }
}

export const themeStore = new ThemeStore()
