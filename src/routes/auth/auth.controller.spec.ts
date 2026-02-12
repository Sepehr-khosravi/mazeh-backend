import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from "./dto";


import { AuthGuard } from "src/common/guards/auth/jwt-auth.guard";

//errors
import {
    NotFoundException,
    BadRequestException,
    UnauthorizedException
} from '@nestjs/common';


let mockAuthService;



describe("AuthController - login", () => {
    let authController: AuthController;
    let authService: AuthService;
    let dto : LoginDto = {
        username : "Test",
        email : "test@gmail.com",
        password : "1234",
        _atLeastOneCheck : true
    }

    beforeEach(async () => {
        jest.clearAllMocks();

        mockAuthService = {
            login: jest.fn(),
            register: jest.fn(),
            verifyTokens: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).overrideGuard(AuthGuard).useValue({
            canActivate: () => false,
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });


    it("should call authService.login with correct dto", async () => {

        await authController.login(dto);

        expect(authService.login).toHaveBeenCalledWith(dto);
    });

    it("should return service result", async () => {

        mockAuthService.login.mockResolvedValue({ message: "ok" });

        const result = await authController.login(dto);

        expect(result).toMatchObject({ message: "ok" });
    });

    it("should throw a not found Error if user doesn't exist", async () => {

        const error = new NotFoundException();

        mockAuthService.login.mockRejectedValue(error);

        await expect(authController.login(dto)).rejects.toThrow(error);
    })
});

describe("AuthController - register", () => {
    let authController: AuthController;
    let authService: AuthService;

    let dto : RegisterDto = {
        username : "Test",
        email : "test@gmail.com",
        password : "12345",
        _atLeastOneCheck : true
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        mockAuthService = {
            login: jest.fn(),
            register: jest.fn(),
            verifyTokens: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).overrideGuard(AuthGuard).useValue({ canActivate: () => false }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });


    it("should call authService.register with correct dto", async () => {

        await authController.register(dto);

        expect(authService.register).toHaveBeenCalledWith(dto);
    });

    it("should return authService.register result", async () => {

        mockAuthService.register.mockResolvedValue({ message: "ok" });

        const result = await authController.register(dto);

        expect(result).toMatchObject({ message: "ok" });
    })

    it("should throw bad request when user has already existed", async () => {

        const error = new BadRequestException();

        mockAuthService.register.mockRejectedValue(error);

        await expect(authController.register(dto)).rejects.toThrow(error);
    });
})


describe("AuthController - verifyTokens", () => {
    let authController: AuthController;
    let authService: AuthService;

    mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        verifyTokens: jest.fn()
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).overrideGuard(AuthGuard).useValue({ canActivate: () => true }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });



    it("should call authService.verifyTokens with correct request ", async () => {
        const req = {
            user: {
                id: 1,
                username: "test",
                email: "test@gmail.com"
            }
        };

        await authController.verifyToken(req as any);


        expect(authService.verifyTokens).toHaveBeenCalledWith(req.user);

    })

    it("should return authService.verifyTokens result", async () => {
        const req = {
            user: {
                id: 1,
                username: "test",
                email: "test@gmail.com"
            }
        };

        mockAuthService.verifyTokens.mockResolvedValue({ message: "ok" });

        const result = await authController.verifyToken(req as any);

        expect(result).toMatchObject({ message: "ok" });
    });

    it("should throw unauthorized error when user is not authorized", async () => {
        const req = {
            user: {
                id: 1,
                username: "test",
                email: "test@gmail.com"
            }
        };

        const error = new UnauthorizedException();

        mockAuthService.verifyTokens.mockRejectedValue(error);

        await expect(authController.verifyToken(req as any)).rejects.toThrow(error);
    })
})
