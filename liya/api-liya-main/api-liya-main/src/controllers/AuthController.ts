import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { TenantService } from "../services/TenantService";
import { generateToken } from "../utils/jwt";
import logger from "../utils/logger";

export class AuthController {
    private readonly userService = new UserService();
    private readonly tenantService = new TenantService();

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            if (!user.dataValues.isActive) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            // Verificar se o tenant está ativo (se o usuário tiver um tenant)
            if (user.dataValues.tenantId) {
                console.log(
                    "Verificando status do tenant:",
                    user.dataValues.tenantId,
                );
                const tenant = await this.tenantService.getTenantById(
                    user.dataValues.tenantId,
                );
                console.log("Status do tenant:", tenant);
                if (!tenant?.isActive) {
                    return res
                        .status(401)
                        .json({ error: "Credenciais inválidas" });
                }
            }

            const tenantName = user.dataValues.tenantId
                ? (
                      await this.tenantService.getTenantById(
                          user.dataValues.tenantId,
                      )
                  )?.name
                : undefined;

            const token = generateToken({
                userId: user.dataValues.id,
                role: user.dataValues.role,
                tenantId: user.dataValues.tenantId,
                tenantName,
            });

            logger.info(`User logged in: ${user.dataValues.email}`);

            res.json({
                token,
                user: {
                    id: user.dataValues.id,
                    name: user.dataValues.name,
                    email: user.dataValues.email,
                    role: user.dataValues.role,
                    whatsapp: user.dataValues.whatsapp,
                    segmento: user.dataValues.segmento,
                    tenantId: user.dataValues.tenantId,
                    tenantName,
                },
            });
        } catch (error) {
            logger.error("Login error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const userData = req.body;

            // Verificar se o email já existe
            const existingUser = await this.userService.getUserByEmail(
                userData.email,
            );
            if (existingUser) {
                return res.status(400).json({ error: "Email já está em uso" });
            }

            const user = await this.userService.createUser(userData);

            const token = generateToken({
                userId: user.id,
                role: user.role,
                tenantId: (user as any).tenantId,
            });

            logger.info(`New user registered: ${user.email}`);

            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    whatsapp: user.whatsapp,
                    segmento: user.segmento,
                    tenantId: (user as any).tenantId,
                },
            });
        } catch (error) {
            logger.error("Registration error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
