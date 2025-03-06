import { useState, useEffect, useMemo } from 'react';
import CheckIcon from '../../assets/check.svg';
import ChevronLeftIcon from '../../assets/chevron-left.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const GoalForm = ({ onSubmit, edit, currentGoal }) => {
  const emptyGoal = useMemo(
    () => ({
      id: '',
      name: '',
      description: '',
      completed: false,
      endDate: Date.now(),
    }),
    []
  );
  const initalGoal = currentGoal
    ? {
        id: currentGoal.id || '',
        name: currentGoal.name || '',
        description: currentGoal.description || '',
        completed: currentGoal.completed || false,
        endDate: currentGoal.endDate || null,
      }
    : emptyGoal;
  const initalEndDate = currentGoal ? currentGoal.endDate : Date.now();
  const incompleteState = useMemo(
    () => ({
      submitted: false,
      name: true,
      description: true,
    }),
    []
  );
  const [goal, setGoal] = useState(initalGoal);
  const [incomplete, setIncomplete] = useState(incompleteState);
  const [endDate, setEndDate] = useState(initalEndDate);

  // TODO: fix edit and lint
  const [endDate, setEndDate] = useState(initalEndDate);

  // TODO: fix edit and lint

  useEffect(() => {
    if (currentGoal) {
      setGoal({
        id: currentGoal.id || '',
        name: currentGoal.name || '',
        description: currentGoal.description || '',
        completed: currentGoal.completed || false,
        endDate: currentGoal.endDate || null,
      });
      setEndDate(currentGoal.endDate);
    } else {
      setGoal(emptyGoal);
      setEndDate(emptyGoal.endDate);
    }

    setIncomplete(incompleteState);
  }, [currentGoal, emptyGoal, incompleteState]);

  const setGoalName = (name) => {
    setGoal((prevGoal) => ({ ...prevGoal, name }));
    setIncomplete((prev) => ({ ...prev, name: false }));
  };

  const setGoalDescription = (description) => {
    setGoal((prevGoal) => ({ ...prevGoal, description }));
    setIncomplete((prev) => ({ ...prev, description: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitting form');
    if (goal.name === '' || goal.description === '') {
      setIncomplete({
        submitted: true,
        name: goal.name === '',
        description: goal.description === '',
      });
    } else {
      const trimmedName = goal.name.trim();
      const trimmedDescription = goal.description.trim();
      onSubmit({
        ...goal,
        name: trimmedName,
        description: trimmedDescription,
        endDate: endDate,
      });
      setGoal(emptyGoal);
      setEndDate(emptyGoal.endDate);
    }
  };

  return (
    <dialog id='goal-form-modal' className='modal'>
      <div className='modal-box'>
        <form
          onSubmit={handleSubmit}
          className='flex justify-center'
          method='dialog'
        >
          <div className='w-[32rem] flex flex-col gap-4'>
            <div className='flex flex-row gap-2'>
              <button
                type='button'
                onClick={() => {
                  document.getElementById('goal-form-modal').close();
                  setIncomplete({
                    submitted: false,
                    name: false,
                    description: false,
                  });
                }}
                className='btn btn-outline btn-xs'
              >
                <img
                  src={ChevronLeftIcon}
                  alt='back-icon'
                  width={16}
                  height={16}
                ></img>
              </button>
              <label>{edit ? 'Edit Goal' : 'Create a Goal'}</label>
            </div>
            <div className='flex flex-col gap-2'>
              <p>Name</p>
              <input
                type='text'
                id='goal'
                placeholder='Input name of goal'
                className='input input-bordered w-full'
                value={goal.name ?? ''}
                onChange={(e) => setGoalName(e.target.value)}
                data-testid='form-input-name-element'
              />
              {incomplete.submitted && incomplete.name && (
                <p className='text-red-600'>Missing Name!</p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <p>Description</p>
              <textarea
                id='goal'
                placeholder='Input description of goal'
                className='textarea textarea-bordered w-full'
                value={goal.description ?? ''}
                onChange={(e) => setGoalDescription(e.target.value)}
                data-testid='form-input-description-element'
              />
              {incomplete.submitted && incomplete.description && (
                <p className='text-red-600'>Missing Description!</p>
              )}
            </div>
            <div>
              <div className='flex flex-col gap-2'>
                <p>Select End Date</p>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className='input input-bordered w-full'
                />
              </div>
            </div>

            <div className='flex flex-row gap-2'>
              {/* if there is a button in form, it will close the modal */}
              <button
                type='button'
                className='btn'
                data-testid='form-cancel-button'
                onClick={() => {
                  document.getElementById('goal-form-modal').close();
                  setIncomplete({
                    submitted: false,
                    name: false,
                    description: false,
                  });
                }}
              >
                Close
              </button>
              <button
                type='submit'
                className='btn btn-primary flex flex-row items-center'
                data-testid='form-submit-button'
              >
                <img src={CheckIcon} alt='check-icon' width={16} height={16} />
                {edit ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

GoalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  currentGoal: PropTypes.object,
};

export default GoalForm;
