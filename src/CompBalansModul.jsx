import React, { useRef, useState } from 'react';

const BalanceEditModal = ({ isVisible, position, balance, onSave, onClose }) => {
    const modalRef = useRef(null);
    const [newBalance, setNewBalance] = useState(balance);

    if (!isVisible) {
        return null;
    }

    const handleChange = (event) => {
        setNewBalance(event.target.value);
    };

    const handleSave = () => {
        onSave(newBalance);
    };

    return (
        <div
            className="choice-modal"
            ref={modalRef}
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            <label className="balance-input">Новый баланс:</label>
            <input
                className='input-text'
                placeholder='Введите новый баланс'
                type="number"
                id="balance-input"
                value={newBalance}
                onChange={handleChange}
            />
            <br />
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default BalanceEditModal;