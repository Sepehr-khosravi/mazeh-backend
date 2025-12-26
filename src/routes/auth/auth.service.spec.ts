import {
    Test,
    TestingModule
} from "@nestjs/testing";
import { AuthService } from './auth.service';
import { PrismaService } from "src/common/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";



jest.mock("bcrypt", () => ({
    compare: jest.fn()
}))



import * as bcrypt from "bcrypt";


import { LoginDto } from "./dto";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";






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
        email: "test@gmail.com",
        password: "1234567"
    };

    it("should throw not found error when users are not found", async () => {
        mockPrisma.user.findFirst.mockResolvedValue(undefined);

        await expect(authService.login(dtoLogin)).rejects.toThrow(NotFoundException);
    });

    it("should throw bad request error if user password was wrong", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "test",
            email: "test@gmail.com",
            password: "hashed-password",
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);


        await expect(authService.login(dtoLogin))
            .rejects.toThrow(BadRequestException);
    })


    it("should throw internal server error if system couldn't create tokens ", async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 1,
            username: "test",
            email: "test@gmail.com",
            password: "hashed-password",
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        mockJwt.signAsync.mockResolvedValue(false);

        await expect(authService.login(dtoLogin)).rejects.toThrow(InternalServerErrorException);

    });

    it("should return the correct result ", async () => {
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
})