import Header from '../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import ExampleModal from '../components/ui/ExampleModal';
import { useState } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  // add this hook to get the current auth state
  const { user, loggedIn, auth } = useAuth();
  const [tasks, set_tasks] = useState([
    { name: '💧 Drink water', time: '5:00pm' },
    { name: '🚶 Take a walk', time: '6:00pm' },
  ]);

  const [goals, set_goals] = useState([
    { name: '💪 Be healthier', description: '' },
    { name: '🌲 Go outdoors more!', description: '' },
  ]);

  const [new_task, set_new_task] = useState({ name: '', time: '' });

  const [new_goal, set_new_goal] = useState({ name: '', description: '' });

  // Event handler for adding new task
  const handle_add_task = () => {
    if (new_task.name && new_task.time) {
      set_tasks([...tasks, new_task]);
      set_new_task({ name: '', time: '' });

      document.getElementById('add-task-modal').checked = false;
    }
  };

  // Event handler for deleting a task
  const handle_delete_task = (index) => {
    set_tasks(tasks.filter((_, i) => i !== index));
  };

  // Event handler for adding a new goal
  const handle_add_goal = () => {
    if (new_goal.name && new_goal.description) {
      set_goals([...goals, new_goal]);
      set_new_goal({ name: '', description: '' });

      document.getElementById('add-goal-modal').checked = false;
    }
  };

  //event handler for deleting a goal
  const handle_delete_goal = (index) => {
    set_goals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col h-screen w-full min-w-[1024px]'>
      {/* Header*/}
      <Header />

      {/* Main content */}
      <div className='flex flex-1 bg-white font-inter'>
        {/* Sidebar*/}
        <div className='w-1/4 min-w-[250px] bg-zinc-100 p-4 flex flex-col border-r-4 border-zinc-200 shadow-2xl'>
          {/* Tasks*/}
          <h3 className='text-base font-bold mb-2 pb-2 pr-2'>Tasks</h3>
          <ul className='mb-4'>
            {tasks.map((task, index) => (
              <li key={index}>
                <label
                  htmlFor={`task-modal-${index}`}
                  className='flex justify-between text-sm cursor-pointer'
                >
                  {task.name} <span>{task.time}</span>
                </label>
                <ExampleModal
                  id={`task-modal-${index}`}
                  title={task.name}
                  description={`Scheduled for ${task.time}`}
                  delete_func={() => handle_delete_task(index)}
                />
              </li>
            ))}
          </ul>
          {/*Goals*/}
          <h3 className='text-base font-bold pb-2 pr-2 mb-2'>Goals</h3>
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>
                <label
                  htmlFor={`goal-modal-${index}`}
                  className='text-sm cursor-pointer'
                >
                  {goal.name}
                </label>
                <ExampleModal
                  id={`goal-modal-${index}`}
                  title={goal.name}
                  description={goal.description || 'No description'}
                  delete_func={() => handle_delete_goal(index)}
                />
              </li>
            ))}
          </ul>

          {/*Add Tasks and Goals*/}
          <div className='mt-auto flex flex-col gap-2'>
            <label
              htmlFor='add-task-modal'
              className='btn btn-link text-accent cursor-pointer'
            >
              + Add Task
            </label>
            <ExampleModal
              id='add-task-modal'
              title='Add New Task'
              description={
                <div>
                  <input
                    type='text'
                    placeholder='Task Name'
                    className='input input-bordered w-full my-2'
                    value={new_task.name}
                    onChange={(e) =>
                      set_new_task({ ...new_task, name: e.target.value })
                    }
                  />
                  <input
                    type='time'
                    className='input input-bordered w-full my-2'
                    value={new_task.time}
                    onChange={(e) =>
                      set_new_task({ ...new_task, time: e.target.value })
                    }
                  />
                  <button
                    onClick={handle_add_task}
                    className='btn btn-primary w-full'
                  >
                    Save Task
                  </button>
                </div>
              }
            />
            <label
              htmlFor='add-goal-modal'
              className='btn btn-link text-accent cursor-pointer'
            >
              + Add Goal
            </label>
            <ExampleModal
              id='add-goal-modal'
              title='Add New Goal'
              description={
                <div>
                  <input
                    type='text'
                    placeholder='Goal Name'
                    className='input input-bordered w-full my-2'
                    value={new_goal.name}
                    onChange={(e) =>
                      set_new_goal({ ...new_goal, name: e.target.value })
                    }
                  />
                  <textarea
                    placeholder='Goal Description'
                    className='textarea textarea-bordered w-full my-2'
                    value={new_goal.description}
                    onChange={(e) =>
                      set_new_goal({ ...new_goal, description: e.target.value })
                    }
                  ></textarea>
                  <button
                    onClick={handle_add_goal}
                    className='btn btn-primary w-full'
                  >
                    Save Goal
                  </button>
                </div>
              }
            />
          </div>
        </div>

        {/* Character*/}
        <div className='flex flex-1 justify-center items-center flex-col pb-4'>
          <img
            src='/images/monster-transparentbg.png'
            alt='TaskaGoTchi Character'
            className='w-96 h-96 object-contain mt-8 mb-8'
          />

          <div className='w-96 h-24 bg-zinc-100 rounded-lg flex flex-col justify-center relative mt-8 shadow-xl'>
            {/* Health Bar*/}
            <span className='absolute top-0 left-2 text-sm font-semibold text-accent'>
              Health: 50/100
            </span>
            <progress
              className='progress progress-secondary border border-accent w-96 h-10'
              value={50}
              max='100'
            ></progress>
          </div>
        </div>

        {/* Stats button */}
        {/* TODO: route properly */}
        <div className='absolute top-4 right-4'>
          <button className='btn btn-accent ' onClick={() => navigate('/')}>
            stats
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
