import { expect } from "chai";
import { describe, it } from "mocha";
import { Request, Response } from "express";
import {
    findAll,
    findOne,
    updateUser,
    deleteUser,
    activateAccount,
    forgotPassword,
    resetPassword,
} from "../controllers/user.controller";
import { promiseTest } from "./test_common";
import bcrypt from "bcrypt";

import { User } from "../models/connection";
import utils from "../utils/utils";

const MOCK_USER_DATA = [
    {
        id: 1,
        name: "User One",
        email: "userone@example.com",
        // we don't care about the actual password, because the user controller
        // is not signing in (or otherwise reading from the password field).
        password: "hashedpassword",
        organization: "Organization One",
        description: "Description One",
        active: true,
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "User Two",
        email: "usertwo@example.com",
        password: "hashedpassword",
        organization: "Organization Two",
        description: "Description Two",
        active: false,
        createdAt: new Date(),
    },
    {
        id: 3,
        name: "User Three",
        email: "userthree@example.com",
        password: "hashedpassword",
        organization: "Organization Three",
        description: "Description Three",
        active: true,
        createdAt: new Date(),
    },
];
const USER_PRIVATE_FIELDS = ["password"];
const MOCK_USER_DATA_PUBLIC = MOCK_USER_DATA.map((user) =>
    Object.fromEntries(
        Object.entries(user).filter(
            ([key]) => !USER_PRIVATE_FIELDS.includes(key),
        ),
    ),
);

describe("User Controller", () => {
    before(async () => {
        // Make sure the user table exists in our in-memory db.
        await User.sync();
        return true;
    });

    let currentBody: any;
    afterEach(function () {
        if (this.currentTest?.state === "failed") {
            console.error("Test failed. Body contents:");
            console.error(currentBody);
        }
    });

    describe("empty database", () => {
        beforeEach(async () => {
            currentBody = null;

            // Clear the database before each test
            await User.destroy({ where: {} });
        });

        describe("findAll", () => {
            it("should return an empty list of users", async () => {
                const req = {} as Request;
                const { code, body } = await promiseTest(req, findAll);
                currentBody = body;
                expect(code).to.equal(204);
            });
        });
    });
    describe("populated database", () => {
        beforeEach(async () => {
            currentBody = null;
            // We make sure the database is populated with some data. To do that,
            // I remove all the users (they might have been modified by the
            // previous test) and then add the mock data.
            await User.destroy({ where: {} });
            await User.bulkCreate(MOCK_USER_DATA);
        });

        describe("findAll", () => {
            it("should return a list of users", async () => {
                const req = {} as Request;
                const { code, body } = await promiseTest(req, findAll);
                currentBody = body;
                expect(code).to.equal(200);
                expect(body).to.be.an("array");
                expect(body).to.be.deep.equal(MOCK_USER_DATA_PUBLIC);
            });
        });

        describe("findOne", () => {
            it("should return a user (correct id)", async () => {
                const req = { params: { id: 1 } } as unknown as Request;
                const { code, body } = await promiseTest(req, findOne);
                currentBody = body;
                expect(code).to.equal(200);
                expect(body).to.be.an("object");
                expect(body).to.be.deep.equal(MOCK_USER_DATA_PUBLIC[0]);
            });
            it("should return 404 (incorrect id)", async () => {
                const req = { params: { id: 999 } } as unknown as Request;
                const { code, body } = await promiseTest(req, findOne);
                currentBody = body;
                expect(code).to.equal(404);
            });
            it("should return 400 (missing id)", async () => {
                const req = {} as Request;
                const { code, body } = await promiseTest(req, findOne);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });

        describe("updateUser", () => {
            it("should update a user", async () => {
                const req = {
                    params: { id: 1 },
                    body: { name: "New Name" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user was actually updated in the database
                const updatedUser = await User.findByPk(1);
                expect(updatedUser).to.be.an("object");
                expect(updatedUser.name).to.equal("New Name");
            });
            it("should return 404 (incorrect id)", async () => {
                const req = {
                    params: { id: 999 },
                    body: { name: "New Name" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(404);
            });
            it("should fail if no fields are provided", async () => {
                const req = { params: { id: 1 } } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(400);
            });
            it("should fail if ids don't match", async () => {
                const req = {
                    params: { id: 1 },
                    body: { id: 999 },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(400);
            });
            it("should return 400 (missing id)", async () => {
                const req = {
                    body: { name: "New Name" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(400);
            });
            it("should return 409 (email conflict)", async () => {
                const req = {
                    params: { id: 1 },
                    body: { email: "usertwo@example.com" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, updateUser);
                currentBody = body;
                expect(code).to.equal(409);
            });
        });
        describe("deleteUser", () => {
            it("should delete a user", async () => {
                const req = { params: { id: 1 } } as unknown as Request;
                const { code, body } = await promiseTest(req, deleteUser);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user was actually deleted from the database
                const deletedUser = await User.findByPk(1);
                expect(deletedUser).to.be.null;
            });
            it("should return 404 (incorrect id)", async () => {
                const req = { params: { id: 999 } } as unknown as Request;
                const { code, body } = await promiseTest(req, deleteUser);
                currentBody = body;
                expect(code).to.equal(404);
            });
            it("should return 400 (missing id)", async () => {
                const req = {} as Request;
                const { code, body } = await promiseTest(req, deleteUser);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });

        describe("activateAccount", () => {
            it("should activate an account", async () => {
                // Create a token for the user
                const token = await utils.generateJWTToken(2, "activation");

                const req = { query: { token } } as unknown as Request;
                const { code, body } = await promiseTest(req, activateAccount);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user was actually activated in the database
                const updatedUser = await User.findByPk(2);
                expect(updatedUser).to.be.an("object");
                expect(updatedUser.active).to.be.true;
            });
            it("should return 401 (incorrect token (access))", async () => {
                const token = await utils.generateJWTToken(2, "access");
                const req = {
                    query: { token },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, activateAccount);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 401 (incorrect token (reset))", async () => {
                const token = await utils.generateJWTToken(2, "reset");
                const req = {
                    query: { token },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, activateAccount);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 401 (invalid token)", async () => {
                const req = {
                    query: { token: "invalidtoken" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, activateAccount);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 400 (missing id)", async () => {
                const req = {} as Request;
                const { code, body } = await promiseTest(req, activateAccount);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });

        describe("forgotPassword", () => {
            // I haven't had time to implement this yet, so I'm just keeping it
            // as a placeholder for now.
            // We have to mock the email sending to test this.
            // A good option would probably to do something similar to what I've
            // done in connection.ts, where it checks if the environment is
            // "test" and then has another database.
        });

        describe("resetPassword", () => {
            it("should change the password", async () => {
                // Create a token for the user
                const token = await utils.generateJWTToken(2, "reset");

                const req = {
                    query: { token },
                    body: { password: "newpassword" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user's password was actually reset in the database
                const updatedUser = await User.findByPk(2);
                expect(updatedUser).to.be.an("object");
                const result = await bcrypt.compare(
                    "newpassword",
                    updatedUser.password,
                );
                expect(result).to.be.true;
            });
            it("should return 401 (incorrect token (access))", async () => {
                const token = await utils.generateJWTToken(2, "access");
                const req = {
                    query: { token },
                    body: { password: "newpassword" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 401 (incorrect token (activation))", async () => {
                const token = await utils.generateJWTToken(2, "activation");
                const req = {
                    query: { token },
                    body: { password: "newpassword" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 401 (invalid token)", async () => {
                const req = {
                    query: { token: "invalid" },
                    body: { password: "newpassword" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 400 (missing token)", async () => {
                const req = {
                    body: { password: "newpassword" },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(400);
            });
            it("should return 400 (missing password)", async () => {
                const token = await utils.generateJWTToken(2, "reset");
                const req = { query: { token } } as unknown as Request;
                const { code, body } = await promiseTest(req, resetPassword);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });
    });
});
