import api from "./main";
//import { getToken } from "@/utils/utils";

class ExclusionEolicService {
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

    async getExclusionMap() {
         const response = await api.get("/data/exclusionmap/zip", {
            headers: {
        //         "x-access-token": getToken(),
              },
        })
        return response;
    }  
    
    async getExclusionResourcesMap(body) {
         const response = await api.post("/data/windmap", body
         //{
    //        headers: {
    //    //         "x-access-token": getToken(),
    //          },
       //}
       )
       return response;
   } 

}

export default new ExclusionEolicService();
