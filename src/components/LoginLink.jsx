import React from 'react';
import {Link} from "react-router-dom";
import useCookie from "../hooks/useCookie";
import cookieNames from "../constants/cookieNames";

const LoginLink = (props) => {
    return (
        <Link
            onClick={() => {
            const current_url = window.location.pathname;
            useCookie.set(cookieNames.url_before_auth, current_url, 5);
            }}
            {...props}>{props.children}</Link>
    );
};

export default LoginLink;