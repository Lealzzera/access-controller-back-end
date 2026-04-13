import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { IInstitutionsRepository } from '../institutions/repositories/interfaces/institutions-repository.interface';
import { IResponsibleRepository } from '../responsible/repositories/interfaces/responsible-repository.interface';

interface AuthServiceRequest {
  email: string;
  password: string;
}

interface AuthServiceResponse {}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken({ email, password }: AuthServiceRequest) {
    console.log('entrou');
    const user =
      (await this.institutionsRepository.findInstitutionByEmail(email)) ??
      (await this.responsibleRepository.findResponsibleByEmail(email));
    if (!user) {
      console.log('aqui?');
      throw new UnauthorizedException('Invalid user credentials');
    }

    const doesUserPasswordMatch = await compare(password, user.password);
    console.log({ doesUserPasswordMatch });
    if (!doesUserPasswordMatch) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    if (user.deletedAt !== null) {
      throw new UnauthorizedException('User does not exist');
    }

    const payload = { sub: user.id, role: user.role };
    console.log({ payload });
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '20d',
    });
    console.log({ access_token });
    return { access_token };
  }
}
