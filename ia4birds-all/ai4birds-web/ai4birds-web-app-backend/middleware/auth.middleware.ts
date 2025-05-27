import { Request, Response, NextFunction } from "express";
import responseMessages from "../utils/messages/global.messages";
import { User } from "../models/connection";
import utils from "../utils/utils";

type RequestWithSession = Request & {
  session: {
    id: number;
  };
};

const verifyToken = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"];
  console.log("🛡️ Verificando token...");

  if (!token) {
    console.warn("⛔ No se proporcionó token");
    return res.status(403).send(responseMessages[401].NO_TOKEN_PROVIDED);
  }

  if (Array.isArray(token)) {
    console.warn("⚠️ Token inválido: recibido como array");
    return res.status(403).send(responseMessages[401].INVALID_TOKEN);
  }

  console.log("📦 Token recibido:", token);

  try {
    const decoded = await utils.verifyJWTToken(token, "access");
    console.log("✅ Token decodificado:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.warn(`❌ Usuario con ID ${decoded.id} no encontrado`);
      return res.status(404).send(responseMessages[404].NOT_FOUND);
    }

    console.log(`👤 Usuario verificado: ID ${user.id}`);
    req.session = { id: user.id };
    next();
  } catch (err: any) {
    console.error("💥 Error al verificar token:", err?.message || err || "Error desconocido");
    return res.status(401).send(responseMessages[401].UNAUTHORIZED);
  }
};

export default { verifyToken };
