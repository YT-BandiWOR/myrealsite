import jwtDecode from 'jwt-decode';

const get = (name) => {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

const set = (name, value, expirationSeconds) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expirationSeconds * 1000));
    const expirationString = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expirationString + ";path=/";
}

const pop = (name) => {
    const data = get(name);
    remove(name);
    return data;
}

const getExpTime = (jwt) => {
    let decoded_token = jwtDecode(jwt);
    return decoded_token.exp - decoded_token.iat;
}

const remove = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const functions = {set, get, pop, remove, getExpTime};
export default functions;