import api from "./main";

class AuthDataService {
    
    // async loginGoogle(token: string) {
    //     const response = await api.post("/auth/google", {
    //         token: token,
    //     });
    //     return response;
    // }

    async login(user: { email: string, password: string }) {
        if(!user.email || !user.password) {
            return {data: {error: "Please fill in all fields"}};
        }

        const response = await api.post("/auth/signin", {
            email: user.email,
            password: user.password,
        });
        return response;
    }

    async register(user: { email: string, name: string, surnames: string, username: string, password: string }) {
        const response = await api.post("/auth/signup", {
            username: user.username,
            email: user.email,
            name: user.name,
            surname: user.surnames,
            password: user.password,
        });
        return response;
    }

    async requestAdmin(user: { email: string, description: string }) {
        if(!user.email || !user.description) {
            return {data: {error: "Please fill in all fields"}};
        }

        const response = await api.post("/auth/request-admin", {
            email: user.email,
            description: user.description,
        });
        return response;
    }

}

export default new AuthDataService();