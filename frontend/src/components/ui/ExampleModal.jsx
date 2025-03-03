import PropTypes from 'prop-types';


const ExampleModal = ({ id, title, description, delete_func }) => {
    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <div className="py-4">{description}</div>
                    <div className="modal-action">
                        {/* Delete Button */}
                        {delete_func && (
                            <button 
                                onClick={() => {
                                    delete_func();
                                    document.getElementById(id).checked = false;
                                }} 
                                className="btn btn-error"
                            >
                                Delete
                            </button>
                        )}

                        <label htmlFor={id} className="btn">Close</label>
                    </div>
                </div>
            </div>
        </>
    );
};

ExampleModal.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    delete_func: PropTypes.func,
};

export default ExampleModal;
