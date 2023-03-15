import React, {useEffect, useState} from 'react';
import cls from './Header.module.scss'
import BACKENDURLS from "../auth/BACKEND_ENDPOINTS";
import request from "../scripts/request";
import LoginLink from "./LoginLink";
import GoLink from "./GoLink";

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
                    <GoLink
                        key={id}
                        to={el[1]}
                    >{el[0]}</GoLink>
                ))
            }
            <br/>
            {
                authorized?
                    (
                        <div className={cls.authorized}>
                            <GoLink to="/account">{account.name}</GoLink>
                        </div>
                    ) : (
                        <div className={cls.non_authorized}>
                            <LoginLink to="/login">{loginText}</LoginLink>
                        </div>
                    )
            }
            <h1 style={{textAlign: 'right', color: 'rgba(255,255,255,.4)', cursor: "pointer"}} onClick={()=>setOpened(false)}>Скрыть</h1>
        </div>
    )

}

const Header = ({
    elements= [
        ['Создать', '/create'],
        ['Поиск', '#/search'],
        ['О нас', '#/about'],
        ['Помощь', '#/help']
    ],
    logoName='Калдыбага',
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
        if (response?.data?.username !== undefined && response?.data?.username !== null) {
            setAccount({name: response.data.username});
            setAuthorized(true);
        } else {
            setAccount(null);
            setAuthorized(false);
        }
    }, [response])

    const menuToggle = () => {
      setMenuOpened(!menuOpened);
    }

    if (isMobile)
        return (
            <>
                <header className={cls.header}>
                    <GoLink to="/" className={cls.logo}>{logoName}</GoLink>
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
            <GoLink to="/" className={cls.logo}>{logoName}</GoLink>
            <div className={cls.links}>
            {
                elements.map((el,id)=>(
                    <GoLink
                        className={cls.link}
                        key={id}
                        to={el[1]}
                    >{el[0]}</GoLink>
                ))
            }
            </div>
            {
                authorized?
                    (
                        <div className={cls.authorized}>
                            <GoLink to="#">{account.name}</GoLink>
                        </div>
                    ) : (
                        <div className={cls.non_authorized}>
                            <LoginLink to="/login">{loginText}</LoginLink>
                        </div>
                    )
            }
        </header>
    );
};

export default Header;