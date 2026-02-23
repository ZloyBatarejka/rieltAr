import { Test, TestingModule } from '@nestjs/testing';
import { PropertyScopeService } from './property-scope.service';
import { ManagerPropertiesService } from '../manager-properties/manager-properties.service';
import type { AuthUser } from '../auth/auth.types';

describe('PropertyScopeService', () => {
  let service: PropertyScopeService;
  let managerPropertiesService: ManagerPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyScopeService,
        {
          provide: ManagerPropertiesService,
          useValue: {
            getAssignedPropertyIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PropertyScopeService>(PropertyScopeService);
    managerPropertiesService = module.get<ManagerPropertiesService>(
      ManagerPropertiesService,
    );
  });

  const adminUser: AuthUser = {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin',
    role: 'ADMIN',
    ownerId: null,
    canCreateOwners: false,
    canCreateProperties: false,
  };

  const managerUser: AuthUser = {
    id: 'manager-1',
    email: 'manager@test.com',
    name: 'Manager',
    role: 'MANAGER',
    ownerId: null,
    canCreateOwners: false,
    canCreateProperties: false,
  };

  const ownerUser: AuthUser = {
    id: 'user-1',
    email: 'owner@test.com',
    name: 'Owner',
    role: 'OWNER',
    ownerId: 'owner-1',
    canCreateOwners: false,
    canCreateProperties: false,
  };

  describe('getPropertyWhere', () => {
    it('returns empty where for ADMIN', async () => {
      const where = await service.getPropertyWhere(adminUser);
      expect(where).toEqual({});
    });

    it('returns ownerId filter for OWNER', async () => {
      const where = await service.getPropertyWhere(ownerUser);
      expect(where).toEqual({ ownerId: 'owner-1' });
    });

    it('returns property id filter for MANAGER with assignments', async () => {
      jest
        .spyOn(managerPropertiesService, 'getAssignedPropertyIds')
        .mockResolvedValue(['prop-1', 'prop-2']);

      const where = await service.getPropertyWhere(managerUser);
      expect(where).toEqual({ id: { in: ['prop-1', 'prop-2'] } });
    });

    it('returns empty id list for MANAGER with no assignments', async () => {
      jest
        .spyOn(managerPropertiesService, 'getAssignedPropertyIds')
        .mockResolvedValue([]);

      const where = await service.getPropertyWhere(managerUser);
      expect(where).toEqual({ id: { in: [] } });
    });
  });

  describe('getOwnerWhere', () => {
    it('returns empty where for ADMIN', async () => {
      const where = await service.getOwnerWhere(adminUser);
      expect(where).toEqual({});
    });

    it('returns id filter for OWNER', async () => {
      const where = await service.getOwnerWhere(ownerUser);
      expect(where).toEqual({ id: 'owner-1' });
    });

    it('returns properties filter for MANAGER', async () => {
      jest
        .spyOn(managerPropertiesService, 'getAssignedPropertyIds')
        .mockResolvedValue(['prop-1']);

      const where = await service.getOwnerWhere(managerUser);
      expect(where).toEqual({
        properties: { some: { id: { in: ['prop-1'] } } },
      });
    });
  });

  describe('getStayWhere', () => {
    it('returns property relation for OWNER', async () => {
      const where = await service.getStayWhere(ownerUser);
      expect(where).toEqual({ property: { ownerId: 'owner-1' } });
    });
  });
});
