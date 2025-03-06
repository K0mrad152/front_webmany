import React, { useRef, useState } from 'react';
import { axiinstance } from "./config.jsx";

const StatusEditModal = ({ isVisible, position, status, statusId, onSave, onClose }) => {
    const modalRef = useRef(null);
    const [newStatus, setNewStatus] = useState();

    if (!isVisible) {
        return null;
    }

    const handleChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSave = (e, i) => {
        axiinstance.patch('/admin/withdraw/' + e+'/', { status: i }).then(() => {
            onClose()
        })
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
            <select className="input-text" id="status-input" onChange={handleChange}>
                <option key="Выбор" value="" ></option>
            {Object.entries(status).map(([value, label]) => (
                <option key={value} value={value} onChange={handleChange}>{label}</option>
            ))}
            </select>
            <br />
            <button onClick={()=>handleSave(statusId, newStatus)}>Сохранить</button>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default StatusEditModal;