import { Request, Response, NextFunction, Express, Router } from 'express'
import authMiddleware from "../../middleware/auth.middleware";
import * as controller from '../../controllers/product.controllers'

export default function () {
  const defaultRouter = Router();

  return defaultRouter
}
