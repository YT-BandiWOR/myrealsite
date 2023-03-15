import React from 'react';
import cls from './Footer.module.scss'
import GoLink from "./GoLink";


const Footer = ({
    moreText="Дополнительно",
    footerText="Все права сайта защищены 2023©"
                }) => {

    return (
        <>
            <div className={cls.footer}>
                <br/>
                <p>{footerText}</p>
                <GoLink to={'/more'}>{moreText}</GoLink>
            </div>
        </>
    );
};

export default Footer;