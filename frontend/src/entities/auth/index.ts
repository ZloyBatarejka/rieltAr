import { AuthStore } from './model/auth.store'
import { apiClient } from '../../api/api-client'

export { AuthStore } from './model/auth.store'
export type { AuthApi } from './model/auth.store'

export const authStore = new AuthStore(apiClient)
