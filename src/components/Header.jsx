import React, {useEffect, useState} from 'react';
import cls from './Header.module.scss'
import {Link} from "react-router-dom";
import BACKENDURLS from "../auth/BACKENDURLS";
import request from "../scripts/request";

const MobileMenu = ({
    account=null,
    menuState,
    loginText,
    elements
                    }) => {

    const authorized = account !== null;
    const [opened, setOpened] = menuState;

    if (opened) return  (
        <div className={cls.mobile_menu}>
            {
                elements.map((el, id)=>(
                    <Link
                        key={id}
                        to={el[1]}
                    >{el[0]}</Link>
                ))
            }
            <br/>
            {
                authorized?
                    (
                        <div className={cls.authorized}>
                            <Link to="/account">{account.name}</Link>
                        </div>
                    ) : (
                        <div className={cls.non_authorized}>
                            <Link to="/login">{loginText}</Link>
                        </div>
                    )
            }
            <h1 style={{textAlign: 'right', color: 'rgba(255,255,255,.4)', cursor: "pointer"}} onClick={()=>setOpened(false)}>Скрыть</h1>
        </div>
    )

}

const Header = ({
    elements= [
        ['Создать', '#/create'],
        ['Поиск', '#/search'],
        ['О нас', '#/about'],
        ['Помощь', '#/help']
    ],
    logoName='Saiwor',
    loginText='Войти',
    menuCaption='Меню'
}) => {
    const isMobile = window.innerWidth <= 800;
    const [menuOpened, setMenuOpened] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [account, setAccount] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(()=>{
        request(BACKENDURLS.url+BACKENDURLS.me, [isLoaded, setIsLoaded],
            [response, setResponse], [error, setError]);
    }, [])

    useEffect(()=>{
        console.log('data', response);

        if (response?.data?.username !== undefined && response?.data?.username !== null) {
            setAccount({name: response.data.username});
            setAuthorized(true);
        } else {
            setAccount(null);
            setAuthorized(false);
        }
    }, [response])

    const menuToggle = (e) => {
      setMenuOpened(!menuOpened);
    }

    if (isMobile)
        return (
            <>
                <header className={cls.header}>
                    <Link to="/" className={cls.logo}>{logoName}</Link>
                    <button
                        onClick={menuToggle}
                        className={cls.openMenu}
                    >
                        {menuCaption}
                    </button>
                </header>
                <MobileMenu
                    account={account} menuState={[menuOpened, setMenuOpened]} loginText={loginText} elements={elements}
                />
            </>
        )
    else return (
        <header className={cls.header}>
            <Link to="/" className={cls.logo}>{logoName}</Link>
            <div className={cls.links}>
            {
                elements.map((el,id)=>(
                    <Link
                        className={cls.link}
                        key={id}
                        to={el[1]}
                    >{el[0]}</Link>
                ))
            }
            </div>
            {
                authorized?
                    (
                        <div className={cls.authorized}>
                            <Link to="#">{account.name}</Link>
                        </div>
                    ) : (
                        <div className={cls.non_authorized}>
                            <Link to="/login">{loginText}</Link>
                        </div>
                    )
            }
        </header>
    );
};

export default Header;