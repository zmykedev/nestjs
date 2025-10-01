import { SetMetadata } from '@nestjs/common';
import { Public, IS_PUBLIC_KEY } from '../public.decorator';

// Mock SetMetadata
jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export IS_PUBLIC_KEY constant', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });

  it('should call SetMetadata with correct parameters', () => {
    const mockSetMetadata = SetMetadata as jest.MockedFunction<
      typeof SetMetadata
    >;

    // Call the Public decorator
    Public();

    // Verify SetMetadata was called with correct parameters
    expect(mockSetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    expect(mockSetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should return the result of SetMetadata', () => {
    const mockSetMetadata = SetMetadata as jest.MockedFunction<
      typeof SetMetadata
    >;
    const mockResult = Symbol('decorator');
    mockSetMetadata.mockReturnValue(mockResult as any);

    const result = Public();

    expect(result).toBe(mockResult);
  });

  it('should be a function', () => {
    expect(typeof Public).toBe('function');
  });

  it('should have IS_PUBLIC_KEY as a string', () => {
    expect(typeof IS_PUBLIC_KEY).toBe('string');
    expect(IS_PUBLIC_KEY).toBeTruthy();
  });
});
