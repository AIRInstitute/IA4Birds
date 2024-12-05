import swaggerAutogen from "swagger-autogen";
import { doc, autogenConfig } from "../config/swagger.config";

const outputFile = "./documentation/swagger.json";
const routes = ["./routes/index.ts"];

export default () => swaggerAutogen(autogenConfig)(outputFile, routes, doc);
