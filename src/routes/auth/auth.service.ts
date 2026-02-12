import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto, VerifyTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { email: dto.email },
            { username: dto.username },
          ],
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const token = await this.jwtService.signAsync(
        { id: user.id, email: user.email , username : user.username},
        { secret: this.configService.get<string>('JWT_KEY') },
      );

      return {
        message: 'ok',
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          token,
        },
      };
    } catch (e) {
      if (e instanceof BadRequestException || e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async register(dto: RegisterDto) {
    try {
      const exists = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { email: dto.email },
            { username: dto.username },
          ],
        },
      });

      if (exists) {
        throw new BadRequestException('User already exists');
      }

      const hash = await bcrypt.hash(dto.password, 10);

      const user = await this.prismaService.user.create({
        data: {
          email: dto.email || "",
          username: dto.username || "",
          password: hash,
        },
      });

      const token = await this.jwtService.signAsync(
        { id: user.id, email: user.email, username : user.username },
        { secret: this.configService.get<string>('JWT_KEY') },
      );

      return {
        message: 'ok',
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          token,
        },
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async verifyTokens(data: VerifyTokenDto) {
    if(data.email && data.username){
        return {
          message: 'ok',
          data: {
            id: data.id,
            email: data.email,
            username : data.username
          },
        };
    } else if(data.email && !data.username){
      return {
        message : 'ok',
        data : {
          id : data.id,
          email : data.email,
        }
      }
    } else if(!data.email && data.username){
      return {
        message : 'ok',
        username : data.username
      }
    }else{
      throw new BadRequestException("at least you must have one of these information as a user (email, username)");
    }
  }
}
