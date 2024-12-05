import globalConfig from "./global.config";

const doc = {
    info: {
        title: "IA4BIRDS API",
        version: "1.0.0",
        description: "API documentation for IA4BIRDS project",
    },
    servers: [
        {
            url: `${globalConfig.backendURL}/`,
            description: "Backend server",
        },
    ],
    basePath: "/api",
    schemes: [globalConfig.ssl.cert !== "cert" ? "https" : "http"],
    accessTokenAuth: {
        type: "apiKey",
        in: "header", // can be 'header', 'query' or 'cookie'
        name: "x-access-token", // name of the header, query parameter or cookie
        description: "JWT token",
    },
    components: {
        schemas: {
            User: {
                id: 1,
                name: "Fernando Paredes",
                email: "fernando@empresa.es",
                organization: "Empresa",
                description: "Descripción",
                active: true,
                createdAt: "2024-12-25T09:00:00",
            },
            UserSignup: {
                name: "Fernando Paredes",
                email: "fernando@empresa.es",
                password: "password",
                organization: "Empresa",
            },
            UserSignin: {
                email: "fernando@empresa.es",
                password: "password",
            },
            AuthGuardResponse: {
                auth: false,
            },
            TextMessage: "Text",
        },
        parameters: {
            id: {
                name: "id",
                in: "path",
                description: "The id of the user to access",
                required: true,
                schema: {
                    type: "integer",
                },
            },
            token: {
                name: "token",
                in: "query",
                required: true,
            },
        },
        responses: {
            MissingEmptyInvalidParameters: {
                description:
                    "Missing, empty or invalid parameters, query or body",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            InvalidQueryToken: {
                description: "Invalid token provided in query",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            InternalServerError: {
                description: "Internal server error",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            UserNotFound: {
                description: "User not found",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            EmailInUse: {
                description: "Email already in use",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            InvalidAccessToken: {
                description: "Access token not provided or invalid",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            InvalidPassword: {
                description: "Invalid password",
                content: {
                    "text/plain": {
                        schema: {
                            $ref: "#/components/schemas/TextMessage",
                        },
                    },
                },
            },
            AuthGuardResponse: {
                description: "Authorization status",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/AuthGuardResponse",
                        },
                    },
                },
            },
        },
    },
};

const autogenConfig = {
    openapi: "3.0.0",
    writeOutputFile: false,
};

export { doc, autogenConfig };
