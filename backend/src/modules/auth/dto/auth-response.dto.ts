import { ApiProperty } from '@nestjs/swagger';

// Authenticated user profile returned by /auth/me and embedded in the login
// response. Mirrors the shape built by AuthService.
export class UserProfileDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'System Administrator' })
  fullName: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'super_admin' })
  role: string;

  @ApiProperty({ type: [String], example: ['user:read', 'invoice:create'] })
  permissions: string[];

  @ApiProperty({ required: false, nullable: true })
  profile?: string | null;

  @ApiProperty({ required: false, nullable: true, format: 'date-time' })
  lastLogin?: Date | null;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Signed JWT access token' })
  accessToken: string;

  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Successfully logged out' })
  message: string;
}
