import React, { useState } from 'react';
import CheckIcon from '../assets/check.svg';
import ChevronLeftIcon from '../assets/chevron-left.svg';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const Example = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  );
};

const GoalForm = ({ onSubmit, edit }) => {
  const emptyGoal = {
    name: '',
    description: '',
    completed: false,
    endDate: Date.now(),
  };
  const [goal, setGoal] = useState(emptyGoal);

  const setGoalName = (name) => {
    name = name.trim();
    setGoal({ ...goal, name });
  };

  const setGoalDescription = (description) => {
    description = description.trim();
    setGoal({ ...goal, description });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(goal);
    setGoal(emptyGoal);
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
          />
        </div>
        <div className='flex flex-col gap-2'>
          <p>Description</p>
          <textarea
            id='goal'
            placeholder='Input description of goal'
            className='textarea textarea-bordered w-full'
            value={goal.description ?? ''}
            onChange={(e) => setGoalDescription(e.target.value)}
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

export default GoalForm;
