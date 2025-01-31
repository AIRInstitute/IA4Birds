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

    // async register(user: { email: string, name: string, surnames: string, username: string, password: string, organization: string }) {
    //     const response = await api.post("/auth/signup", {
    //         username: user.username,   
    //         name: user.name,
    //         email: user.email,
    //         surname: user.surnames,
    //         password: user.password,
    //         organization: user.organization
    //     });
    //     return response;
    // }

    async register(user: { email: string, name: string, password: string, organization: string, entity: string }) {
        const response = await api.post("/auth/signup", {
            name: user.name,
            email: user.email,
            password: user.password,
            organization: user.organization,
            entity: user.entity
        });
        return response;
    }

    async requestAdmin(user: { email: string, organization: string, entity: string, description: string }) {
        const response = await api.post("/auth/activate-account", {
            email: user.email,
            organization: user.organization,
            entity: user.entity,
            description: user.description,
        });
        return response;
    }

    async acceptRequestAdmin(user: { email: string, description: string }) {
        const response = await api.post("/auth/confirm-activation", {
            email: user.email,
            description: user.description,
        });
        return response;
    }

    async declineRequestAdmin(user: { email: string}) {
        const response = await api.post("/auth/reject-account", {
            email: user.email,
        });
        return response;
    }

}

export default new AuthDataService();