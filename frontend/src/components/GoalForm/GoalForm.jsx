import { useState } from 'react';
import CheckIcon from '../../assets/check.svg';
import ChevronLeftIcon from '../../assets/chevron-left.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import useAxiosPrivate from '../../../auth/hooks/useAxiosPrivate';

const GoalForm = ({ onSubmit, edit }) => {
  const axiosPrivate = useAxiosPrivate();
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

  const handleSubmit = async (e) => {
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
      try {
        const requestBody = {
          title: trimmedName,
          description: trimmedDescription,
          deadline: endDate,
        };
        const response = await axiosPrivate.post('/goals', requestBody);

        const isSuccessful = response.data.success;
        console.log('Response:', response.data, response.data.success);
        if (!isSuccessful) {
          throw new Error('Failed to create goal');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      document.getElementById('goal-form-modal').close();
      setGoal(emptyGoal);
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
              {/* <button className='btn btn-outline btn-xs'>
                <img
                  src={ChevronLeftIcon}
                  alt='back-icon'
                  width={16}
                  height={16}
                ></img>
              </button> */}
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
              <div className='flex flex-col gap-2'>
                <p>Select End Date (optional)</p>
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
                onClick={() =>
                  document.getElementById('goal-form-modal').close()
                }
              >
                Cancel
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
};

export default GoalForm;
