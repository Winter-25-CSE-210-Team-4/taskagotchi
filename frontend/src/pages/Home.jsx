import Header from '../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import GoalForm from '../components/GoalForm/GoalForm';
import ExampleModal from '../components/ui/ExampleModal'
import { useState } from 'react';
import Confetti from "react-confetti"

const HomePage = () => {
  const navigate = useNavigate();
  const [tasks, set_tasks] = useState([
    { name: '💧 Drink water', time: '5:00pm', completed: false},
    { name: '🚶 Take a walk', time: '6:00pm', completed: false },
  ]);

  const [goals, set_goals] = useState([
    { name: '💪 Be healthier', description: '' },
    { name: '🌲 Go outdoors more!', description: '' },
  ]);

  const [new_task, set_new_task] = useState({ name: '', time: '' });
  //const [new_goal, set_new_goal] = useState({ name: '', description: '' });

  const [curr_goal, set_curr_goal] = useState(null);
  const [edit_goal, set_edit_goal] = useState(false);

  const [xp, set_xp] = useState(0);
  const [confetti, set_confetti] = useState(false);


  //Event handler for opening goal form
  const open_goal_form = (goal = null) => {
    console.log("Opening form with: ", goal)
    set_curr_goal(goal);
    set_edit_goal(!!goal);
    document.getElementById('goal-form-modal').showModal();
    
    setTimeout(() => {
      const modal = document.getElementById('goal-form-modal');
      if (modal) modal.showModal();
    }, 0);
  }

   // Event handler for adding a new goal/submitting edits
   const handle_submit_goal = (goal) => {
    if(edit_goal) {
      set_goals(goals.map((g) => (g.name === curr_goal.name ? goal : g)));
    } else {
      set_goals([...goals, goal]);
    }

    document.getElementById('goal-form-modal').close();
    set_curr_goal(null);
    set_edit_goal(false);
  };
  
  //event handler for deleting a goal
  const handle_delete_goal = (index) => {
    set_goals(goals.filter((_, i) => i !== index));
  };

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

  //Event handler for marking task as done
  const handle_task_completion = (index) => {
    set_tasks((prev_tasks) =>
      prev_tasks.map((task, i) => {
        if( i === index) {
          const is_completed = !task.completed;

          if(is_completed) {
            set_confetti(true);
            setTimeout(() => set_confetti(false), 5000);
          }
          return { ...task, completed: is_completed };
        }
        return task;
      })
    );

    set_xp((prev_xp) => {
      const curr_task = tasks[index];

      if(!curr_task.completed) {
        const updated_xp = Math.min(prev_xp + 5, 100);

        return updated_xp;

        //TODO: character changes, etc
      }
      return prev_xp;
    })
  };


  return (
    <div className='flex flex-col h-screen w-full min-w-[1024px]'>

      {confetti && <Confetti />}

      {/* Header*/}
      <Header />

      {/* Main content */}
      <div className='flex flex-1 bg-white font-inter'>
        {/* Sidebar*/}
        <div className='w-1/4 min-w-[250px] bg-zinc-100 p-4 flex flex-col border-r-4 border-zinc-200 shadow-2xl'>
          {/*Goals*/}
          <h3 className='text-base font-bold pb-2 pr-2 mb-2'>Goals</h3>
            <ul>
              {goals.map((goal, index) => (
                <li key={index} 
                  className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'
                >
                  <span
                    className='text-sm cursor-pointer'
                    onClick={() => open_goal_form(goal)}
                  >
                    {goal.name}
                  </span>
                  <button
                    className='text-red-500 text-sm'
                    onClick={() => handle_delete_goal(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <GoalForm onSubmit={handle_submit_goal} edit={edit_goal} currentGoal={curr_goal} />

            {/* Tasks*/}
            <h3 className='text-base font-bold mb-2 pt-2 pb-2 pr-2'>Tasks</h3>
            <ul className='mb-4'>
              {tasks.filter(task => !task.completed).map((task, index) => (
                <li key={index} className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'>
                  <label 
                    htmlFor={`task-checkbox-${index}`} 
                    className='flex text-sm justify-between cursor-pointer items-center gap-2'
                  >
                    <input 
                      type="checkbox" 
                      id={`task-checkbox-${index}`}
                      className="checkbox-sm" 
                      checked={task.completed || false} 
                      onChange={() => handle_task_completion(index)} 
                    />
                    <span>{task.name}</span> 
                    <span>{task.time}</span>
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
            <button
            className='btn btn-link text-accent cursor-pointer mt-4'
            onClick={() => open_goal_form(null)}>
            + Add Goal
          </button>
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
            {/* Experince Bar*/}
            <span className='absolute top-0 left-2 text-sm font-semibold text-accent'>
              Experince: {xp}/100
            </span>
            <progress
              className='progress progress-secondary border border-accent w-96 h-10'
              value={xp}
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
