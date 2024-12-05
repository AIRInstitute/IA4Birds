import api from "./main";

class UserDataService {
    
    async forgotPassword(email: string) {
        if(!email) {
            return {data: {error: "Please fill in all fields"}};
        }

        const response = await api.get(`/user/forgotPassword?email=${encodeURIComponent(email)}`);
        return response;
    }

    async resetPassword(token: string, password: string) {

        const response = await api.post(`/user/resetPassword?token=${encodeURIComponent(token)}`, {
            password: password,
        });
        return response;
    }

}

export default new UserDataService();