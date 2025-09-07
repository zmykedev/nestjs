import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class GetRefreshResponse {
  @ApiProperty()
  readonly accessToken: string;
}

export class UserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly role: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ required: false })
  readonly lastLoginAt?: Date;
}

export class TokensDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;

  @ApiProperty({ example: 3600 })
  readonly expiresIn: number;

  @ApiProperty({ example: Date.now() })
  readonly issuedAt: number;
}

export class SessionMetaDto {
  @ApiProperty({ required: false })
  readonly ipAddress?: string;

  @ApiProperty({ required: false })
  readonly userAgent?: string;

  @ApiProperty({ required: false })
  readonly location?: string;

  @ApiProperty({ default: true })
  readonly isActive: boolean;
}

export class SessionDto {
  @ApiProperty({ type: TokensDto })
  readonly tokens: TokensDto;

  @ApiProperty({ type: UserDto })
  readonly user: UserDto;

  @ApiProperty({ type: SessionMetaDto })
  readonly meta: SessionMetaDto;
}

export class PostLoginResponse {
  @ApiProperty({ type: SessionDto })
  readonly session: SessionDto;
}
