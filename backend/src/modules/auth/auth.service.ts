import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = user.role.permissions.map(
      (link) => link.permission.name,
    );
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role.name,
      permissions,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    await this.usersService.updateLastLogin(user.id);

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role.name,
        permissions,
      },
    };
  }

  // The JWT is stateless, so logout is acknowledged server side while the client
  // discards the token. A token blacklist or refresh rotation can be added later.
  logout() {
    return { message: 'Successfully logged out' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profile: user.profile,
      lastLogin: user.lastLogin,
      role: user.role.name,
      permissions: user.role.permissions.map((link) => link.permission.name),
    };
  }
}
