import { useState } from 'react';
import CheckIcon from '../../assets/check.svg';
import ChevronLeftIcon from '../../assets/chevron-left.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const GoalForm = ({ onSubmit, edit }) => {
  const emptyGoal = {
    name: '',
    description: '',
    completed: false,
    endDate: Date.now(),
  };
  const incompleteState = {
    submitted: false,
    name: true,
    description: true,
  };
  const [goal, setGoal] = useState(emptyGoal);
  const [incomplete, setIncomplete] = useState(incompleteState);
  const [endDate, setEndDate] = useState(emptyGoal.endDate);

  const setGoalName = (name) => {
    setGoal({ ...goal, name });
  };

  const setGoalDescription = (description) => {
    setGoal({ ...goal, description });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-center'>
      <div className='w-[32rem] flex flex-col gap-4'>
        <div className='flex flex-row gap-2'>
          <button className='btn btn-outline btn-xs'>
            <img
              src={ChevronLeftIcon}
              alt='back-icon'
              width={16}
              height={16}
            ></img>
          </button>
          <label htmlFor='goal'>Create a Goal</label>
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
          <p>Select End Date (optional)</p>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        <div className='flex flex-row gap-2'>
          <button
            type='cancel'
            className='btn btn-secondary flex flex-row items-center'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='btn btn-primary flex flex-row items-center'
          >
            <img src={CheckIcon} alt='check-icon' width={16} height={16} />
            {edit ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </div>
    </form>
  );
};

GoalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  edit: PropTypes.bool,
};

export default GoalForm;
