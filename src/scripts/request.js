import axios from "axios";
import BACKEND_ENDPOINTS from "../auth/BACKEND_ENDPOINTS";
import useCookie from "../hooks/useCookie";
import useStorage from "../hooks/useStorage";
import cookieNames from "../constants/cookieNames";
import storageNames from "../constants/storageNames";

const refreshUrl = BACKEND_ENDPOINTS.url+BACKEND_ENDPOINTS.refreshToken;


const getTokens = () => {
    return [useCookie.get(cookieNames.access_token), useStorage.get(storageNames.refresh_token)];
}

const getNewAccessToken = async (url, refresh, setError) => {
    try {
        const response = await axios.post(url, {
            refreshToken: refresh
        })

        return response.data.accessToken;

    } catch (error) {
        console.error(error);
        setError(error)
        return null;
    }
}

const sendPostRequest = async (url, body, headers, [isLoaded, setIsLoaded], [response, setResponse], [_, setError]) => {
    try {
        const _response = await axios.post(url, body, {
            headers: headers
        });
        setResponse(_response);
        setIsLoaded(true);

    } catch (error) {
        setIsLoaded(true);
        setError(error);
    }
}

const request = (
    url, [isLoaded, setIsLoaded], [response, setResponse], [error, setError], body={}, _headers={}
) => {
    const request_func = async () => {
        const [accessToken, refreshToken] = getTokens();

        if (accessToken !== null) {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                ..._headers
            }

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);

        } else if (refreshToken != null) {
            const newAccessToken = await getNewAccessToken(refreshUrl, refreshToken, setError);
            const cookieExpTime = useCookie.getExpTime(newAccessToken);
            useCookie.set(cookieNames.access_token, newAccessToken, cookieExpTime);

            const headers = {
                Authorization: `Bearer ${newAccessToken}`,
                ..._headers
            }

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);

        } else {
            const headers = {
                ..._headers
            }

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);
        }
    }
    void request_func();
}

export default request;