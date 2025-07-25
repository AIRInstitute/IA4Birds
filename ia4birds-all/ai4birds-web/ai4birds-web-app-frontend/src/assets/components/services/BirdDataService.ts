import api from "./main";
import { getToken } from "@/utils/utils";

class BirdDataService {
    
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
         const response = await api.get("/data/ebird", {
            headers: {
                 "x-access-token": getToken(),
              },
        })
        return response;
    }

    async getDataBird() {
        const response = await api.get("/data/dataBird", {
            headers: {
                 "x-access-token": getToken(),
                },
        })
        return response;
    }

}

export default new BirdDataService();