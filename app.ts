import fetch, { Response } from "cross-fetch";
import { LocalStorage } from "node-localstorage";
import { jwtDecode } from "jwt-decode";
import { getPetData } from "./prompts";
import { TokenResponse, JWTType } from "./type";

export const localStorage = new LocalStorage("./token");

const data = {
  grant_type: "client_credentials",
  client_id: "xyzVpv5ZejFifWRcED1Ua8JAeEiIVHpSVemb4Q7acdmBVtnF8c",
  client_secret: "r8JkwSVHvD3ld6Oh9E77A8l6jlLeFdHj260nkFjX",
};

async function getToken() {
  try {
    const rawResponse: Response = await fetch(
      "https://api.petfinder.com/v2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseBody: TokenResponse = await rawResponse.json();

    const accessToken: string = responseBody.access_token;

    localStorage.setItem("access_token", accessToken);
    const decoded = jwtDecode<JWTType>(accessToken);

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log("sorry ,it is expired");
    } else {
      console.log("it is valid,u can proceed");

      localStorage.setItem("exp", decoded.exp.toString());

      await getPetData();
    }
  } catch (error) {
    console.error(error);
  }
}

getToken();
