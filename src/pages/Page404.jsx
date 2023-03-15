import React, {useEffect, useState} from 'react';
import cls from './Page.module.scss';
import {Link} from "react-router-dom";
import useCookie from "../hooks/useCookie";
import cookieNames from "../constants/cookieNames";
import GoLink from "../components/GoLink";

const Page404 = () => {
    const this_page_doesnt_exists = 'Эта страница не существует (возможно удалена), либо была перемещена.'
    const [backUrl, setBackUrl] = useState('/');

    useEffect(()=>{
        const back_url = useCookie.pop(cookieNames.last_url);
        if (back_url) {
            setBackUrl(back_url);
        }
    }, [])

    return (
        <div className={cls.http_content}>
            <h1 className={cls.error}>404</h1>
            <p className={cls.description}>{this_page_doesnt_exists}</p>
            <GoLink to={backUrl} className={cls.back_link}>Вернуться назад</GoLink>
        </div>
    );
};

export default Page404;