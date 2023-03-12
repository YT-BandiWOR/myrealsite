import React from 'react';
import cls from './Page.module.scss'

const inforText = [
    [
        '1) Общие сведения',
        'Сайт был создан в исключительно демонстративных целях\nИ точка.',
        'Сайт был создан в исключительно демонстративных целях\nИ точка.',
        'Сайт был создан в исключительно демонстративных целях\nИ точка.',
        'Сайт был создан в исключительно демонстративных целях\nИ точка.',
    ],
    [
        '1.1) Об авторе',
        'Автор этого сайта - человек, как не удивительно!'
    ],
    [
        '1.2) Конец'
    ]
]

const Paragraph = ({
                       content, key_=1
                   }) => {
    if (content === null) return <div key={key_}/>
    if (content.length === 1) return (
        <div key={key_} className={cls.paragraph}>
            <h1>{content[0]}</h1>
        </div>
    )

    return (
        <div key={key_} className={cls.paragraph}>
            <h1>{content[0]}</h1>
            <div className={cls.text}>
                {
                    content.slice(1).map((el, id)=>(
                        <p key={id}>{el}</p>
                    ))
                }
            </div>
        </div>
    )
}

const Modal = (
    {
        state, text
    }) => {
    const [opened, setOpened] = state;

    if (opened) {
        return (
            <div className={cls.modal}>
                <div className={cls.header}>
                    <div/>
                    <h1>Дополнительные сведения</h1>
                    <span className={cls.close} onClick={
                        ()=>{setOpened(false)}
                    }>X</span>
                </div>
                <div className={cls.content}>
                    {
                        text.map((el, id)=>(
                            <Paragraph key_={id} content={el}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

const Header = () => {

}

const Content = () => {
    return (
        <div className={cls.content}>

        </div>
    )
}


const Index = () => {
    return (
        <>
            <Header/>
            <Content/>
        </>
    );
};

export default Index;