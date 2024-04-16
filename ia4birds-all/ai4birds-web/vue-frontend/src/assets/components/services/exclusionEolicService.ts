import api from "./main";
//import { getToken } from "@/utils/utils";

class ExclusionEolicService {
    // async login(user: { username: string, password: string }) {
    //     const response = await api.post("/auth/signin", {
    //         username: user.username,
    //         password: user.password,
    //     });
    //     return response;
    // }

    // async loginGoogle(token: string) {
    //     const response = await api.post("/auth/google", {
    //         token: token,
    //     });
    //     return response;
    // }


    // async loginGithub(token: string) {
    //     const response = await api.post("/auth/github", {
    //         token: token,
    //     });
    //     return response;
    // }

    // async register(user: any) {
    //     const response = await api.post("/auth/signup", {
    //         username: user.username,
    //         email: user.email,
    //         name: user.name,
    //         surname: user.surname,
    //         password: user.password,
    //     });
    //     return response;
    // }

    async getExclusionMap() {
         const response = await api.get("/data/exclusionmap", {
            headers: {
        //         "x-access-token": getToken(),
              },
        })
        return response;
    }

}

export default new ExclusionEolicService();