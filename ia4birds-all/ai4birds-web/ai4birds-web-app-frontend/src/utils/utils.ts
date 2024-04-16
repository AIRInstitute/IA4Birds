export const getToken = (): string => {
    const user = localStorage.getItem("user");
    if (user) {
      const userJson = JSON.parse(user);
      if (userJson && userJson.accessToken) {
        return userJson.accessToken;
      }
      return "";
    }
    return "";
  };