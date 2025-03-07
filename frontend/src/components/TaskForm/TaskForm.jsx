import { useState, useEffect, useMemo } from 'react';
import CheckIcon from '../../assets/check.svg';
import ChevronLeftIcon from '../../assets/chevron-left.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const TaskForm = ({ onSubmit, edit, currentTask, goals }) => {
  const emptyTask = useMemo(
    () => ({
      id: '',
      name: '',
      description: '',
      goalId: '',
      completed: false,
      endDate: new Date(),
    }),
    []
  );
  const initalTask = currentTask
    ? {
        id: currentTask.id || '',
        name: currentTask.name || '',
        description: currentTask.description || '',
        goalId: currentTask.goalId || '',
        completed: currentTask.completed || false,
        endDate: currentTask.endDate || null,
      }
    : emptyTask;
  const initalEndDate = currentTask ? currentTask.endDate : new Date();
  const incompleteState = useMemo(
    () => ({
      submitted: false,
      name: true,
      description: true,
      goalId: true,
    }),
    []
  );
  const [task, setTask] = useState(initalTask);
  const [incomplete, setIncomplete] = useState(incompleteState);
  const [endDate, setEndDate] = useState(initalEndDate);

  useEffect(() => {
    if (currentTask) {
      setTask({
        id: currentTask.id || '',
        name: currentTask.name || '',
        goalId: currentTask.goalId || '',
        description: currentTask.description || '',
        completed: currentTask.completed || false,
        endDate: currentTask.endDate || null,
      });
      setEndDate(currentTask.endDate);
    } else {
      setTask(emptyTask);
      setEndDate(emptyTask.endDate);
    }

    setIncomplete(incompleteState);
  }, [currentTask, emptyTask, incompleteState]);

  const setTaskName = (name) => {
    setTask((prevTask) => ({ ...prevTask, name }));
    setIncomplete((prev) => ({ ...prev, name: false }));
  };

  const setTaskDescription = (description) => {
    setTask((prevTask) => ({ ...prevTask, description }));
    setIncomplete((prev) => ({ ...prev, description: false }));
  };

  const setTaskGoalId = (goalId) => {
    console.log('setting goal id', goalId);
    setTask((prevTask) => ({ ...prevTask, goalId }));
    setIncomplete((prev) => ({ ...prev, goal: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitting form');
    if (task.name === '' || task.description === '' || task.goalId === '') {
      setIncomplete({
        submitted: true,
        name: task.name === '',
        description: task.description === '',
        goalId: task.goalId === '',
      });
    } else {
      const trimmedName = task.name.trim();
      const trimmedDescription = task.description.trim();
      onSubmit({
        ...task,
        name: trimmedName,
        description: trimmedDescription,
        endDate: endDate,
      });
      setTask(emptyTask);
      setEndDate(emptyTask.endDate);
      document.getElementById('goal-selection').selectedIndex = 0;
    }
  };

  return (
    <dialog id='task-form-modal' className='modal'>
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
                  document.getElementById('task-form-modal').close();
                  setIncomplete(incompleteState);
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
              <label>{edit ? 'Edit Task' : 'Create a Task'}</label>
            </div>
            <div className='flex flex-col gap-2'>
              <p>Name</p>
              <input
                type='text'
                id='task'
                placeholder='Input name of task'
                className='input input-bordered w-full'
                value={task.name ?? ''}
                onChange={(e) => setTaskName(e.target.value)}
                data-testid='form-input-name-element'
              />
              {incomplete.submitted && incomplete.name && (
                <p className='text-red-600'>Missing Name!</p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <p>Select Goal</p>
              <select
                id='goal-selection'
                defaultValue={task.goalId ? task.goalId : 'Select a goal'}
                className='select'
                onChange={(e) => setTaskGoalId(e.target.value)}
              >
                <option disabled={true}>Select a goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
              {incomplete.submitted && incomplete.goalId && (
                <p className='text-red-600'>Missing Goal!</p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <p>Description</p>
              <textarea
                id='task'
                placeholder='Input description of task'
                className='textarea textarea-bordered w-full'
                value={task.description ?? ''}
                onChange={(e) => setTaskDescription(e.target.value)}
                data-testid='form-input-description-element'
              />
              {incomplete.submitted && incomplete.description && (
                <p className='text-red-600'>Missing Description!</p>
              )}
            </div>
            <div>
              <div className='flex flex-col gap-2'>
                <p>Select End Date and time</p>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className='input input-bordered w-full'
                  showTimeSelect
                  dateFormat='MMMM d, yyyy h:mm aa'
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
                  document.getElementById('task-form-modal').close();
                  setIncomplete(incompleteState);
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
                {edit ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  currentTask: PropTypes.object,
  goals: PropTypes.array,
};

export default TaskForm;
