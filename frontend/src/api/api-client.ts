import { Api, HttpClient } from './generated/Api'
import { axiosInstance } from './axios-instance'
import {
  fromApiManager,
  toApiCreateManager,
  fromApiOwnerDetail,
  fromApiOwnersList,
  toApiCreateOwner,
  toApiUpdateOwner,
  fromApiPropertyDetail,
  fromApiPropertiesList,
  toApiCreateProperty,
  toApiUpdateProperty,
  fromApiAssignment,
  toApiAssignProperty,
} from './converters'
import type {
  Manager,
  CreateManager,
  OwnerDetail,
  OwnersList,
  CreateOwner,
  UpdateOwner,
  Property,
  PropertiesList,
  CreateProperty,
  UpdateProperty,
  Assignment,
  AssignProperty,
} from '@/shared/types'
import type {
  LoginDto,
  RefreshDto,
  LoginResponseDto,
  TokenPairResponseDto,
  MessageResponseDto,
  AuthUserDto,
  CreateOwnerDto,
  OwnersControllerFindAllParams,
  PropertiesControllerFindAllParams,
  ManagerPropertiesControllerFindAllParams,
} from './generated/Api'

/**
 * API клиент — возвращает доменные типы из @/shared/types.
 * Сгенерированные типы не утекают за пределы api-слоя.
 */
class ApiClient {
  private api: Api<unknown>

  constructor() {
    const httpClient = new HttpClient()
    httpClient.instance = axiosInstance
    this.api = new Api(httpClient)
  }

  login(data: LoginDto): Promise<LoginResponseDto> {
    return this.api.auth.authControllerLogin(data)
  }

  refresh(data: RefreshDto): Promise<TokenPairResponseDto> {
    return this.api.auth.authControllerRefresh(data)
  }

  logout(): Promise<MessageResponseDto> {
    return this.api.auth.authControllerLogout()
  }

  getMe(): Promise<AuthUserDto> {
    return this.api.auth.authControllerGetMe()
  }

  // Users (managers)
  createManager(data: CreateManager): Promise<Manager> {
    return this.api.users.usersControllerCreateManager(toApiCreateManager(data)).then(fromApiManager)
  }

  getManagers(): Promise<Manager[]> {
    return this.api.users.usersControllerGetManagers().then((list) => list.map(fromApiManager))
  }

  deleteManager(id: string): Promise<void> {
    return this.api.users.usersControllerDeleteManager({ id })
  }

  createOwner(data: CreateOwner): Promise<Manager> {
    const dto: CreateOwnerDto = toApiCreateOwner(data)
    return this.api.users.usersControllerCreateOwner(dto).then(fromApiManager)
  }

  // Owners
  getOwners(params?: OwnersControllerFindAllParams): Promise<OwnersList> {
    return this.api.owners.ownersControllerFindAll(params ?? {}).then(fromApiOwnersList)
  }

  getOwner(id: string): Promise<OwnerDetail> {
    return this.api.owners.ownersControllerFindOne({ id }).then(fromApiOwnerDetail)
  }

  updateOwner(id: string, data: UpdateOwner): Promise<OwnerDetail> {
    return this.api.owners.ownersControllerUpdate({ id }, toApiUpdateOwner(data)).then(fromApiOwnerDetail)
  }

  deleteOwner(id: string): Promise<void> {
    return this.api.owners.ownersControllerRemove({ id })
  }

  // Properties
  getProperties(params?: PropertiesControllerFindAllParams): Promise<PropertiesList> {
    return this.api.properties.propertiesControllerFindAll(params ?? {}).then(fromApiPropertiesList)
  }

  getProperty(id: string): Promise<Property> {
    return this.api.properties.propertiesControllerFindOne({ id }).then(fromApiPropertyDetail)
  }

  createProperty(data: CreateProperty): Promise<Property> {
    return this.api.properties.propertiesControllerCreate(toApiCreateProperty(data)).then(fromApiPropertyDetail)
  }

  updateProperty(id: string, data: UpdateProperty): Promise<Property> {
    return this.api.properties.propertiesControllerUpdate({ id }, toApiUpdateProperty(data)).then(fromApiPropertyDetail)
  }

  deleteProperty(id: string): Promise<void> {
    return this.api.properties.propertiesControllerRemove({ id })
  }

  // Manager-Properties (assignments)
  getAssignments(params?: ManagerPropertiesControllerFindAllParams): Promise<Assignment[]> {
    return this.api.managerProperties.managerPropertiesControllerFindAll(params ?? {}).then((list) =>
      list.map(fromApiAssignment),
    )
  }

  assignProperty(data: AssignProperty): Promise<Assignment> {
    return this.api.managerProperties.managerPropertiesControllerAssign(toApiAssignProperty(data)).then(
      fromApiAssignment,
    )
  }

  unassignProperty(id: string): Promise<void> {
    return this.api.managerProperties.managerPropertiesControllerUnassign({ id })
  }
}

export const apiClient = new ApiClient()
