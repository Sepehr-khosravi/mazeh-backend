import {
    Test,
    TestingModule
} from "@nestjs/testing";
import { AuthService } from './auth.service';
import { PrismaService } from "src/common/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    genSalt: jest.fn(),
    hash: jest.fn()
}))

import * as bcrypt from "bcrypt";
import { LoginDto, RegisterDto, VerifyTokenDto } from "./dto";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from "src/common/Guards/auth/jwt-auth.guard";

const mockPrisma = {
    user: {
        findFirst: jest.fn(),
        create: jest.fn()
    }
}

const mockConfig = {
    get: jest.fn()
};

const mockJwt = {
    signAsync: jest.fn()
};

describe("AuthService - login", () => {
    let authService: AuthService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrisma
                },
                {
                    provide: ConfigService,
                    useValue: mockConfig
                },
                {
                    provide: JwtService,
                    useValue: mockJwt
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService);
    })

    const dtoLogin: LoginDto = {
        username : "Test",
        email: "test@gmail.com",
        password: "1234567",
        _atLeastOneCheck : true
    };

    it("should throw not found error when users are not found", async () => {
        mockPrisma.user.findFirst.mockResolvedValue(null);

        await expect(authService.login(dtoLogin)).rejects.toThrow(NotFoundException);
    });

    it("should throw bad request error if user password was wrong", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "Test",
            email: "test@gmail.com",
            password: "hashed-password",
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.login(dtoLogin))
            .rejects.toThrow(BadRequestException);
    })

    it("should return response even when token is null (based on current service implementation)", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "Test",
            email: "test@gmail.com",
            password: "hashed-password",
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        mockJwt.signAsync.mockResolvedValue(null);

        const result = await authService.login(dtoLogin);
        
        expect(result).toEqual(expect.objectContaining({
            message: expect.any(String),
            data: {
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
                token: null // Token is null but service doesn't throw
            }
        }));
    });

    it("should return the correct result with valid token", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "test",
            email: "test@gmail.com",
            password: "hashed-password",
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        mockJwt.signAsync.mockResolvedValue("kjsdlfkj4jrlskdf4fhsdf");

        const result = await authService.login(dtoLogin);

        expect(result).toEqual(expect.objectContaining({
            message: expect.any(String),
            data: {
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
                token: expect.any(String)
            }
        }))
    })
});

describe("AuthService - register", () => {
    let authService: AuthService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrisma
                },
                {
                    provide: ConfigService,
                    useValue: mockConfig
                },
                {
                    provide: JwtService,
                    useValue: mockJwt
                },
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    const dtoRegister: RegisterDto = {
        username : "Test",
        email: "test@gmail.com",
        password: "1234567",
        _atLeastOneCheck : true
    };

    it("should throw BadRequest if user has already existed", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "Test",
            email: "test@gmail.com",
            password: "1234567"
        });

        await expect(authService.register(dtoRegister)).rejects.toThrow(BadRequestException);
    })

    it("should create a new User and return the result", async () => {
        mockPrisma.user.findFirst.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({
            id: 1,
            email: dtoRegister.email,
            username: dtoRegister.username,
            password: "hashed-password"
        });
        
        (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

        mockJwt.signAsync.mockResolvedValue("943kfnij9lsrknjg4ghdfhg");
        
        const result = await authService.register(dtoRegister);

        expect(result).toEqual(expect.objectContaining({
            message: expect.any(String),
            data: {
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
                token: expect.any(String)
            }
        }))
    })
});

describe("AuthService - verifyTokens", () => {
    let authService: AuthService;
    
    beforeEach(async () => {
        jest.clearAllMocks();
        
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrisma,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfig
                },
                {
                    provide: JwtService,
                    useValue: mockJwt
                }
            ]
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        authService = module.get<AuthService>(AuthService);
    });

    it("should return the correct result", async () => {
        const req: VerifyTokenDto = {
            id: 1,
            email: "test@gmail.com",
        };

        const result = await authService.verifyTokens(req);

        expect(result).toEqual(expect.objectContaining({
            message: expect.any(String),
            data: {
                id: expect.any(Number),
                email: expect.any(String)
            }
        }));
    });
});