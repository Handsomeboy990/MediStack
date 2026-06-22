import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

// Authentication service skeleton. Credential verification, password hashing
// and token issuance will be implemented later.
@Injectable()
export class AuthService {
  async login(dto: LoginDto) {
    // TODO: verify credentials and generate an access token.
    return {
      token: null,
      user: { email: dto.email },
    };
  }
}
