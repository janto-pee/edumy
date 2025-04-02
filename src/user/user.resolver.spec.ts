import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AddressService } from 'src/address/address.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { FilterUserDto } from './dto/filter-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Mock services
const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findWithFilters: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  changePassword: jest.fn(),
};

const mockAddressService = {
  findBy: jest.fn(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
        { provide: AddressService, useValue: mockAddressService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      const expectedUser = {
        _id: 'user-id',
        ...createUserInput,
        role: UserRole.USER,
        is_email_verified: false,
        createdAt: new Date(),
      };

      mockUserService.create.mockResolvedValue(expectedUser);

      const result = await resolver.createUser(createUserInput);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserInput);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const page = 1;
      const limit = 10;
      const paginatedResponse = {
        items: [{ _id: 'user-id', username: 'testuser' }],
        total: 1,
        page,
        limit,
        totalPages: 1,
      };

      mockUserService.findAll.mockResolvedValue(paginatedResponse);

      const result = await resolver.findAll(page, limit);

      expect(mockUserService.findAll).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findWithFilters', () => {
    it('should return filtered users', async () => {
      const filter: FilterUserDto = { role: UserRole.INSTRUCTOR };
      const page = 1;
      const limit = 10;
      const paginatedResponse = {
        items: [
          { _id: 'user-id', username: 'instructor', role: UserRole.INSTRUCTOR },
        ],
        total: 1,
        page,
        limit,
        totalPages: 1,
      };

      mockUserService.findWithFilters.mockResolvedValue(paginatedResponse);

      const result = await resolver.findWithFilters(filter, page, limit);

      expect(mockUserService.findWithFilters).toHaveBeenCalledWith(
        filter,
        page,
        limit,
      );
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a user by id when user is admin', async () => {
      const userId = 'user-id';
      const currentUser = { _id: 'admin-id', role: UserRole.ADMIN };
      const expectedUser = { _id: userId, username: 'testuser' };

      mockUserService.findOne.mockResolvedValue(expectedUser);

      const result = await resolver.findOne(userId, currentUser as User);

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should return a user by id when user is requesting their own profile', async () => {
      const userId = 'user-id';
      const currentUser = { _id: userId, role: UserRole.USER };
      const expectedUser = { _id: userId, username: 'testuser' };

      mockUserService.findOne.mockResolvedValue(expectedUser);

      const result = await resolver.findOne(userId, currentUser as User);

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when non-admin user requests another user profile', async () => {
      const userId = 'other-user-id';
      const currentUser = { _id: 'user-id', role: UserRole.USER };

      await expect(
        resolver.findOne(userId, currentUser as User),
      ).rejects.toThrow('You are not authorized to view this user profile');

      expect(mockUserService.findOne).not.toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('should return the current user profile', async () => {
      const currentUser = { _id: 'user-id', role: UserRole.USER };
      const expectedUser = { _id: 'user-id', username: 'testuser' };

      mockUserService.findOne.mockResolvedValue(expectedUser);

      const result = await resolver.getMe(currentUser as User);

      expect(mockUserService.findOne).toHaveBeenCalledWith(currentUser._id);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('updateUser', () => {
    it('should update user when user is admin', async () => {
      const updateUserInput: UpdateUserInput = {
        id: 'user-id',
        first_name: 'Updated',
        role: UserRole.INSTRUCTOR,
      };
      const currentUser = { _id: 'admin-id', role: UserRole.ADMIN };
      const expectedUser = {
        _id: 'user-id',
        first_name: 'Updated',
        role: UserRole.INSTRUCTOR,
      };

      mockUserService.update.mockResolvedValue(expectedUser);

      const result = await resolver.updateUser(
        updateUserInput,
        currentUser as User,
      );

      expect(mockUserService.update).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should update user when user is updating their own profile', async () => {
      const userId = 'user-id';
      const updateUserInput: UpdateUserInput = {
        id: userId,
        first_name: 'Updated',
      };
      const currentUser = { _id: userId, role: UserRole.USER };
      const expectedUser = {
        _id: userId,
        first_name: 'Updated',
      };

      mockUserService.update.mockResolvedValue(expectedUser);

      const result = await resolver.updateUser(
        updateUserInput,
        currentUser as User,
      );

      expect(mockUserService.update).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
      expect(result).toEqual(expectedUser);
    });

    // it('should throw error when non-admin user updates another user profile', async () => {
    //   const updateUserInput: UpdateUserInput = {
    //     id:
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { UserResolver } from './user.resolver';
// import { UserService } from './user.service';

// describe('UserResolver', () => {
//   let resolver: UserResolver;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UserResolver, UserService],
//     }).compile();

//     resolver = module.get<UserResolver>(UserResolver);
//   });

//   it('should be defined', () => {
//     expect(resolver).toBeDefined();
//   });
// });
