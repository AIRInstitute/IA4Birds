import { User } from "../models/connection";

const insertDefaultUser = async () => {
  const defaultUserData = {
    id: 1,
    name: "ia4birds",
    email: "ia4birds@air-institute.com",
    password: "$2b$10$/Px0zYI/eG7nOf7QTa9wpu10yNjlH8LetQYdZ9TflCaHHHJL9cxBC", 
    organization: "AirInstitute",
    description: "Cuenta administrador",
    createdAt: new Date("2024-11-27T09:18:22.037Z"),
    active: true,
    ocupation: null,
    entity: "public" as const,
  };

  try {
    const existing = await User.findOne({ where: { email: defaultUserData.email } });
    if (existing) {
      console.log("Default user already exists.");
      return;
    }

    await User.create(defaultUserData);
    console.log("Default user created successfully.");
  } catch (error) {
    console.error("Error creating default user:", error);
  }
};

export default insertDefaultUser;
