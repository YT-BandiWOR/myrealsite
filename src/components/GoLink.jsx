import React from 'react';
import {Link} from "react-router-dom";
import useCookie from "../hooks/useCookie";
import cookieNames from "../constants/cookieNames";

const GoLink = (props) => {
    return (
        <Link
            onClick={() => {
                const last_site_url = window.location.pathname;
                useCookie.set(cookieNames.last_url, last_site_url, 3600 * 24 * 7);
                console.log(useCookie.get(cookieNames.last_url));
            }}
            {...props}>{props.children}</Link>
    );
};

export default GoLink;