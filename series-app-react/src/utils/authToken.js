import { parseCookies } from "nookies";

export const getTokenFromCookies = () => {
  const nonBrowser = () => typeof window === "undefined";
  let token = nonBrowser() ? "" : parseCookies().token;

  return token;
};
