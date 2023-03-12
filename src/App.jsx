import React from 'react';
import Index from "./pages/Index";
import cls from './App.module.scss'
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import More from "./pages/More";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
    return (
        <div className={cls.app}>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Index/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/more'} element={<More/>}/>
            </Routes>
            <Footer/>
        </div>
    );
};

export default App;