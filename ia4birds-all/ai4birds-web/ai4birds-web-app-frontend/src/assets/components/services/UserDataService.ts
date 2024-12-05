import api from "./main";

class UserDataService {
    
    async forgotPassword(email: string) {
        if(!email) {
            return {data: {error: "Please fill in all fields"}};
        }

        const response = await api.post("/user/forgot-password", {
            email: email,
        });
        return response;
    }

}

export default new UserDataService();