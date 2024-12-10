import { expect } from "chai";
import { describe, it } from "mocha";
import { Request, Response } from "express";
import { signin, signup } from "../controllers/auth.controller";
import { promiseTest } from "./test_common";
import bcrypt from "bcrypt";

import { User } from "../models/connection";
import utils from "../utils/utils";

const getMockUsers = async () => [
    {
        id: 1,
        name: "User One",
        email: "userone@example.com",
        password: await utils.bcryptPassword("password1"),
        organization: "Organization One",
        description: "Description One",
        active: true,
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "User Two",
        email: "usertwo@example.com",
        password: await utils.bcryptPassword("password2"),
        organization: "Organization Two",
        description: "Description Two",
        active: false,
        createdAt: new Date(),
    },
    {
        id: 3,
        name: "User Three",
        email: "userthree@example.com",
        password: await utils.bcryptPassword("password3"),
        organization: "Organization Three",
        description: "Description Three",
        active: true,
        createdAt: new Date(),
    },
];

describe("Auth Controller", () => {
    let mock_user_data: Record<string, any>[];
    before(async () => {
        // Make sure the user table exists in our in-memory db.
        await User.sync();
        mock_user_data = await getMockUsers();
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

        describe("signin", () => {
            it("should not find user", async () => {
                const req = {
                    body: {
                        email: "userone@example.com",
                        password: "password1",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signin);
                currentBody = body;
                expect(code).to.equal(404);
            });
        });
        describe("signup", () => {
            it("should create a new user", async () => {
                const req = {
                    body: {
                        name: "New User",
                        email: "userfour@example.com",
                        password: "password4",
                        organization: "Organization Four",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signup);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user was actually created in the database
                const newUser = await User.findOne({
                    where: { email: "userfour@example.com" },
                });
                expect(newUser).to.be.an("object");
                expect(newUser?.name).to.equal("New User");
                expect(newUser?.email).to.equal("userfour@example.com");
                expect(newUser?.organization).to.equal("Organization Four");
                const result = await bcrypt.compare(
                    "password4",
                    newUser?.password,
                );
                expect(result).to.be.true;
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
            await User.bulkCreate(mock_user_data);
        });

        describe("signin", () => {
            it("should log in a user", async () => {
                const req = {
                    body: {
                        email: "userone@example.com",
                        password: "password1",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signin);
                currentBody = body;
                expect(code).to.equal(200);
                expect(body).to.be.an("object");
                expect(body).to.have.property("id");
                expect(body.id).to.be.equal(1);
                expect(body).to.have.property("name");
                expect(body.name).to.be.equal("User One");
                expect(body).to.have.property("email");
                expect(body.email).to.be.equal("userone@example.com");
                expect(body).to.have.property("accessToken");
                const decoded = await utils.verifyJWTToken(body.accessToken);
                expect(decoded.id).to.be.equal(1);
                expect(decoded.intent).to.be.equal("access");
            });
            it("should return 401 (incorrect password)", async () => {
                const req = {
                    body: {
                        email: "userone@example.com",
                        password: "wrongpassword",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signin);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 401 (inactive user)", async () => {
                const req = {
                    body: {
                        email: "usertwo@example.com",
                        password: "password2",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signin);
                currentBody = body;
                expect(code).to.equal(401);
            });
            it("should return 400 (missing email)", async () => {
                const req = {
                    body: {
                        password: "password1",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signin);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });

        describe("signup", () => {
            it("should create a new user", async () => {
                const req = {
                    body: {
                        name: "New User",
                        email: "userfour@example.com",
                        password: "password4",
                        organization: "Organization Four",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signup);
                currentBody = body;
                expect(code).to.equal(200);

                // Check that the user was actually created in the database
                const newUser = await User.findOne({
                    where: { email: "userfour@example.com" },
                });
                expect(newUser).to.be.an("object");
                expect(newUser?.name).to.equal("New User");
                expect(newUser?.email).to.equal("userfour@example.com");
                expect(newUser?.organization).to.equal("Organization Four");
                const result = await bcrypt.compare(
                    "password4",
                    newUser?.password,
                );
                expect(result).to.be.true;
                expect(newUser?.active).to.be.false;
                expect(newUser?.createdAt).to.be.a("Date");
            });
            it("should return 400 (missing email)", async () => {
                const req = {
                    body: {
                        name: "New User",
                        password: "password4",
                        organization: "Organization Four",
                    },
                } as unknown as Request;
                const { code, body } = await promiseTest(req, signup);
                currentBody = body;
                expect(code).to.equal(400);
            });
        });
    });
});
