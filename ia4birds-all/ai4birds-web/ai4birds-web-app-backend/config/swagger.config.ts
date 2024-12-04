const doc = {
    info: {
        title: "IA4BIRDS API",
        version: "1.0.0",
        description: "API documentation for IA4BIRDS project",
    },
    servers: [
        {
            url: "http://localhost:3030/",
            description: "Development server",
        },
    ],
    basePath: "/",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
};

const autogenConfig = {
    openapi: "3.0.0",
    writeOutputFile: false,
};

export { doc, autogenConfig };
