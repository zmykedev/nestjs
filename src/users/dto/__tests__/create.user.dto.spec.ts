import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto, DefaultColumnsResponse } from '../create.user.dto';

describe('CreateUserDto', () => {
  it('should create a valid CreateUserDto instance', () => {
    const createUserDto = Object.assign(new CreateUserDto(), {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(createUserDto.email).toBe('test@example.com');
    expect(createUserDto.password).toBe('password123');
    expect(createUserDto.firstName).toBe('John');
    expect(createUserDto.lastName).toBe('Doe');
  });

  it('should validate email format', async () => {
    const createUserDto = Object.assign(new CreateUserDto(), {
      email: 'invalid-email',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should validate required fields', async () => {
    const createUserDto = new CreateUserDto();
    // Missing required fields

    const errors = await validate(createUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation with valid data', async () => {
    const createUserDto = Object.assign(new CreateUserDto(), {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);
  });

  it('should allow optional email', () => {
    const createUserDto = Object.assign(new CreateUserDto(), {
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      // email is optional
    });

    expect(createUserDto.email).toBeUndefined();
  });
});

describe('UpdateUserDto', () => {
  it('should extend CreateUserDto', () => {
    const updateUserDto = new UpdateUserDto();

    // UpdateUserDto extends CreateUserDto via PartialType, so properties are optional
    // We can assign values to test the structure
    const testDto = Object.assign(updateUserDto, {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(testDto.email).toBe('test@example.com');
    expect(testDto.password).toBe('password123');
    expect(testDto.firstName).toBe('John');
    expect(testDto.lastName).toBe('Doe');
  });

  it('should allow partial updates', () => {
    const updateUserDto = Object.assign(new UpdateUserDto(), {
      firstName: 'Jane',
      // Other fields can be undefined
    });

    expect(updateUserDto.firstName).toBe('Jane');
    expect(updateUserDto.lastName).toBeUndefined();
    expect(updateUserDto.email).toBeUndefined();
    expect(updateUserDto.password).toBeUndefined();
  });
});

describe('DefaultColumnsResponse', () => {
  it('should extend CreateUserDto with additional fields', () => {
    const response = Object.assign(new DefaultColumnsResponse(), {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Should have all CreateUserDto properties
    expect(response.email).toBe('test@example.com');
    expect(response.password).toBe('password123');
    expect(response.firstName).toBe('John');
    expect(response.lastName).toBe('Doe');

    // Should have additional properties
    expect(response.id).toBe(1);
    expect(response.createdAt).toBeInstanceOf(Date);
    expect(response.updatedAt).toBeInstanceOf(Date);
  });

  it('should have correct property types', () => {
    const response = Object.assign(new DefaultColumnsResponse(), {
      id: 1,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    });

    expect(typeof response.id).toBe('number');
    expect(response.createdAt).toBeInstanceOf(Date);
    expect(response.updatedAt).toBeInstanceOf(Date);
  });
});
