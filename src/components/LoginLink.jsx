import React from 'react';
import {Link} from "react-router-dom";
import useCookie from "../hooks/useCookie";
import cookieNames from "../constants/cookieNames";

const LoginLink = (props) => {
    const expirationSeconds = 5;

    const clickHandler = () => {
        const current_url = window.location.pathname;
        useCookie.set(cookieNames.url_before_auth, current_url, expirationSeconds);
    }

    return (
        <Link onClick={clickHandler} {...props}>{props.children}</Link>
    );
};

export default LoginLink;