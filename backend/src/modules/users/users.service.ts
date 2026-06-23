import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

const BCRYPT_ROUNDS = 10;

// Includes the role with its permissions so callers can build the permission
// list (used by the auth module).
const userWithRole = {
  role: { include: { permissions: { include: { permission: true } } } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Used by the auth module for login. Returns the password hash, so it must
  // never be exposed directly through an HTTP response.
  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: userWithRole,
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: userWithRole,
    });
  }

  async create(data: {
    fullName: string;
    username: string;
    password: string;
    roleId: string;
    profile?: string;
    personneId?: string;
  }) {
    const password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    return this.prisma.user.create({
      data: { ...data, password },
    });
  }

  updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}
