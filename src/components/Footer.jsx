import React from 'react';
import cls from './Footer.module.scss'
import {Link} from "react-router-dom";


const Footer = ({
    moreText="Дополнительно",
    footerText="Все права сайта защищены 2023©"
                }) => {

    return (
        <>
            <div className={cls.footer}>
                <br/>
                <p>{footerText}</p>
                <Link to={'/more'}>{moreText}</Link>
            </div>
        </>
    );
};

export default Footer;