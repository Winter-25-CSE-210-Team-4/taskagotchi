import React from "react";

const ExampleModal = ({ id, title, description }) => {
    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <div className="py-4">{description}</div>
                    <div className="modal-action">
                        <label htmlFor={id} className="btn">Close</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExampleModal;
