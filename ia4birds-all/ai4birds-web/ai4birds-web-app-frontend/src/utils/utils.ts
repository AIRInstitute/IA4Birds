export const getToken = (): string => {
  return localStorage.getItem("accessToken") || "";
};