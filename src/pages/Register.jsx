import React, {useEffect, useState} from 'react';
import cls from './Page.module.scss'
import {Link, Navigate} from "react-router-dom";
import BACKENDURLS from "../auth/BACKEND_ENDPOINTS";
import request from "../scripts/request";
import useCookie from "../hooks/useCookie";
import cookieNames from "../constants/cookieNames";
import GoLink from "../components/GoLink";

const Index = () => {
    const placeholder_email = 'Введите почту';
    const placeholder_name = 'Введите имя';
    const placeholder_password = 'Введите пароль';
    const placeholder_repeat_password = 'Повторите пароль';
    const login_text = 'Войти';
    const form_title = 'Регистрация';
    const do_register_text = 'Вход!';
    const passwords_not_equals = 'Введённые Вами пароли не совпадают.';

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [regLoaded, setRegLoaded] = useState(false);
    const [regResponse, setRegResponse] = useState({});
    const [regError, setRegError] = useState(null);

    const [formError, setFormError] = useState(null);
    const [serverErrors, setServerErrors] = useState([]);

    const [regSuccess, setRegSuccess] = useState(false);

    const register = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setFormError(passwords_not_equals);
            return;
        }

        request(BACKENDURLS.url+BACKENDURLS.register,
            [regLoaded, setRegLoaded],
            [regResponse, setRegResponse],
            [regError, setRegError],
            {username, password, email});
    }

    useEffect(()=>{
        if (regError) {
            setServerErrors(regError.response.data.errors);

            if (regError.response.data.error) {
                setFormError(regError.response.data.error);
            }
        }

    }, [regError])

    useEffect(()=>{
        if (regResponse.status === 201) {
            setRegSuccess(true);
        }
    }, [regResponse])

    if (regSuccess) {
        useCookie.set(cookieNames.registration_username, username, 5);
        useCookie.set(cookieNames.registration_password, password, 5);

        return <Navigate to={"/login"}/>
    }
    else return (
        <div className={cls.auth_content}>
            <form className={cls.auth_form} onSubmit={register}>
                <h1 className={cls.title}>{form_title}</h1>
                <input required={true} onChange={e => setEmail(e.target.value)} value={email} className={cls.input_field} type="email" placeholder={placeholder_email}/>
                <input required={true} onChange={e => setUsername(e.target.value)} value={username} className={cls.input_field} type="text" placeholder={placeholder_name}/>
                <input required={true} onChange={e => setPassword(e.target.value)} value={password} className={cls.input_field} type="password" placeholder={placeholder_password}/>
                <input required={true} onChange={e => setRepeatPassword(e.target.value)} value={repeatPassword} className={cls.input_field} type="password" placeholder={placeholder_repeat_password}/>
                <button type={"submit"} className={cls.current_action_btn}>{do_register_text}</button>
            </form>
            {
                formError && (
                    <div className={cls.form_errors}>
                        {formError}
                    </div>
                )
            }

            {
                serverErrors && serverErrors.map((el, id) => (
                    <div className={cls.form_errors} key={id}>
                        <span style={{color: "yellow"}}>{el.param}</span> {el.msg}
                    </div>
                ))
            }

            <div className={cls.special_links}>
                <GoLink to={'/login'} className={cls.other_action_btn}>{login_text}</GoLink>
            </div>
        </div>
    );
};

export default Index;