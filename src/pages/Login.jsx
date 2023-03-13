import React, {useEffect, useState} from 'react';
import cls from './Page.module.scss'
import {Link, Navigate} from "react-router-dom";
import BACKENDURLS from "../auth/BACKEND_ENDPOINTS";
import useCookie from "../hooks/useCookie";
import useStorage from "../hooks/useStorage";
import request from "../scripts/request";
import cookieNames from "../constants/cookieNames";


const Index = () => {
    const placeholder_name = 'Введите имя';
    const placeholder_password = 'Введите пароль';
    const login_text = 'Войти';
    const form_title = 'Авторизация';
    const register_text = 'Регистрация';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authOk, setAuthOk] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [response, setResponse] = useState({});
    const [error, setError] = useState(null);
    const [redirectToAfterAuth, setRedirectToAfterAuth] = useState('/');

    const login = async (e) => {
        e.preventDefault();
        request(BACKENDURLS.url+BACKENDURLS.login, [isLoaded, setIsLoaded], [response, setResponse], [error, setError], {
            username, password
        })
    }

    useEffect(()=>{
        const url_before_auth = useCookie.get(cookieNames.url_before_auth);
        if (url_before_auth) {
            setRedirectToAfterAuth(url_before_auth);
            useCookie.remove(cookieNames.url_before_auth);
        }
    }, [])

    useEffect(()=>{
        if (response.data) {
            const {accessToken, refreshToken} = response.data;

            useCookie.set("accessToken", accessToken, useCookie.getExpTime(accessToken));
            useStorage.set("refreshToken", refreshToken, useCookie.getExpTime(refreshToken));
            setUsername('');
            setPassword('');
            setAuthOk(true);
        }
    }, [response])

    useEffect(()=>{
        if (error) {
            setFormError(error.response.data.error);
        }

    }, [error])

    if (authOk)
        return <Navigate to={redirectToAfterAuth}/>

    else return (
        <div className={cls.auth_content} onSubmit={login}>
            <form className={cls.auth_form}>
                <h1 className={cls.title}>{form_title}</h1>
                <input onChange={e => setUsername(e.target.value)} value={username} className={cls.input_field} type="text" placeholder={placeholder_name}/>
                <input onChange={e => setPassword(e.target.value)} value={password} className={cls.input_field} type="password" placeholder={placeholder_password}/>
                <button className={cls.current_action_btn} type={"submit"}>{login_text}</button>
            </form>
            {
                formError && (
                    <div className={cls.form_errors}>
                        {formError}
                    </div>
                )
            }
            <div className={cls.special_links}>
                <Link to={'/register'} className={cls.other_action_btn}>{register_text}</Link>
            </div>
        </div>
    )
};

export default Index;