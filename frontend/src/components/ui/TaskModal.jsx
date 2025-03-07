import PropTypes from 'prop-types';

const TaskModal = ({ id, name, description, deadline, onEdit }) => {
  return (
    <>
      <input type='checkbox' id={id} className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-lg font-bold'>{name}</h3>
          <div className='py-4'>{description}</div>
          <div className='py-4'>Scheduled for {deadline}</div>
          <div className='modal-action'>
            <label className='btn btn-primary' onClick={() => onEdit(id)}>
              Edit
            </label>
            <label htmlFor={id} className='btn'>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

TaskModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  deadline: PropTypes.string,
  onEdit: PropTypes.func,
};

export default TaskModal;
