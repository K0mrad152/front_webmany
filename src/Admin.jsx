import React, { useEffect, useRef, useState } from "react";
import { axiinstance } from "./config.jsx";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { floatToStr } from "./utils.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";
import moment from 'moment';
import ChoiceModal from "./components.jsx";
import BalanceEditModal from "./CompBalansModul.jsx";
import StatusEditModal from "./StatusModu.jsx";





const fullscreenEnterSvg = 'M18.5,5.5 L16,5.5 C15.1716,5.5 14.5,4.82843 14.5,4 C14.5,3.17157 15.1716,2.5 16,2.5 L19,2.5 C20.3807,2.5 21.5,3.61929 21.5,5 L21.5,8 C21.5,8.82843 20.8284,9.5 20,9.5 C19.1716,9.5 18.5,8.82843 18.5,8 L18.5,5.5 Z M8,5.5 L5.5,5.5 L5.5,8 C5.5,8.82843 4.82843,9.5 4,9.5 C3.17157,9.5 2.5,8.82843 2.5,8 L2.5,5 C2.5,3.61929 3.61929,2.5 5,2.5 L8,2.5 C8.82843,2.5 9.5,3.17157 9.5,4 C9.5,4.82843 8.82843,5.5 8,5.5 Z M8,18.5 L5.5,18.5 L5.5,16 C5.5,15.1716 4.82843,14.5 4,14.5 C3.17157,14.5 2.5,15.1716 2.5,16 L2.5,19 C2.5,20.3807 3.61929,21.5 5,21.5 L8,21.5 C8.82843,21.5 9.5,20.8284 9.5,20 C9.5,19.1716 8.82843,18.5 8,18.5 Z M16,18.5 L18.5,18.5 L18.5,16 C18.5,15.1716 19.1716,14.5 20,14.5 C20.8284,14.5 21.5,15.1716 21.5,16 L21.5,19 C21.5,20.3807 20.3807,21.5 19,21.5 L16,21.5 C15.1716,21.5 14.5,20.8284 14.5,20 C14.5,19.1716 15.1716,18.5 16,18.5 Z'
const fullscreenExitSvg = 'M17.5,6.5 L20,6.5 C20.8284,6.5 21.5,7.17157 21.5,8 C21.5,8.82843 20.8284,9.5 20,9.5 L17,9.5 C15.6193,9.5 14.5,8.38071 14.5,7 L14.5,4 C14.5,3.17157 15.1716,2.5 16,2.5 C16.8284,2.5 17.5,3.17157 17.5,4 L17.5,6.5 Z M4,6.5 L6.5,6.5 L6.5,4 C6.5,3.17157 7.17157,2.5 8,2.5 C8.82843,2.5 9.5,3.17157 9.5,4 L9.5,7 C9.5,8.38071 8.38071,9.5 7,9.5 L4,9.5 C3.17157,9.5 2.5,8.82843 2.5,8 C2.5,7.17157 3.17157,6.5 4,6.5 Z M4,17.5 L6.5,17.5 L6.5,20 C6.5,20.8284 7.17157,21.5 8,21.5 C8.82843,21.5 9.5,20.8284 9.5,20 L9.5,17 C9.5,15.6193 8.38071,14.5 7,14.5 L4,14.5 C3.17157,14.5 2.5,15.1716 2.5,16 C2.5,16.8284 3.17157,17.5 4,17.5 Z M20,17.5 L17.5,17.5 L17.5,20 C17.5,20.8284 16.8284,21.5 16,21.5 C15.1716,21.5 14.5,20.8284 14.5,20 L14.5,17 C14.5,15.6193 15.6193,14.5 17,14.5 L20,14.5 C20.8284,14.5 21.5,15.1716 21.5,16 C21.5,16.8284 20.8284,17.5 20,17.5 Z'
const arrowRightSvg = "M11.0731 18.8389C10.2649 19.5461 9 18.9721 9 17.8982L9 6.10192C9 5.02797 10.2649 4.454 11.0731 5.1612L17.3838 10.683C18.1806 11.3802 18.1806 12.6198 17.3838 13.317L11.0731 18.8389ZM10.5 17.3472L16.396 12.1882C16.5099 12.0886 16.5099 11.9115 16.396 11.8119L10.5 6.65286L10.5 17.3472Z"
const arrowLeftSvg = "M12.9269 18.8389C13.7351 19.5461 15 18.9721 15 17.8982L15 6.10192C15 5.02797 13.7351 4.454 12.9269 5.1612L6.61619 10.683C5.8194 11.3802 5.8194 12.6198 6.61619 13.317L12.9269 18.8389ZM13.5 17.3472L7.60402 12.1882C7.4901 12.0886 7.4901 11.9115 7.60402 11.8119L13.5 6.65286L13.5 17.3472Z";

const completedSvg = <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
    <path d="M15.7657 10.2396C16.0781 10.5592 16.0781 11.0772 15.7657 11.3967L11.499 15.7604C11.1866 16.0799 10.6801 16.0799 10.3676 15.7604L8.23431 13.5785C7.9219 13.259 7.9219 12.741 8.23431 12.4215C8.54673 12.1019 9.05327 12.1019 9.36569 12.4215L10.9333 14.0247L14.6343 10.2396C14.9467 9.92012 15.4533 9.92012 15.7657 10.2396Z"></path>
    <path d="M8.96832 2.86688C9.28943 2.34443 9.85266 2 10.4879 2H13.5121C14.1473 2 14.7106 2.34443 15.0317 2.86688L15.598 3.78825C16.1575 3.83176 16.6881 3.87857 17.1512 3.92214C18.4998 4.04902 19.5504 5.11757 19.6563 6.45519C19.7985 8.25286 20 11.1773 20 13.3444C20 15.3896 19.8208 17.7117 19.6808 19.216C19.5583 20.5333 18.5145 21.5672 17.1922 21.6922C15.7554 21.8279 13.6198 22 12 22C10.3802 22 8.24457 21.8279 6.80778 21.6922C5.48548 21.5672 4.44171 20.5333 4.31916 19.216C4.1792 17.7117 4 15.3896 4 13.3444C4 11.1773 4.20149 8.25286 4.34373 6.45519C4.44956 5.11757 5.50024 4.04902 6.84879 3.92214C7.31193 3.87857 7.8425 3.83176 8.402 3.78825L8.96832 2.86688ZM8.02441 5.36223C7.65829 5.3928 7.31087 5.42401 6.99475 5.45375C6.39941 5.50977 5.93455 5.97928 5.88735 6.57577C5.74518 8.37253 5.54839 11.2436 5.54839 13.3444C5.54839 15.3175 5.72226 17.5834 5.86097 19.0744C5.91474 19.6523 6.3697 20.1054 6.95435 20.1606C8.38773 20.296 10.4598 20.4615 12 20.4615C13.5402 20.4615 15.6123 20.296 17.0456 20.1606C17.6303 20.1054 18.0853 19.6523 18.139 19.0744C18.2777 17.5834 18.4516 15.3175 18.4516 13.3444C18.4516 11.2436 18.2548 8.37253 18.1126 6.57577C18.0655 5.97928 17.6006 5.50977 17.0052 5.45376C16.6891 5.42401 16.3417 5.3928 15.9756 5.36223C15.9352 5.5803 15.8588 5.7884 15.7521 5.97609C15.4604 6.48894 14.9092 6.89732 14.2002 6.89732H9.79976C9.09084 6.89732 8.53958 6.48894 8.24791 5.97609C8.14117 5.7884 8.06476 5.5803 8.02441 5.36223ZM10.4879 3.53846C10.4329 3.53846 10.3515 3.56821 10.2898 3.66872L9.60159 4.78834C9.59146 4.80483 9.58285 4.82123 9.57557 4.83747C9.52007 4.96132 9.53158 5.10602 9.59596 5.21923C9.6574 5.32725 9.73397 5.35886 9.79976 5.35886H14.2002C14.266 5.35886 14.3426 5.32725 14.404 5.21923C14.4684 5.10602 14.4799 4.96132 14.4244 4.83747C14.4171 4.82123 14.4085 4.80483 14.3984 4.78834L13.7102 3.66872C13.6485 3.56821 13.5671 3.53846 13.5121 3.53846H10.4879Z"></path>
</svg>
const waitingSvg = <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
    <path d="M11.9426 1.25H12.0574C14.3658 1.24999 16.1748 1.24998 17.5863 1.43975C19.031 1.63399 20.1711 2.03933 21.0659 2.93414C21.9607 3.82895 22.366 4.96897 22.5603 6.41371C22.75 7.82519 22.75 9.63423 22.75 11.9426V12.0574C22.75 14.3658 22.75 16.1748 22.5603 17.5863C22.366 19.031 21.9607 20.1711 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.03933 20.1711 1.63399 19.031 1.43975 17.5863C1.24998 16.1748 1.24999 14.3658 1.25 12.0574V11.9426C1.24999 9.63423 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63423 1.24999 11.9426 1.25ZM6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62177 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62177 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12C21.25 9.62177 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4355 3.42514 18.6648 3.09825 17.3864 2.92637C16.0864 2.75159 14.3782 2.75 12 2.75C9.62177 2.75 7.91356 2.75159 6.61358 2.92637ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.8358 12.8964C11.5468 12.6074 11.4022 12.4629 11.3261 12.2791C11.25 12.0954 11.25 11.891 11.25 11.4822V8C11.25 7.58579 11.5858 7.25 12 7.25Z"></path>
</svg>

const correctionSvg = <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 1024 1024' fill='currentColor'>
    <path d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"></path>
</svg>

const rejectSvg = <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 48 48' fill='currentColor'>
    <path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,6.5 C14.3350169,6.5 6.5,14.3350169 6.5,24 C6.5,33.6649831 14.3350169,41.5 24,41.5 C33.6649831,41.5 41.5,33.6649831 41.5,24 C41.5,14.3350169 33.6649831,6.5 24,6.5 Z M17.7823881,16.0249942 L17.8838835,16.1161165 L24,22.233 L30.1161165,16.1161165 C30.5717282,15.6605048 31.2915486,15.6301307 31.7823881,16.0249942 L31.8838835,16.1161165 C32.3394952,16.5717282 32.3698693,17.2915486 31.9750058,17.7823881 L31.8838835,17.8838835 L25.767,24 L31.8838835,30.1161165 C32.3394952,30.5717282 32.3698693,31.2915486 31.9750058,31.7823881 L31.8838835,31.8838835 C31.4282718,32.3394952 30.7084514,32.3698693 30.2176119,31.9750058 L30.1161165,31.8838835 L24,25.767 L17.8838835,31.8838835 C17.4282718,32.3394952 16.7084514,32.3698693 16.2176119,31.9750058 L16.1161165,31.8838835 C15.6605048,31.4282718 15.6301307,30.7084514 16.0249942,30.2176119 L16.1161165,30.1161165 L22.233,24 L16.1161165,17.8838835 C15.6605048,17.4282718 15.6301307,16.7084514 16.0249942,16.2176119 L16.1161165,16.1161165 C16.5717282,15.6605048 17.2915486,15.6301307 17.7823881,16.0249942 Z"></path>
</svg>

const statuses = {
    'completed': 'Выполненная',
    'waiting': 'Ожидание',
    'reject': 'Отменённая',
    'correction': "Коррекция"
}

const statusToSvg = {
    'completed': completedSvg,
    'waiting': waitingSvg,
    'reject': rejectSvg,
    'correction': correctionSvg
}





let notificationTimer

function Auth() {
    const [token, setToken] = useState('');
    const [tokenError, setTokenError] = useState(false);
    function changeToken(event) {
        setToken(event.target.value)
        setTokenError(false);
    }
    async function checkToken() {
        const response = await axiinstance.post('/admin/auth/', { token: token })
        if (response.data.access === true) {
            window.location.reload();
        } else (
            setTokenError(true)
        )
    }
    return (
        <div className='auth'>
            <div className='tab'>
                <h2>Вход в админ панель</h2>
                <input type="text" placeholder='Токен' value={token} onChange={changeToken} className={tokenError ? 'error-input' : ''} />
                <button onClick={checkToken}>Войти</button>
            </div>
        </div>
    )
}

function Stats() {
    const [topups, setTopups] = useState([]);
    const [summary, setSummary] = useState([]);
    const [modal, setModal] = useState(null);
    const [withdraws, setWithdraws] = useState(
        {
            meta: {
                usdt_total_amount: 0,
            },
            withdraws: []
        }
    );
    const [withdrawsSummary, setWithdrawsSummary] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDateA, setStartDateA] = useState('');
    const [endDateA, setEndDateA] = useState('');
    const [lengWithdraws, setLengthWithdraws] = useState(0);
    const [lengTopups, setLengthTopups] = useState(0);
    const [lengWithdrawsSummary, setLengthWithdrawsSummary] = useState(0);
    const [totalWaiting, setTotalWaiting,] = useState();
    const [curs, setCurs] = useState(0);

    useEffect(() => {
        async function getCurs() {
            try {
                const response = await axios.get('https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency');

                if (response.data) {
                    response.data.data.forEach((item) => {
                        if (item.pair === 'RUB_USD') {
                            setCurs(item.rate);
                        }
                    })
                    getTopups()
                    getWithdraws()
                } else {
                    setCurs(0);
                }
            } catch (error) {
                console.error("Error fetching withdraws:", error);
                setCurs(0);
            }
        }
        getCurs()
    }, [])

    async function getTopups() {
        const response = await axiinstance.get('/admin/topups/', {
            params: {
                page: 1,
                limit: 200,
                sort_by: "datetime",
                order: "desc",
            },
        });
        if (response.data) {
            setTopups(response.data.result.topups);
        }
    }

    async function getWithdraws() {
        try {
            const response = await axiinstance.get('/admin/withdraws/', {
                params: {
                    page: 1,
                    limit: 200,
                    sort_by: "datetime",
                    order: "desc",
                },
            });

            if (response.data) {
                setWithdraws(response.data.result);
            } else {
                setWithdraws([]);
            }
        } catch (error) {
            console.error("Error fetching withdraws:", error);
            setWithdraws([]);
        }
    }

    useEffect(() => {
        // Создаём объект для хранения промежуточных результатов
        let tempSummary = {};

        // Счетчик количества транзакций
        let transactionCount = 0;

        // Проходим по всем транзакциям
        topups.forEach((transaction) => {
            // Извлечение даты из поля datetime
            const dateString = transaction.datetime.slice(0, 10); // Получение строки формата 'YYYY-MM-DD'

            // Определяем, нужно ли применять фильтрацию по дате
            const applyFilter = startDateA !== '' && endDateA !== '';


            // Применяем фильтрацию, если она необходима
            if (
                (!applyFilter || (dateString >= startDateA && dateString <= endDateA))
            ) {

                transactionCount++; // Увеличение счетчика

                // Создание записи для новой даты, если её ещё нет
                if (!tempSummary[dateString]) {
                    tempSummary[dateString] = {
                        day: `${dateString.slice(8, 10)}.${dateString.slice(5, 7)}`, // Формат 'ДД.ММ'
                        депозит: 0
                    };
                }

                // Суммирование прибыли для текущей даты
                tempSummary[dateString].депозит += transaction.usdt_amount;
            }
        });
        // Округляем значения profit до целых чисел
        const roundedSummary = Object.values(tempSummary).map(item => ({
            ...item,
            депозит: Math.round(item.депозит * curs * 100) / 100
        }));
        // Сохраняем в состояние
        setSummary(roundedSummary);
        setLengthTopups(transactionCount);
    }, [topups, startDateA, endDateA])

    useEffect(() => {
        // Объект для хранения промежуточных результатов
        let tempSummary = {};

        // Счетчик количества транзакций
        let transactionCount = 0;

        // Проход по всем транзакциям
        withdraws.withdraws.forEach((transaction) => {
            // Извлечение даты из поля datetime
            const dateString = transaction.datetime.slice(0, 10); // Получение строки формата 'YYYY-MM-DD'

            // Определяем, нужно ли применять фильтрацию по дате
            const applyFilter = startDate !== '' && endDate !== '';

            const totalAmountWaiting = calculateTotalAmountByStatus(withdraws.withdraws, 'waiting');

            setTotalWaiting(totalAmountWaiting.toFixed(2));


            // Применяем фильтрацию, если она необходима
            if (
                (!applyFilter || (dateString >= startDate && dateString <= endDate)) &&
                transaction.status === 'completed' // Добавлено условие по статусу
            ) {

                transactionCount++; // Увеличение счетчика

                // Создание записи для новой даты, если её ещё нет
                if (!tempSummary[dateString]) {
                    tempSummary[dateString] = {
                        day: `${dateString.slice(8, 10)}.${dateString.slice(5, 7)}`, // Формат 'ДД.ММ'
                        выплата: 0
                    };
                }

                // Суммирование прибыли для текущей даты
                tempSummary[dateString].выплата += transaction.usdt_amount;
            }
        });

        // Округление значений прибыли до целых чисел
        const roundedSummary = Object.values(tempSummary).map(item => ({
            ...item,
            выплата: Math.round(item.выплата * curs * 100) / 100
        }));

        // Сохранение результата в состояние
        setWithdrawsSummary(roundedSummary);
        setLengthWithdraws(transactionCount);
    }, [withdraws.withdraws, startDate, endDate]);

    function calculateTotalProfit(summary) {
        return summary.reduce((acc, item) => acc + item.выплата, 0);
    }

    const totalProfit = calculateTotalProfit(withdrawsSummary);

    function calculateTotalTopup(summary) {
        return summary.reduce((acc, item) => acc + item.депозит, 0);
    }

    const totalTopup = calculateTotalTopup(summary);

    // Функция для суммирования amount по статусу 'waiting'
    const calculateTotalAmountByStatus = (transactions, status) => {
        let transactionCountWaiting = 0;
        return transactions.reduce((total, transaction) => {
            if (transaction.status === status) {
                total += (transaction.usdt_amount * curs * 100) / 100;
                transactionCountWaiting++
            }
            setLengthWithdrawsSummary(transactionCountWaiting)
            return total;
        }, 0);
    };

    return (
        <div className='stats'>
            {modal && (
                <div className='modal' onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setModal(null)
                    }
                }}>
                    {modal === 'filter_payments' && (
                        <div className='modal-tab filter'>
                            <h3>Периуд выплат</h3>
                            <div className="date-filters">
                                <div className="date_input_box">
                                    <label htmlFor="start-date">С:</label>
                                    <input className="date_input"
                                        id="start-date"
                                        type="date"
                                        name="start_date"
                                        value={startDate}
                                        onChange={(event) => {
                                            setStartDate(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="date_input_box">
                                    <label htmlFor="end-date">По:</label>
                                    <input className="date_input"
                                        id="end-date"
                                        type="date"
                                        name="end_date"
                                        value={endDate}
                                        onChange={(event) => {
                                            setEndDate(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="payments">
                                <div>
                                    <h3>Сумма комиссии</h3>
                                    <p>10 000 ₽</p>
                                </div>
                                <div>
                                    <h3>Количество выплат</h3>
                                    <p>{lengWithdraws}</p>
                                </div>
                            </div>
                            <div className="modul_butto_box">
                                <button onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }} >Сбросить</button>
                                <button onClick={() => setModal(null)}>Закрыть</button>
                            </div>
                        </div>
                    )}
                    {modal === 'filter_deposits' && (
                        <div className='modal-tab filter'>
                            <h3>Периуд внесения депозитов</h3>
                            <div className="date-filters">
                                <div className="date_input_box">
                                    <label htmlFor="start-date">С:</label>
                                    <input className="date_input"
                                        id="start-date"
                                        type="date"
                                        name="start_date"
                                        value={startDateA}
                                        onChange={(event) => {
                                            setStartDateA(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="date_input_box">
                                    <label htmlFor="end-date">По:</label>
                                    <input className="date_input"
                                        id="end-date"
                                        type="date"
                                        name="end_date"
                                        value={endDateA}
                                        onChange={(event) => {
                                            setEndDateA(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="payments">
                                <div>
                                    <h3>Сумма депозитов</h3>
                                    <p>{floatToStr(totalTopup)} ₮</p>
                                </div>
                                <div>
                                    <h3>Количество депозитов</h3>
                                    <p>{lengTopups}</p>
                                </div>
                            </div>
                            <div className="modul_butto_box">
                                <button onClick={() => {
                                    setStartDateA('');
                                    setEndDateA('');
                                }} >Сбросить</button>
                                <button onClick={() => setModal(null)}>Закрыть</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className='info-list'>
                <div className='info'>
                    <p className='title'>Сумма выплат</p>
                    <p className='value'>{floatToStr((withdraws.meta.usdt_total_amount * curs).toFixed(2))} ₽ ({floatToStr((withdraws.meta.usdt_total_amount).toFixed(2))} ₮)</p>
                </div>
                <div className='info'>
                    <p className='title'>Сумма комиссий</p>
                    <p className='value'>0 ₽</p>
                </div>
                <div className='info'>
                    <p className='title'>Заявки в ожидании</p>
                    <p className='value'>{lengWithdrawsSummary} <span style={{ 'font-weight': '500' }}>({floatToStr(totalWaiting)} ₽) ({floatToStr(totalWaiting / curs)} ₮)</span></p>
                </div>
                <div className='info'>
                    <p className='title'>Выполненные заявки</p>
                    <p className='value'>{lengWithdraws} <span style={{ 'font-weight': '500' }}>({floatToStr(totalProfit)} ₽) ({floatToStr(totalProfit / curs)} ₮)</span></p>
                </div>
            </div>
            <div className="diogram_box">
                <div className="diogram_1">
                    <div className="diogram_box_top">
                        <p>Статистика по выплатам</p>
                        <div className="filter_btn" onClick={() => setModal('filter_payments')}>
                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V17L10 21V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="#4A5568" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
                        </div>
                    </div>
                    <div className="diograma_box">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={withdrawsSummary}>
                                <defs>
                                    <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" reversed="true" />
                                <YAxis type="number" dataKey="выплата" />
                                <Tooltip formatter={(e) => `${floatToStr(e)} ₽ (${floatToStr(e / curs)} ₮)`} />
                                <Area type="monotone" dataKey="выплата" stroke="#8884d8" fill="url(#colorTemperature)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="diogram_2">
                    <div className="diogram_box_top">
                        <p>Статистика по депозитам</p>
                        <div className="filter_btn" onClick={() => setModal('filter_deposits')}>
                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V17L10 21V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="#4A5568" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
                        </div>
                    </div>
                    <div className="diograma_box">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary}>
                                <defs>
                                    <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" reversed="true" />
                                <YAxis />
                                <Tooltip formatter={(e) => `${floatToStr(e)} ₽ (${floatToStr(e / curs)} ₮)`} />
                                <Area type="monotone" dataKey="депозит" stroke="#8884d8" fill="url(#colorTemperature)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Withdraws() {
    const [activeModal, setActiveModal] = useState(null); // 'null' - нет активного модала
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // Позиция модала
    const [users, setUsers] = useState([]);
    const [bank, setBanks] = useState([]);
    const [withdraws, setWithdraws] = useState([]);
    const [banks, setBanksis] = useState([]);
    const [bankName, setBankName] = useState([]);

    const [filteredWithdraws, setFilteredWithdraws] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'datetime', direction: 'desc', name: 'Новые' })
    const [filterConfig, setFilterConfig] = useState({
        bank_ids: [...Object.keys(banks)],
        statuses: [...Object.keys(statuses)],
    })
    const [inputTagId, setInputTagId] = useState(null)

    const inputRef = useRef(null)

    const withdrawsRef = useRef(null)
    const [isFullscreen, setIsFullscreen] = useState(false);

    const notificationRef = useRef(null);
    const [notificationText, setNotificationText] = useState('');

    const [tooltipText, setTooltipText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pageAmount, setPageAmount] = useState(0);

    const [search, setSearch] = useState('');

    const userIds = [...new Set(filteredWithdraws.map(withdraws => withdraws.user_id))];
    const filteredUsers = users.filter(user => userIds.includes(user.id));
    const banksIds = [...new Set(filteredWithdraws.map(withdraws => withdraws.bank_id))];
    const filteredBanks = bank.filter(banks => banksIds.includes(banks.id));
    const [statusId, setStatusId] = useState(null)
    
    const [curs, setCurs] = useState(0);
    const [currencies, setCurrencies] = useState([]);


    const toggleBank = (bank) => {
        setFilterConfig((prev) => ({
            ...prev,
            bank_ids: prev.bank_ids.includes(bank)
                ? (prev.bank_ids.length > 1 ? prev.bank_ids.filter((b) => b !== bank) : [...prev.bank_ids])
                : [...prev.bank_ids, bank],
        }));
    };

    const toggleStatus = (status) => {
        setFilterConfig((prev) => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? (prev.statuses.length > 1 ? prev.statuses.filter((s) => s !== status) : [...prev.statuses])
                : [...prev.statuses, status],
        }));
    };

    function callNotification(text, seconds = 3) {
        setNotificationText(text);

        if (notificationRef.current) {
            notificationRef.current.show();

            // Если есть уже активный таймер, отменяем его
            if (notificationTimer) {
                clearTimeout(notificationTimer);
            }

            // Устанавливаем новый таймер
            notificationTimer = setTimeout(() => {
                // Добавляем класс для плавного исчезновения
                notificationRef.current.classList.add('fade-out');
                setTimeout(() => {
                    notificationRef.current.close();
                    setNotificationText('');
                    // Убираем класс после закрытия
                    notificationRef.current.classList.remove('fade-out');
                }, 1000); // Время совпадает с длительностью анимации
            }, (seconds - 1) * 1000); // Учёт последней секунды для анимации
        }
    }

    function handleBankClick(event) {
        const buttonRect = event.target.getBoundingClientRect();

        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX,
        });

        setActiveModal(!activeModal ? "bankModal" : null); // Открываем модал для выбора банков
    }

    function handleStatusClick(event) {
        const buttonRect = event.target.getBoundingClientRect();

        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX,
        });

        setActiveModal(!activeModal ? "statusModal" : null); // Открываем модал для выбора статуса
    }

    function handleStatusEditClick(event, id) {
        const buttonRect = event.target.getBoundingClientRect();
        setStatusId(id)
        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX,
        });

        setActiveModal(!activeModal ? "statusEditModal" : null); // Открываем модал для выбора банков
    }

    function sortArrow(field) {
        if (field === sortConfig.field) {
            return sortConfig.direction === 'asc' ? ' ↓' : ' ↑';
        }
        return ''
    }

    async function save_tag(id, tag) {
        try {
            await axiinstance.patch('/admin/withdraw/' + id + '/', { tag: tag })
            setFilteredWithdraws(filteredWithdraws.map(item =>
                item.id === id
                    ? { ...item, tag: tag }
                    : item
            )
            )
        } catch (error) {
            console.log(error)
        }
    }

    function savePhone(id) {
        const foundItem = filteredWithdraws.find(item => item.id === id);
        const htmlToSave = `<strong><br>${foundItem.phone}<br>${foundItem.receiver || 'Пусто'}<br>${foundItem.amount}</strong>`;
        const plainTextToSave = `${foundItem.phone}\n${foundItem.receiver || 'Пусто'}\n${foundItem.amount}`;
        console.log(plainTextToSave)

        const clipboardItem = new ClipboardItem({
            'text/html': new Blob([htmlToSave], { type: 'text/html' }),
            'text/plain': new Blob([plainTextToSave], { type: 'text/plain' }),
        });

        navigator.clipboard.write([clipboardItem])

        callNotification("Скопировано")
    }

    function saveCard(id) {
        const foundItem = filteredWithdraws.find(item => item.id === id);
        const htmlToSave = `<strong><br>${foundItem.card}<br>${foundItem.receiver || 'Пусто'}<br>${foundItem.amount}</strong>`;
        const plainTextToSave = `${foundItem.card}\n${foundItem.receiver || 'Пусто'}\n${foundItem.amount}`;

        const clipboardItem = new ClipboardItem({
            'text/html': new Blob([htmlToSave], { type: 'text/html' }),
            'text/plain': new Blob([plainTextToSave], { type: 'text/plain' }),
        });

        navigator.clipboard.write([clipboardItem])

        callNotification("Скопировано")

    }

    async function sendDocument(event) {
        const withdrawId = event.target.dataset.key
        const file = event.target.files[0];

        if (!file) {
            console.log("Нет выбранного файла");
            return
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Отправка файла на сервер
            const response = await axiinstance.post("/admin/withdraw/upload_document/" + withdrawId + "/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Файл загружен успешно:", response.data);
        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
        }



    }

    useEffect(() => {
        async function getCurrencies() {
            const response = await axiinstance.get('/admin/currencies/');
            if (response.data) {
                setCurrencies(response.data.result);
            }
        }
        getCurrencies()

        async function getCurs() {
            try {
                const response = await axios.get('https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency');

                if (response.data) {
                    response.data.data.forEach((item) => {
                        if (item.pair === 'RUB_USD') {
                            setCurs(item.rate);
                        }
                    })
                } else {
                    setCurs(0);
                }
            } catch (error) {
                console.error("Error fetching withdraws:", error);
                setCurs(0);
            }
        }
        getCurs()
    }, [])


    useEffect(() => {
        async function getBanks() {
            const response = await axiinstance.get('/admin/banks/');
            if (response.data) {
                setBanks(response.data.result);
                setBanksis(
                    response.data.result.reduce((acc, bank) => {
                        acc[bank.id.toString()] = bank.id.toString();
                        return acc;
                    }, {})
                )
                setBankName(
                    response.data.result.reduce((acc, bank) => {
                        acc[bank.id.toString()] = bank.name.toString();
                        return acc;
                    }, {})
                )
                if (filterConfig.bank_ids.length === 0) {
                    setFilterConfig( {...filterConfig, 
                        bank_ids: [...Object.keys(banks)]}
                    )
                }
            }
        }
        // Асинхронная функция для получения данных
        async function getWithdraws() {
            try {
                const response = await axiinstance.get('/admin/withdraws/', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        statuses: filterConfig.statuses,
                        bank_ids: filterConfig.bank_ids,
                        sort_by: sortConfig.field,
                        order: sortConfig.direction,
                        ...(search.trim() ? { search: search } : {}),
                    },
                });

                if (response.data) {
                    return response.data;
                } else {
                    return [];
                }
            } catch (error) {
                console.error("Error fetching withdraws:", error);
                return [];
            }
        }

        async function getUsers() {
            const response = await axiinstance.get('/admin/users/');
            if (response.data) {
                setUsers(response.data.result);
            }
        }

        

        // Основная логика получения и обработки данных
        async function fetchData() {
            getBanks()
            getUsers()
            const data = await getWithdraws();
            setTotalPages(data.result.meta.pages)
            setTotalAmount(data.result.meta.usdt_total_amount)
            setPageAmount(data.result.meta.usdt_page_amount)
            const withdraws = data.result.withdraws;
            //
            // const boldText = (text, offset, length) => {
            //     let updatedText = text.slice(0, offset + length) + "</span>" + text.slice(offset + length);
            //     updatedText = updatedText.slice(0, offset) + "<span style={{fontWeight: 'bold'}}'>" + updatedText.slice(offset);
            //     return updatedText;
            // };
            //
            const formattedWithdraws = withdraws
                .map((withdraw) => {
                    return {
                        ...withdraw,
                        datetime: new Date(withdraw.datetime).toLocaleString('ru-RU', {
                            hour12: false,
                        }).replace(/,/g, ''),
                        amount: withdraw.usdt_amount.toFixed(2)
                    }
                    // baseFormatted.searched?.forEach((dict) => {
                    //     const field = dict.field;
                    //     const offset = dict.offset;
                    //     const length = dict.length;
                    //     const value = baseFormatted[field].toString();
                    //     console.log(dict);
                    //     console.log(baseFormatted[field]);
                    //     console.log(value)
                    //     if (value) {
                    //         baseFormatted[field] = boldText(value, offset, length);
                    //     }
                    // });

                });

            setFilteredWithdraws(formattedWithdraws);
        }

        fetchData();
    }, [sortConfig, filterConfig, currentPage, itemsPerPage, search, withdraws, activeModal]);

    useEffect(() => {
        setCurrentPage(1)
    }, [sortConfig, filterConfig, itemsPerPage, search]);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputTagId]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setTooltipPosition({ left: e.pageX + 10, top: e.pageY + 10 });
        };

        // Добавляем обработчик события mousemove
        window.addEventListener('mousemove', handleMouseMove);

        // Убираем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [tooltipText]);

    return (
        <>
            {tooltipText &&
                <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {tooltipText}
                </div>
            }
            <dialog ref={notificationRef} className='notification'>
                {notificationText}
            </dialog>
            <div className={`withdraws ${isFullscreen ? 'fullscreen' : ''}`} ref={withdrawsRef}>
                <ChoiceModal
                    isVisible={activeModal === "bankModal"} // Показываем модал, если активен "bankModal"
                    position={modalPosition}
                    options={banks}
                    selectedOptions={filterConfig.bank_ids}
                    onToggleOption={toggleBank}
                    onClose={() => setActiveModal(null)} // Закрытие модала, сброс состояния
                    name={bankName}
                />
                <ChoiceModal
                    isVisible={activeModal === "statusModal"} // Показываем модал, если активен "bankModal"
                    position={modalPosition}
                    options={statuses}
                    selectedOptions={filterConfig.statuses}
                    onToggleOption={toggleStatus}
                    onClose={() => setActiveModal(null)} // Закрытие модала, сброс состояния
                    name={statuses}
                />
                <StatusEditModal
                    isVisible={activeModal === "statusEditModal"} // Показываем модал, если активен "bankModal"
                    position={modalPosition}
                    status={statuses}
                    statusId={statusId}
                    onClose={() => setActiveModal(null)} // Закрытие модала, сброс состояния
                />
                <div className='top'>
                    <div className="input_box">
                        <input type="text" placeholder='Поиск' className='search-input' value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())} />
                        <div className="clouse_input" onClick={() => setSearch("")}>
                            <img className="cluse_svg" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMjQ7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9ImluZm8iLz48ZyBpZD0iaWNvbnMiPjxwYXRoIGQ9Ik0xNC44LDEybDMuNi0zLjZjMC44LTAuOCwwLjgtMiwwLTIuOGMtMC44LTAuOC0yLTAuOC0yLjgsMEwxMiw5LjJMOC40LDUuNmMtMC44LTAuOC0yLTAuOC0yLjgsMCAgIGMtMC44LDAuOC0wLjgsMiwwLDIuOEw5LjIsMTJsLTMuNiwzLjZjLTAuOCwwLjgtMC44LDIsMCwyLjhDNiwxOC44LDYuNSwxOSw3LDE5czEtMC4yLDEuNC0wLjZsMy42LTMuNmwzLjYsMy42ICAgQzE2LDE4LjgsMTYuNSwxOSwxNywxOXMxLTAuMiwxLjQtMC42YzAuOC0wLjgsMC44LTIsMC0yLjhMMTQuOCwxMnoiIGlkPSJleGl0Ii8+PC9nPjwvc3ZnPg==' alt="" />
                        </div>
                    </div>
                    <p>Общая сумма:<br />{floatToStr((totalAmount * curs * 100) / 100)} ₽ ({floatToStr(totalAmount)} ₮)</p>
                    <p>Сумма страницы:<br />{floatToStr((pageAmount * curs * 100) / 100)} ₽ ({floatToStr(pageAmount)} ₮)</p>
                    <div className={`only-waiting ${(filterConfig.statuses.length === 1 && filterConfig.statuses[0] === "waiting") ? "waiting" : ""}`} onClick={() => {
                        setFilterConfig({
                            ...filterConfig,
                            statuses: (filterConfig.statuses.length === 1 && filterConfig.statuses[0] === "waiting")
                                ? Object.keys(statuses)
                                : ["waiting"]
                        });
                    }}>
                        {waitingSvg}
                    </div>
                    <svg className='fullscreen-button' xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                        viewBox='0 0 24 24' fill='currentColor' onClick={() => {
                            setIsFullscreen(!isFullscreen)
                        }}>
                        <path d={isFullscreen ? fullscreenExitSvg : fullscreenEnterSvg} fill='#64748b' />
                    </svg>
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th
                                    style={{ width: "90px" }}
                                    onClick={() => {
                                        if (sortConfig.field === 'datetime') {
                                            if (sortConfig.direction === 'asc') {
                                                setSortConfig({ field: 'datetime', direction: 'desc', name: 'Новые' })
                                            } else {
                                                setSortConfig({ field: 'datetime', direction: 'asc', name: 'Старые' })
                                            }
                                        } else {
                                            setSortConfig({ field: 'datetime', direction: 'desc', name: 'Новые' })
                                        }
                                    }}
                                >Дата{sortArrow('datetime')}</th>
                                {!isFullscreen && <th>Пользователь</th>}
                                <th>Телефон</th>
                                <th>Карта</th>
                                <th>Получатель</th>
                                <th onClick={handleBankClick}
                                >Банк</th>
                                <th
                                    onClick={() => {
                                        if (sortConfig.field === 'amount') {
                                            if (sortConfig.direction === 'asc') {
                                                setSortConfig({ field: 'amount', direction: 'desc', name: 'Сумма больше' })
                                            } else {
                                                setSortConfig({ field: 'amount', direction: 'asc', name: 'Сумма меньше' })
                                            }
                                        } else {
                                            setSortConfig({ field: 'amount', direction: 'desc', name: 'Сумма больше' })
                                        }
                                    }}
                                >Сумма{sortArrow('amount')}</th>
                                <th>Метка</th>
                                <th onClick={handleStatusClick}
                                    title={`${filterConfig.statuses.length === 1 ? statuses[filterConfig.statuses[0]] : 'Все'}`}
                                    style={{ width: 'fit-content' }}
                                >Статус</th>
                                <th>Документ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWithdraws.length > 0 &&
                                filteredWithdraws.map((i) => {
                                    const user = filteredUsers.find(u => u.id === i.user_id);
                                    const bank = filteredBanks.find(u => u.id === i.bank_id);

                                    if (!user) return null;
                                    if (!bank) return null;

                                    return (<tr key={i.id}>
                                        <td>{i.id}</td>
                                        <td>{i.datetime}</td>
                                        {!isFullscreen && <td><a target="_blank" href={`https://t.me/${user.tg_username}`}>@{user.tg_username}</a></td>}
                                        <td><span className="text-to-click" onClick={() => savePhone(i.id)}>{i.phone}</span>
                                        </td>
                                        <td><span className="text-to-click" onClick={() => saveCard(i.id)}>{i.card}</span>
                                        </td>
                                        <td>{i.receiver}</td>
                                        <td>{bank.name} {
                                            i.comment &&
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                                                viewBox='0 0 20 20' fill='red'
                                                onMouseEnter={() => setTooltipText(i.comment)}
                                                onMouseLeave={() => setTooltipText("")}>
                                                <path
                                                    d="M9.0001 8.517C8.58589 8.517 8.2501 8.85279 8.2501 9.267C8.2501 9.68121 8.58589 10.017 9.0001 10.017V8.517ZM16.0001 10.017C16.4143 10.017 16.7501 9.68121 16.7501 9.267C16.7501 8.85279 16.4143 8.517 16.0001 8.517V10.017ZM9.8751 11.076C9.46089 11.076 9.1251 11.4118 9.1251 11.826C9.1251 12.2402 9.46089 12.576 9.8751 12.576V11.076ZM15.1251 12.576C15.5393 12.576 15.8751 12.2402 15.8751 11.826C15.8751 11.4118 15.5393 11.076 15.1251 11.076V12.576ZM9.1631 5V4.24998L9.15763 4.25002L9.1631 5ZM15.8381 5L15.8438 4.25H15.8381V5ZM19.5001 8.717L18.7501 8.71149V8.717H19.5001ZM19.5001 13.23H18.7501L18.7501 13.2355L19.5001 13.23ZM18.4384 15.8472L17.9042 15.3207L17.9042 15.3207L18.4384 15.8472ZM15.8371 16.947V17.697L15.8426 17.697L15.8371 16.947ZM9.1631 16.947V16.197C9.03469 16.197 8.90843 16.23 8.79641 16.2928L9.1631 16.947ZM5.5001 19H4.7501C4.7501 19.2662 4.89125 19.5125 5.12097 19.6471C5.35068 19.7817 5.63454 19.7844 5.86679 19.6542L5.5001 19ZM5.5001 8.717H6.25012L6.25008 8.71149L5.5001 8.717ZM6.56175 6.09984L6.02756 5.5734H6.02756L6.56175 6.09984ZM9.0001 10.017H16.0001V8.517H9.0001V10.017ZM9.8751 12.576H15.1251V11.076H9.8751V12.576ZM9.1631 5.75H15.8381V4.25H9.1631V5.75ZM15.8324 5.74998C17.4559 5.76225 18.762 7.08806 18.7501 8.71149L20.2501 8.72251C20.2681 6.2708 18.2955 4.26856 15.8438 4.25002L15.8324 5.74998ZM18.7501 8.717V13.23H20.2501V8.717H18.7501ZM18.7501 13.2355C18.7558 14.0153 18.4516 14.7653 17.9042 15.3207L18.9726 16.3736C19.7992 15.5348 20.2587 14.4021 20.2501 13.2245L18.7501 13.2355ZM17.9042 15.3207C17.3569 15.8761 16.6114 16.1913 15.8316 16.197L15.8426 17.697C17.0201 17.6884 18.1461 17.2124 18.9726 16.3736L17.9042 15.3207ZM15.8371 16.197H9.1631V17.697H15.8371V16.197ZM8.79641 16.2928L5.13341 18.3458L5.86679 19.6542L9.52979 17.6012L8.79641 16.2928ZM6.2501 19V8.717H4.7501V19H6.2501ZM6.25008 8.71149C6.24435 7.93175 6.54862 7.18167 7.09595 6.62627L6.02756 5.5734C5.20098 6.41216 4.74147 7.54494 4.75012 8.72251L6.25008 8.71149ZM7.09595 6.62627C7.64328 6.07088 8.38882 5.75566 9.16857 5.74998L9.15763 4.25002C7.98006 4.2586 6.85413 4.73464 6.02756 5.5734L7.09595 6.62627Z"></path>
                                            </svg>
                                        }</td>
                                        <td>
                                            {currencies.map((e) => (
                                                i.currency_id === e.id ?
                                                    `${floatToStr(Number(i.amount) * Number(e.rate))} ${e.symbol}`
                                                    : null
                                            ))}
                                        </td>
                                        <td onClick={() => {
                                            setInputTagId(inputTagId === i.id ? null : i.id)
                                        }}>
                                            {inputTagId !== i.id ?
                                                (<span>{i.tag}</span>)
                                                :
                                                (<input type="text" className='input-in-table' ref={inputRef}
                                                    onKeyUp={(event) => {
                                                        if (event.key === 'Enter' && event.target.value !== "") {
                                                            save_tag(i.id, event.target.value);
                                                        }
                                                        if (event.key === "Enter" || event.key === "Escape") {
                                                            setInputTagId(null);
                                                        }
                                                    }} />)}
                                        </td>
                                        <td className={i.status} onClick={(e) => handleStatusEditClick(e, i.id)}>{statusToSvg[i.status]}</td>
                                        <td>
                                            {i.document ?
                                                <span className="text-to-click"></span>
                                                :
                                                <>
                                                    <input
                                                        data-key={i.id}
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        id={`input-document-${i.id}`}
                                                        accept="image/png, image/jpeg, application/pdf"
                                                        onInput={sendDocument}
                                                    />
                                                    <label htmlFor={`input-document-${i.id}`} className="text-to-click" >Загрузить</label>
                                                </>
                                            }

                                        </td>
                                    </tr>)
                                }
                                )
                            }
                        </tbody>
                    </table>
                </div>
                {totalPages !== 0 &&
                    <>
                        <div className="pagination">
                            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                            </select>

                            <div className="pagination-buttons">
                                {/* Левая стрелка */}
                                <svg
                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                    style={{
                                        cursor: currentPage > 1 ? "pointer" : "default",
                                        opacity: currentPage > 1 ? 1 : 0.5
                                    }}
                                >
                                    <path d={arrowLeftSvg}></path>
                                </svg>

                                {(() => {
                                    const totalButtons = 11; // Всего кнопок, включая активную
                                    let startPage = currentPage - 5; // Стартовая страница для отображения
                                    let endPage = currentPage + 5; // Конечная страница для отображения

                                    // Если общее количество страниц меньше totalButtons, корректируем startPage и endPage
                                    if (totalPages < totalButtons) {
                                        startPage = 1;
                                        endPage = totalPages;
                                    } else {
                                        // Если активная страница близка к началу, сдвигаем диапазон влево
                                        if (currentPage <= 5) {
                                            startPage = 1;
                                            endPage = totalButtons; // Показываем максимум 11 кнопок
                                        }
                                        // Если активная страница близка к концу, сдвигаем диапазон вправо
                                        else if (currentPage >= totalPages - 5) {
                                            startPage = totalPages - totalButtons + 1;
                                            endPage = totalPages;
                                        }
                                    }

                                    // Генерация массива страниц
                                    const buttonsArray = Array.from(
                                        { length: endPage - startPage + 1 },
                                        (_, i) => startPage + i
                                    );

                                    return buttonsArray.map((page) => (
                                        <div
                                            className={page === currentPage ? "active" : ""}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </div>
                                    ));
                                })()}

                                {/* Правая стрелка */}
                                <svg
                                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                    style={{
                                        cursor: currentPage < totalPages ? "pointer" : "default",
                                        opacity: currentPage < totalPages ? 1 : 0.5,
                                    }}
                                >
                                    <path d={arrowRightSvg}></path>
                                </svg>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

function TopUps() {
    const [topups, setTopups] = useState([]);
    const [users, setUsers] = useState([]);
    const userIds = [...new Set(topups.map(topups => topups.user_id))];
    const filteredUsers = users.filter(user => userIds.includes(user.id));
    const [filteredTopups, setFilteredTopups] = useState([]);
    const [banks, setBanksis] = useState([]);

    // Получение списка пользователей и списка транзакций из API
    useEffect(() => {
        async function getUsers() {
            const response = await axiinstance.get('/admin/users/');
            if (response.data) {
                setUsers(response.data.result);
            }
        }
        async function getTopups() {
            const response = await axiinstance.get('/admin/topups/', {
                params: {
                    page: 1,
                    limit: 200,
                    sort_by: "datetime",
                },
            });
            if (response.data) {
                setTopups(response.data.result.topups);
            }
        }
        async function getBanks() {
            const response = await axiinstance.get('/admin/banks/');
            if (response.data) {
               
                setBanksis(
                    response.data.result.reduce((acc, bank) => {
                        acc[bank.id.toString()] = bank.id.toString();
                        return acc;
                    }, {})
                )
                
            }
        }
        getBanks()
        getTopups()
        getUsers()
        getTopups()
    }, []);

    const [activeModal, setActiveModal] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ field: 'datetime', direction: 'desc', name: 'Сегодня' })
    const [filterConfig, setFilterConfig] = useState({
        oldTransactions: false,
        today: false,
        banks: [...Object.keys(banks)],
        tags: [],
        statuses: [...Object.keys(statuses)],
        currency: [],
        amount: { min: '', max: '', in_usd: true },
        startDate: '', // Начальная дата
        endDate: '', // Конечная дата
    })
    const [modal, setModal] = useState(null)

    const [applyAmountMin, setApplyAmountMin] = useState(''); // Минимум суммы для применения
    const [applyAmountMax, setApplyAmountMax] = useState(''); // Максимум суммы для применения
    const [applyStartDate, setApplyStartDate] = useState(''); // Начальная дата для применения
    const [applyEndDate, setApplyEndDate] = useState(''); // Конечная дата для применения









    // Обработчик нажатия кнопки "Применить"
    const handleApplyFilters = () => {
        setFilterConfig((prev) => ({
            ...prev,
            amount: {
                min: applyAmountMin,
                max: applyAmountMax,
                in_usd: prev.amount.in_usd,
            },
            startDate: applyStartDate,
            endDate: applyEndDate,
        }));
    };

    // Обработчик нажатия кнопки "Сбросить"
    const handleResetFilters = () => {
        setFilterConfig({
            oldTransactions: false,
            today: false,
            banks: [...Object.keys(banks)],
            tags: [],
            statuses: [...Object.keys(statuses)],
            currency: [],
            amount: { min: '', max: '', in_usd: true },
            startDate: '', // Начальная дата
            endDate: '', // Конечная дата
        })
        setApplyAmountMin('');
        setApplyAmountMax('');
        setApplyStartDate('');
        setApplyEndDate('');
    }

    function sortArrow(field) {
        if (field === sortConfig.field) {
            return sortConfig.direction === 'asc' ? ' ↓' : ' ↑';
        }
        return ''
    }




    useEffect(() => {
        let filtered = [...topups]

        if (filterConfig.today) {
            const today = new Date().setHours(0, 0, 0, 0); // Текущая дата без учета времени
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.datetime).setHours(0, 0, 0, 0);
                return itemDate === today;
            });
        }

        // Фильтр по диапазону дат
        if (filterConfig.startDate && filterConfig.endDate) {
            const startDate = new Date(filterConfig.startDate);
            const endDate = new Date(filterConfig.endDate);

            // Учитываем конец дня
            endDate.setDate(endDate.getDate() + 1); // Добавляем один день, чтобы включить всю дату до конца дня
            endDate.setHours(0); // Устанавливаем время на начало дня

            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.datetime);
                return itemDate >= startDate && itemDate <= endDate; // Меняем оператор <= на <
            });
        }

        if (filterConfig.amount.min !== '' || filterConfig.amount.max !== '') {
            const min_value = filterConfig.amount.min === '' ? 0 : parseFloat(filterConfig.amount.min)
            const max_value = filterConfig.amount.max === '' ? Infinity : parseFloat(filterConfig.amount.max)

            filtered = filtered.filter((i) => {
                let value
                value = parseFloat(i.amount_in_usd)
                return i.amount_in_usd >= min_value && value <= max_value;
            })
        }

        if (search !== '') {
            filtered = filtered.filter(item => {
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(search)
                );
            });
        }

        // filtered = filtered.filter((i) => {
        //     return filterConfig.statuses.some((ii) => ii === i.status)
        // })

        const sorted = [...filtered].sort((a, b) => {
            const valueA = sortConfig.field === 'datetime' ? new Date(a[sortConfig.field]) : a[sortConfig.field];
            const valueB = sortConfig.field === 'datetime' ? new Date(b[sortConfig.field]) : b[sortConfig.field];

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        })

        const formattedTopups = sorted.map((transaction) => ({
            ...transaction,
            datetime: new Date(transaction.datetime).toLocaleString('ru-RU', {
                hour12: false,
            }).replace(/,/g, ''),
            usdt_amount: parseFloat(transaction.usdt_amount.toFixed(2)),
        }));

        setFilteredTopups(formattedTopups);

    }, [
        topups,
        sortConfig,
        filterConfig,
        search,
        applyAmountMin,
        applyAmountMax,
        applyStartDate,
        applyEndDate,
    ]);


    const toggleStatus = (status) => {
        setFilterConfig((prev) => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? (prev.statuses.length > 1 ? prev.statuses.filter((s) => s !== status) : [...prev.statuses])
                : [...prev.statuses, status],
        }));
    };

    function handleStatusClick(event) {
        const buttonRect = event.target.getBoundingClientRect();

        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX,
        });

        setActiveModal(!activeModal ? "statusModal" : null); // Открываем модал для выбора статуса
    }

    const [closeIndex, setCloseIndex] = useState(0);

    const handleClose = () => {
        if (closeIndex === 0) {
            handleTodayFilter()
            setCloseIndex(1)
        }
        else {
            handleOldTransactionsFilter()
            setCloseIndex(0)
        }
    }
    const handleTodayFilter = () => {
        setFilterConfig(prev => ({ ...prev, today: true }));
        setFilterConfig(prev => ({ ...prev, oldTransactions: false }));
    };

    // Функция для установки флага oldTransactions в true
    const handleOldTransactionsFilter = () => {
        setFilterConfig(prev => ({ ...prev, oldTransactions: true }));
        setFilterConfig(prev => ({ ...prev, today: false }));
    };

    return (
        <div className='topups'>
            {modal && (
                <div className='modal' onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setModal(null)
                    }
                }}>
                    {modal === 'filter' && (
                        <div className='modal-tab filter'>
                            <h3>Фильтрация по сумме</h3>
                            <div className='amount'>
                                <div className='checkbox' onClick={() => {
                                    setFilterConfig({ ...filterConfig, amount: { ...filterConfig.amount, in_usd: !filterConfig.amount.in_usd } })
                                }}>
                                </div>
                                <input type="text" className='input-text' value={applyAmountMin} placeholder='От' onChange={(event) => {
                                    if (/^(\d*|\d+[,.]\d*)$/.test(event.target.value)) {
                                        const newValue = event.target.value.replace(/,/, '.');
                                        setApplyAmountMin(newValue);
                                    }
                                }} />
                                <input type="text" className='input-text' value={applyAmountMax} placeholder='До' onChange={(event) => {
                                    if (/^(\d*|\d+[,.]\d*)$/.test(event.target.value)) {
                                        const newValue = event.target.value.replace(/,/, '.');
                                        setApplyAmountMax(newValue);
                                    }
                                }} />
                            </div>
                            <div className="polosa"></div>
                            <h3>Фильтрация по дате</h3>
                            <div className="date-filters">
                                <div className="date_input_box">
                                    <label htmlFor="start-date">С:</label>
                                    <input className="date_input"
                                        id="start-date"
                                        type="date"
                                        name="start_date"
                                        value={applyStartDate}
                                        onChange={(event) => {
                                            setApplyStartDate(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="date_input_box">
                                    <label htmlFor="end-date">По:</label>
                                    <input className="date_input"
                                        id="end-date"
                                        type="date"
                                        name="end_date"
                                        value={applyEndDate}
                                        onChange={(event) => {
                                            setApplyEndDate(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="polosa"></div>
                            <div className="modul_butto_box">
                                <button onClick={handleApplyFilters}>Применить</button>
                                <button onClick={handleResetFilters}>Сбросить</button>
                                <button onClick={() => setModal(null)}>Закрыть</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <ChoiceModal
                isVisible={activeModal === "statusModal"} // Показываем модал, если активен "bankModal"
                position={modalPosition}
                options={statuses}
                selectedOptions={filterConfig.statuses}
                onToggleOption={toggleStatus}
                onClose={() => setActiveModal(null)} // Закрытие модала, сброс состояния
            />
            <div className='filter_and_sort'>
                <div className="input_box">
                    <input type="text" placeholder='Поиск' className='search-input' value={search}
                        onChange={(e) => setSearch(e.target.value.toLowerCase())} />
                    <div className="clouse_input" onClick={() => setSearch("")}>
                        <img className="cluse_svg" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMjQ7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9ImluZm8iLz48ZyBpZD0iaWNvbnMiPjxwYXRoIGQ9Ik0xNC44LDEybDMuNi0zLjZjMC44LTAuOCwwLjgtMiwwLTIuOGMtMC44LTAuOC0yLTAuOC0yLjgsMEwxMiw5LjJMOC40LDUuNmMtMC44LTAuOC0yLTAuOC0yLjgsMCAgIGMtMC44LDAuOC0wLjgsMiwwLDIuOEw5LjIsMTJsLTMuNiwzLjZjLTAuOCwwLjgtMC44LDIsMCwyLjhDNiwxOC44LDYuNSwxOSw3LDE5czEtMC4yLDEuNC0wLjZsMy42LTMuNmwzLjYsMy42ICAgQzE2LDE4LjgsMTYuNSwxOSwxNywxOXMxLTAuMiwxLjQtMC42YzAuOC0wLjgsMC44LTIsMC0yLjhMMTQuOCwxMnoiIGlkPSJleGl0Ii8+PC9nPjwvc3ZnPg==' alt="" />
                    </div>
                </div>


                {/* <button className='sort' onClick={() => setModal('sort')}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                        <path d='M 4.207,-2.798598e-8 0,4.207 1.414,5.621 3.207,3.828 v 10.586 h 2 V 3.828 L 7,5.621 8.414,4.207 Z M 11.207,14.828 7,10.621 8.414,9.207 10.207,11 V 0.41399997 h 2 V 11 L 14,9.207 l 1.414,1.414 z' />
                    </svg>
                    &nbsp;{sortConfig.name}
                </button> */}

                <button
                    className='sort'
                    onClick={handleClose}
                    style={closeIndex === 1 ? { 'background': '#4f46e5', 'color': '#ffffff' } : null}>Сегодня
                </button>

                <button className='filter' onClick={() => setModal('filter')}>
                    Фильтры
                </button>
            </div>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            <th
                                onClick={() => {
                                    if (sortConfig.field === 'datetime') {
                                        if (sortConfig.direction === 'asc') {
                                            setSortConfig({ field: 'datetime', direction: 'desc', name: 'Новые' })
                                        } else {
                                            setSortConfig({ field: 'datetime', direction: 'asc', name: 'Старые' })
                                        }
                                    } else {
                                        setSortConfig({ field: 'datetime', direction: 'desc', name: 'Новые' })
                                    }
                                }}
                            >Дата{sortArrow('datetime')}</th>
                            <th>Пользователь</th>
                            {/* <th onClick={handleStatusClick}
                                title={`${filterConfig.statuses.length === 1 ? statuses[filterConfig.statuses[0]] : 'Все'}`}
                                style={{ width: 'fit-content' }}
                            >Статус</th> */}
                            <th
                                onClick={() => {
                                    if (sortConfig.field === 'amount_in_usd') {
                                        if (sortConfig.direction === 'asc') {
                                            setSortConfig({ field: 'amount_in_usd', direction: 'desc', name: 'Сумма $ больше' })
                                        } else {
                                            setSortConfig({ field: 'amount_in_usd', direction: 'asc', name: 'Сумма $ меньше' })
                                        }
                                    } else {
                                        setSortConfig({ field: 'amount_in_usd', direction: 'desc', name: 'Сумма $ больше' })
                                    }
                                }}

                            >Сумма{sortArrow('amount_in_usd')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTopups.length > 0 && filteredTopups.map(i => {
                            const user = filteredUsers.find(u => u.id === i.user_id);
                            if (!user) return null;

                            return (
                                <tr key={i.id}>
                                    <td>{i.datetime}</td>
                                    <td><a target="_blank" href={`https://t.me/${user.tg_username}`}>@{user.tg_username}</a></td>
                                    {/* <td className={i.status}>{statusToSvg[i.status]}</td> */}
                                    <td><a target="_blank" href={`https://tronscan.org/#/transaction/${i.transaction_hash}`}>{i.usdt_amount.toFixed(2) + ' ₮'}</a></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Users() {
    const [users, setUsers] = useState([]); // Массив пользователей
    const [filteredUsers, setFilteredUsers] = useState([]); // Фильтрованный массив пользователей
    const inputRef = useRef(null)
    const [editingUserId, setEditingUserId] = useState(null); // ID пользователя, чей баланс редактируется

    useEffect(() => {
        async function getUsers() {
            const response = await axiinstance.get('/admin/users/');
            if (response.data) {
                setUsers(response.data.result);
            }
        }
        getUsers()
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingUserId]);

    useEffect(() => {
        const formattedUsers = users.map((transaction) => ({
            ...transaction,
            registered_at: new Date(transaction.registered_at).toLocaleString('ru-RU', {
                hour12: false,
            }).replace(/,/g, ''),
        }));


        setFilteredUsers(formattedUsers);

    }, [users])

    async function save_balance(id, balance) {
        try {
            await axiinstance.patch('/admin/user/' + id + '/', { usdt_balance: Number(balance), role: "admin" });
            setUsers(users.map(item =>
                item.id === id
                    ? { ...item, usdt_balance: balance }
                    : item
            )
            )
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='users'>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            <th>Дата регистрации</th>
                            <th>Имя</th>
                            <th>Username tg</th>
                            <th>Баланс</th>
                            <th>Статистика</th>
                            <th>Наставник</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 &&
                            filteredUsers.map((i) => (
                                <tr key={i.id}>
                                    <td>{i.registered_at}</td>
                                    <td>{i.first_name}</td>
                                    <td><a target="_blank" href={`https://t.me/${i.tg_username}`}>@{i.tg_username}</a></td>
                                    <td onClick={() => {
                                        setEditingUserId(editingUserId === i.id ? null : i.id)
                                    }}>
                                        {editingUserId !== i.id ?
                                            (<span>{floatToStr(i.usdt_balance)} ₮</span>)
                                            :
                                            (<input type="text" className='input-in-table' ref={inputRef}
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter' && event.target.value !== "") {
                                                        save_balance(i.id, event.target.value);
                                                    }
                                                    if (event.key === "Enter" || event.key === "Escape") {
                                                        setEditingUserId(null);
                                                    }
                                                }} />)}
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Currencies() {
    const [currencies, setCurrencies] = useState([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [banks, setBanks] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalBank, setModalBank] = useState(false);
    const [modalForm, setModalForm] = useState({
        name: '',
        code: '',
        symbol: '',
        percent: '',
        min_amount: '',
        commission_step: ''
    });
    const [modalBankForm, setModalBankForm] = useState({
        name: '',
        code: '',
    });
    const [zeroErrors, setZeroErrors] = useState(false);
    const notificationRef = useRef(null);
    const [notificationText, setNotificationText] = useState('');
    const [inputRefs, setInputRefs] = useState({}); // Ссылки на input для каждого параметра
    const [editMode, setEditMode] = useState({}); // Объект для отслеживания режима редактирования

    function changeModalValue(event) {
        let className = event.target.className;
        let value = event.target.value;

        if (className === 'percent') {
            value = value.replace(/,/, '.');
            if (/^([+\d-]*|[+\d-]+\.\d*)$/.test(value)) {
                setModalForm({ ...modalForm, [className]: value });
            }
        }
        else if (className === 'min_amount' || className === 'commission_step') {
            value = value.replace(/,/, '.');
            if (/^(\d*|\d+\.\d*)$/.test(value)) {
                setModalForm({ ...modalForm, [className]: value });
            }
        }
        else {
            setModalForm({ ...modalForm, [className]: value });
        }
        setZeroErrors(Object.values(modalForm).every(value => value !== ""))
    }

    function changeModaBanklValue(event) {
        let className = event.target.className;
        let value = event.target.value;

        setModalBankForm({ ...modalBankForm, [className]: value });

        setZeroErrors(Object.values(modalBankForm).every(value => value !== ""))
    }

    async function createBankButton() {
        await setZeroErrors(Object.values(modalBankForm).every(value => value !== ""))
        if (zeroErrors) {
            await axiinstance.post('admin/bank/', modalBankForm).catch((error) => {
                if (!error.response.data.detail.ok) {
                    callNotification("Банк уже создан")
                }
            })
            setModalBank(false)
        }
    }

    async function createButton() {
        await setZeroErrors(Object.values(modalForm).every(value => value !== ""))
        if (zeroErrors) {
            await axiinstance.post('admin/create_currency/', modalForm)
            setModal(false)
        }
    }

    async function handleKeyDown(event) {
        if (event.key === 'Escape' && modal) {
            setModal(false)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        async function getCurrencies() {
            const response = await axiinstance.get('/admin/currencies/');
            if (response.data) {
                setCurrencies(response.data.result);
            }
        }
        getCurrencies()
        async function getBanks() {
            const response = await axiinstance.get('/admin/banks/');
            if (response.data) {
                setBanks(response.data.result);
            }
        }
        getBanks()

    }, [modal, modalBank]);

    useEffect(() => {
        const formattedCurrencies = currencies.map((transaction) => ({
            ...transaction,
            datetime: new Date(transaction.datetime).toLocaleString('ru-RU', {
                hour12: false,
            }).replace(/,/g, ''),
        }));


        setFilteredCurrencies(formattedCurrencies);

    }, [currencies])

    function callNotification(text, seconds = 3) {
        setNotificationText(text);

        if (notificationRef.current) {
            notificationRef.current.show();

            // Если есть уже активный таймер, отменяем его
            if (notificationTimer) {
                clearTimeout(notificationTimer);
            }

            // Устанавливаем новый таймер
            notificationTimer = setTimeout(() => {
                // Добавляем класс для плавного исчезновения
                notificationRef.current.classList.add('fade-out');
                setTimeout(() => {
                    notificationRef.current.close();
                    setNotificationText('');
                    // Убираем класс после закрытия
                    notificationRef.current.classList.remove('fade-out');
                }, 1000); // Время совпадает с длительностью анимации
            }, (seconds - 1) * 1000); // Учёт последней секунды для анимации
        }
    }

    // Функция для сохранения изменений на сервере
    const saveParameter = async (id, field, value) => {
        try {
            await axiinstance.patch(`/admin/currency/${id}/`, { [field]: value });
            setFilteredCurrencies(
                filteredCurrencies.map(item =>
                    item.id === id
                        ? { ...item, [field]: value }
                        : item
                )
            );
        } catch (error) {
            if (error.response.data.detail) {
                error.response.data.detail.forEach(element => {
                    if (element.type === 'float_parsing') {
                        callNotification("Введите число")
                    }
                });
            }
            console.error('Ошибка сохранения данных:', error);
        }
    };


    // Установка ссылок на input
    useEffect(() => {
        const refs = {};
        filteredCurrencies.forEach(currency => {
            Object.keys(currency).forEach(field => {
                refs[currency.id + '-' + field] = React.createRef();
            });
        });
        setInputRefs(refs);
    }, [filteredCurrencies]);

    // Форматирование значений для отображения
    const getFormattedFieldValue = (field, value) => {
        switch (field) {
            case 'commission_step':
                return floatToStr(value) + ' %';
            case 'min_amount':
                return floatToStr(value) + ' ₽';
            case 'percent':
                return floatToStr(value) + ' %';
            default:
                return value;
        }
    };

    return (
        <div className='currencies'>
            <dialog ref={notificationRef} className='notification'>
                {notificationText}
            </dialog>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Код</th>
                            <th>Символ</th>
                            <th>Курс</th>
                            <th>Процент</th>
                            <th>Минимальная сумма</th>
                            <th>Ступень комиссии</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredCurrencies.length > 0 && filteredCurrencies.map(currency => (
                                <tr key={currency.id}>
                                    {Object.keys(currency)
                                        .filter(field => field !== 'id' && field !== 'datetime') // Исключаем поле 'id'
                                        .map(field => (
                                            <td key={`${currency.id}-${field}`} onClick={(e) => {
                                                setEditMode({
                                                    ...editMode,
                                                    [currency.id + '-' + field]: !editMode[currency.id + '-' + field]
                                                });

                                                e.stopPropagation();
                                            }}>
                                                {editMode[currency.id + '-' + field] ? (
                                                    <input
                                                        type="text"
                                                        className='input-in-table'
                                                        ref={inputRefs[currency.id + '-' + field]}

                                                        onKeyUp={event => {
                                                            if (event.key === 'Enter' && event.target.value !== '') {
                                                                saveParameter(currency.id, field, event.target.value);
                                                            }
                                                            if (['Enter', 'Escape'].includes(event.key)) {
                                                                setEditMode({
                                                                    ...editMode,
                                                                    [currency.id + '-' + field]: false
                                                                });
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <span>{getFormattedFieldValue(field, currency[field])}</span>
                                                )}
                                            </td>
                                        ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {modal ? (
                <div className='modal' onClick={() => setModal(false)}>
                    <div
                        className='modal-tab'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Новая валюта</h3>
                        <div className='input-group'>
                            <p>Название валюты</p>
                            <input
                                type="text"
                                className='name'
                                value={modalForm.name}
                                onChange={changeModalValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Код валюты</p>
                            <input
                                type="text"
                                className='code'
                                value={modalForm.code}
                                onChange={changeModalValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Символ</p>
                            <input
                                type="text"
                                className='symbol'
                                value={modalForm.symbol}
                                onChange={changeModalValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Процент</p>
                            <input
                                type="text"
                                className='percent'
                                value={modalForm.percent}
                                onChange={changeModalValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Минимальная сумма</p>
                            <input
                                type="text"
                                className='min_amount'
                                value={modalForm.min_amount}
                                onChange={changeModalValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Ступень комиссии</p>
                            <input
                                type="text"
                                className='commission_step'
                                value={modalForm.commission_step}
                                onChange={changeModalValue}
                            />
                        </div>
                        <button
                            className={zeroErrors ? '' : 'inactive'}
                            onClick={createButton}
                        >
                            Создать
                        </button>
                    </div>
                </div>
            ) : (null)}
            <button className='create-currency' onClick={() => setModal(true)}>
                Создать новую валюту
            </button>
            <div className='table'>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Код</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.length > 0 &&
                            banks.map((i) => (
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td>{i.name}</td>
                                    <td>{i.code}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {modalBank ? (
                <div className='modal' onClick={() => setModalBank(false)}>
                    <div
                        className='modal-tab'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Новый банк</h3>
                        <div className='input-group'>
                            <p>Название банка</p>
                            <input
                                type="text"
                                className='name'
                                value={modalBankForm.name}
                                onChange={changeModaBanklValue}
                            />
                        </div>
                        <div className='input-group'>
                            <p>Код банка</p>
                            <input
                                type="text"
                                className='code'
                                value={modalBankForm.code}
                                onChange={changeModaBanklValue}
                            />
                        </div>
                        <button
                            className={zeroErrors ? '' : 'inactive'}
                            onClick={createBankButton}
                        >
                            Создать
                        </button>
                    </div>
                </div>
            ) : (null)}
            <button className='create-currency' onClick={() => setModalBank(true)}>
                Создать новый банк
            </button>
        </div>
    )
}

export default function Admin() {
    const [auth, setAuth] = useState(null);
    const [activeLabel, setActiveLabel] = useState(null);

    const navigate = useNavigate()
    const location = useLocation();

    const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 500) {
            setScrollToTopVisible(true);
        } else {
            setScrollToTopVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiinstance('admin/check_auth/')
                setAuth(true)
            } catch {
                setAuth(false)
            }
        }
        checkAuth()
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    useEffect(() => {
        const currentPath = location.pathname.split('/').pop(); // Получаем последний сегмент URL
        if (['stats', 'withdraws', 'topups', 'users', 'currencies'].includes(currentPath)) {
            setActiveLabel(currentPath);
        }
    }, [location]);

    const changeLabel = (label) => {
        setActiveLabel(label);
        navigate(`/admin/${label}`);
    };

    return (
        <div className='admin'>
            {auth === false &&
                <Routes>
                    <Route path='auth' element={<Auth />} />
                    <Route path='*' element={<Navigate to='/admin/auth' />} />
                </Routes>
            }
            {auth === true &&
                <div className='container'>
                    <div className='labels'>
                        <button
                            className={`label stats ${activeLabel === 'stats' ? 'active' : ''}`}
                            onClick={() => { changeLabel('stats') }}
                        >Статистика</button>
                        <button
                            className={`label withdraws ${activeLabel === 'withdraws' ? 'active' : ''}`}
                            onClick={() => { changeLabel('withdraws') }}
                        >Выводы</button>
                        <button
                            className={`label topups ${activeLabel === 'topups' ? 'active' : ''}`}
                            onClick={() => { changeLabel('topups') }}
                        >Пополнения</button>
                        <button
                            className={`label users ${activeLabel === 'users' ? 'active' : ''}`}
                            onClick={() => { changeLabel('users') }}
                        >Пользователи</button>
                        <button
                            className={`label currencies ${activeLabel === 'currencies' ? 'active' : ''}`}
                            onClick={() => { changeLabel('currencies') }}
                        >Настройки</button>
                    </div>
                    <div className='tab'>
                        <Routes>
                            <Route path='stats' element={<Stats />} />
                            <Route path='withdraws' element={<Withdraws />} />
                            <Route path='topups' element={<TopUps />} />
                            <Route path='users' element={<Users />} />
                            <Route path='currencies' element={<Currencies />} />
                            <Route path='*' element={<Navigate to='/admin/stats' />} />
                        </Routes>
                    </div>
                </div>
            }
            {scrollToTopVisible &&
                <div
                    className="scroll-to-top"
                    onClick={scrollToTop}
                >
                    ↑
                </div>
            }
        </div>
    )
}