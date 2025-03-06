import Header from '../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import GoalForm from '../components/GoalForm/GoalForm';
import ExampleModal from '../components/ui/ExampleModal';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useAuth from '../../auth/hooks/useAuth';
import { useCallback } from 'react';
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate';
import TaskForm from '../components/TaskForm/TaskForm';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loggedIn, auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  // used to demo changes in the auth state
  useEffect(() => {
    console.log('Auth state updated:', user, loggedIn, auth);
  }, [user, loggedIn, auth]);

  const [goals, set_goals] = useState([]);
  const [curr_goal, set_curr_goal] = useState(null);
  const [edit_goal, set_edit_goal] = useState(false);

  const [tasks, set_tasks] = useState([]);
  const [new_task, set_new_task] = useState({ name: '', time: '' });
  const [currTask, setCurrTask] = useState(null);
  const [editTask, setEditTask] = useState(false);

  const [xp, set_xp] = useState(0);
  const [confetti, set_confetti] = useState(false);

  // API-----

  const fetchUserGoals = useCallback(async () => {
    if (loggedIn) {
      axiosPrivate
        .get('/goals')
        .then((res) => {
          const responseData = res.data;
          const goals = responseData.data.map((goal) => ({
            id: goal._id,
            name: goal.name,
            description: goal.description,
            completed: goal.isCompleted,
            endDate: Date.parse(goal.deadline),
          }));
          console.log('Goals fetched:', goals);
          set_goals(goals);
        })
        .catch((err) => console.error(err));
    }
  }, [loggedIn, axiosPrivate]);

  const createUserGoals = useCallback(
    async (responseBody) => {
      if (loggedIn) {
        axiosPrivate
          .post('/goals', responseBody)
          .then(() => {
            fetchUserGoals();
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, axiosPrivate, fetchUserGoals]
  );

  const deleteUserGoal = useCallback(
    async (goalId) => {
      if (loggedIn) {
        axiosPrivate
          .delete(`/goals/${goalId}`)
          .then((res) => {
            const deletedGoal = res.data.data;
            const updatedGoals = goals.filter(
              (goal) => goal.id !== deletedGoal._id
            );
            set_goals(updatedGoals);
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, goals, axiosPrivate]
  );

  const updateUserGoal = useCallback(
    // router.put('/:id', auth, updateGoal);
    async (goal) => {
      if (loggedIn) {
        axiosPrivate
          .put(`/goals/${goal.id}`, goal)
          .then((res) => {
            const updatedGoal = res.data.data;
            const updatedGoals = goals.map((goal) =>
              goal.id === updatedGoal._id ? updatedGoal : goal
            );
            set_goals(updatedGoals);
            fetchUserGoals();
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, goals, axiosPrivate, fetchUserGoals]
  );

  const fetchUserTasks = useCallback(async () => {
    if (loggedIn) {
      axiosPrivate
        .get('/tasks')
        .then((res) => {
          const responseData = res.data;
          const tasks = responseData.tasks;
          //   const tasks = responseData.data.map((task) => ({
          //     id: task._id,
          //     name: task.name,
          //     description: goal.description,
          //     completed: goal.isCompleted,
          //     endDate: Date.parse(goal.deadline),
          //   }));
          console.log('Task fetched:', tasks);
          //   set_goals(goals);
        })
        .catch((err) => console.error(err));
    }
  }, [loggedIn, axiosPrivate]);

  const createUserTask = useCallback(
    async (responseBody) => {
      console.log('createUserTask', responseBody);
      if (loggedIn) {
        axiosPrivate
          .post('/tasks', responseBody)
          .then(() => {
            fetchUserTasks();
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, axiosPrivate, fetchUserGoals]
  );

  const updateUserTask = useCallback(
    async (task) => {
      if (loggedIn) {
        axiosPrivate
          .put(`/tasks/${task.id}`, task)
          .then((res) => {
            const updatedTask = res.data.tasks;
            const updatedTasks = tasks.map((task) =>
              task.id === updatedTask._id ? updatedTask : task
            );
            set_tasks(updatedTasks);
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, tasks, axiosPrivate]
  );

  useEffect(() => {
    fetchUserGoals();
  }, [user, fetchUserGoals]);

  useEffect(() => {
    fetchUserTasks();
  }, [user, fetchUserTasks]);

  //Event handler for opening goal form
  const open_goal_form = (goal = null) => {
    console.log('Opening form with: ', goal);
    set_curr_goal(goal);
    set_edit_goal(!!goal);
    document.getElementById('goal-form-modal').showModal();

    setTimeout(() => {
      const modal = document.getElementById('goal-form-modal');
      if (modal) modal.showModal();
    }, 0);
  };

  // Event handler for adding a new goal/submitting edits
  const handle_submit_goal = (goal) => {
    console.log('handle', goal);
    if (edit_goal) {
      set_goals(goals.map((g) => (g.name === curr_goal.name ? goal : g)));
      updateUserGoal(goal);
    } else {
      set_goals([...goals, goal]);
      const requestBody = {
        name: goal.name,
        description: goal.description,
        deadline: goal.endDate,
      };
      createUserGoals(requestBody);
    }

    document.getElementById('goal-form-modal').close();
    set_curr_goal(null);
    set_edit_goal(false);
  };

  //event handler for deleting a goal
  const handle_delete_goal = (index, goalId) => {
    set_goals(goals.filter((_, i) => i !== index));
    deleteUserGoal(goalId);
  };

  const openTaskForm = (task = null) => {
    console.log('Opening form with: ', task);
    set_curr_goal(task);
    set_edit_goal(!!task);
    document.getElementById('task-form-modal').showModal();

    setTimeout(() => {
      const modal = document.getElementById('task-form-modal');
      if (modal) modal.showModal();
    }, 0);
  };

  const handleSubmitTask = (newTask) => {
    console.log('handle', newTask);
    if (editTask) {
      set_tasks(
        tasks.map((task) => (task.name === currTask.name ? newTask : task))
      );
      updateUserTask(task);
    } else {
      set_tasks([...tasks, newTask]);
      const requestBody = {
        name: newTask.name,
        description: newTask.description,
        deadline: newTask.endDate,
        goal_id: newTask.goalId,
      };
      createUserTask(requestBody);
    }

    document.getElementById('goal-form-modal').close();
    set_curr_goal(null);
    set_edit_goal(false);
  };
  // Event handler for adding new task
  const handle_add_task = () => {
    if (new_task.name && new_task.time) {
      set_tasks([...tasks, new_task]);
      createUserTask(new_task);
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
        if (i === index) {
          const is_completed = !task.completed;

          if (is_completed) {
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

      if (!curr_task.completed) {
        const updated_xp = Math.min(prev_xp + 5, 100);

        return updated_xp;

        //TODO: character changes, etc
      }
      return prev_xp;
    });
  };

  return (
    <div className='flex flex-col h-screen w-full min-w-[1024px]'>
      {/*Confetti for task completion */}
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
              <li
                key={index}
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
                  onClick={() => handle_delete_goal(index, goal.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <GoalForm
            onSubmit={handle_submit_goal}
            edit={edit_goal}
            currentGoal={curr_goal}
          />

          {/* Tasks*/}
          <h3 className='text-base font-bold mb-2 pt-2 pb-2 pr-2'>Tasks</h3>
          <ul className='mb-4'>
            {tasks.map((task, index) => (
              <li
                key={index}
                className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'
              >
                <label
                  htmlFor={`task-checkbox-${index}`}
                  className='flex text-sm justify-between cursor-pointer items-center gap-2'
                >
                  <input
                    type='checkbox'
                    id={`task-checkbox-${index}`}
                    className='checkbox-sm'
                    checked={task.completed || false}
                    onChange={() => handle_task_completion(index)}
                  />

                  <label
                    htmlFor={`task-modal-${index}`}
                    className='flex justify-between text-sm text-accent cursor-pointer underline'
                  >
                    <span className='pr-1'>{task.name}</span>
                  </label>
                  <span>{task.time}</span>
                </label>

                <ExampleModal
                  id={`task-modal-${index}`}
                  name={task.name}
                  description={`Scheduled for ${task.time}`}
                  delete_func={() => handle_delete_task(index)}
                />
              </li>
            ))}
          </ul>

          <TaskForm
            onSubmit={handleSubmitTask}
            edit={editTask}
            currentTask={currTask}
            goals={goals}
          />
          {/*Add Tasks and Goals*/}
          <div className='mt-auto flex flex-col gap-2'>
            <label
              htmlFor='add-task-modal'
              className='btn btn-link text-accent cursor-pointer'
              onClick={() => openTaskForm(null)}
            >
              + Add Task
            </label>
            <button
              className='btn btn-link text-accent cursor-pointer mt-4'
              onClick={() => open_goal_form(null)}
            >
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
