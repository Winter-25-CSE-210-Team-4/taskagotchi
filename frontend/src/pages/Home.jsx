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

  const [goals, setGoals] = useState([]);
  const [currGoal, setCurrGoal] = useState(null);
  const [edit_goal, setEditGoal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [currTask] = useState(null);
  const [editTask] = useState(false);

  const [xp] = useState(0);
  const [confetti] = useState(false);

  // API-----

  const fetchUserGoals = useCallback(async () => {
    if (loggedIn) {
      axiosPrivate
        .get('/goals')
        .then((res) => {
          console.log("Fetched goals:", res.data.data);
          const responseData = res.data;
          const goals = responseData.data.map((goal) => ({
            id: goal._id,
            name: goal.name,
            description: goal.description,
            completed: goal.isCompleted,
            endDate: Date.parse(goal.deadline),
          }));
          console.log('Goals fetched:', goals);
          setGoals(goals);
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
            setGoals(updatedGoals);
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
            setGoals(updatedGoals);
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
          const uncompletedTasks = responseData.tasks.filter(
            (task) => !task.isCompleted
          );
          const tasks = uncompletedTasks.map((task) => ({
            id: task._id,
            name: task.name,
            description: task.description,
            completed: task.isCompleted,
            endDate: Date.parse(task.deadline),
            goalId: task.goal_id,
          }));
          setTasks(tasks);
          console.log('Task fetched:', tasks);
          //   setGoals(goals);
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

  const deleteUserTask = useCallback(
    async (taskId) => {
      if (loggedIn) {
        axiosPrivate
          .delete(`/tasks/${taskId}`)
          .then((res) => {
            const deletedTask = res.data.deletedTask;
            const deletedGoal = res.data.deletedGoal;
            const updatedTasks = tasks.filter(
              (task) => task.id !== deletedTask._id
            );
            setTasks(updatedTasks);
            fetchUserTasks();
            if (deletedGoal !== undefined) {
              const updatedGoals = goals.filter(
                (goal) => goal.id !== deletedGoal._id
              );
              setGoals(updatedGoals);
              fetchUserGoals();
            }
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, goals, axiosPrivate]
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
            setTasks(updatedTasks);
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
    setCurrGoal(goal);
    setEditGoal(!!goal);
    document.getElementById('goal-form-modal').showModal();

    setTimeout(() => {
      const modal = document.getElementById('goal-form-modal');
      if (modal) modal.showModal();
    }, 0);
  };

  // Event handler for adding a new goal/submitting edits
  const handle_submit_goal = (goal) => {
    if (edit_goal) {
      setGoals(goals.map((g) => (g.name === currGoal.name ? goal : g)));
      updateUserGoal(goal);
    } else {
      setGoals([...goals, goal]);
      const requestBody = {
        name: goal.name,
        description: goal.description,
        deadline: goal.endDate,
      };
      createUserGoals(requestBody);
    }

    document.getElementById('goal-form-modal').close();
    setCurrGoal(null);
    setEditGoal(false);
  };

  //event handler for deleting a goal
  const handle_delete_goal = (index, goalId) => {
    setGoals(goals.filter((_, i) => i !== index));
    deleteUserGoal(goalId);
  };

  const openTaskForm = (task = null) => {
    console.log('Opening form with: ', task);
    setCurrGoal(task);
    setEditGoal(!!task);
    document.getElementById('task-form-modal').showModal();

    setTimeout(() => {
      const modal = document.getElementById('task-form-modal');
      if (modal) modal.showModal();
    }, 0);
  };

  const handleSubmitTask = (newTask) => {
    console.log('handle', newTask);
    if (editTask) {
      setTasks(
        tasks.map((task) => (task.name === currTask.name ? newTask : task))
      );
      updateUserTask(newTask);
    } else {
      setTasks([...tasks, newTask]);
      const requestBody = {
        name: newTask.name,
        description: newTask.description,
        deadline: newTask.endDate,
        goal_id: newTask.goalId,
      };
      createUserTask(requestBody);
    }

    document.getElementById('task-form-modal').close();
    setCurrGoal(null);
    setEditGoal(false);
  };

  // Event handler for deleting a task
  const handle_delete_task = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  //Event handler for marking task as done
  const handle_task_completion = (taskId) => {
    deleteUserTask(taskId);

    // set_xp((prev_xp) => {
    //   const curr_task = tasks[index];

    //   if (!curr_task.completed) {
    //     const updated_xp = Math.min(prev_xp + 5, 100);

    //     return updated_xp;

    //     //TODO: character changes, etc
    //   }
    //   return prev_xp;
    // });
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
            currentGoal={currGoal}
          />

          {/* Tasks*/}
          <h3 className='text-base font-bold mb-2 pt-2 pb-2 pr-2'>Tasks</h3>
          <ul className='mb-4'>
            {tasks.map((task, index) => {
              let taskDeadline = null;
              const now = new Date();
              const taskEndDateTime = new Date(task.endDate);
              if (taskEndDateTime.toDateString() === now.toDateString()) {
                taskDeadline = taskEndDateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
              } else {
                taskDeadline = taskEndDateTime.toLocaleDateString();
              }
              return (
                <li
                  key={index}
                  className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'
                >
                  <div className='flex justify-start gap-2'>
                    <label
                      htmlFor={`task-checkbox-${index}`}
                      className='text-sm cursor-pointer items-center'
                    >
                      <input
                        type='checkbox'
                        id={`task-checkbox-${index}`}
                        className='checkbox-sm'
                        onClick={() => handle_task_completion(task.id)}
                      />
                    </label>

                    <label
                      htmlFor={`task-modal-${index}`}
                      className='flex justify-between text-sm text-accent cursor-pointer underline'
                    >
                      <span className='pr-1'>{task.name}</span>
                    </label>
                  </div>
                  <span>{taskDeadline}</span>

                  <ExampleModal
                    id={`task-modal-${index}`}
                    name={task.name}
                    description={`Scheduled for ${taskDeadline}`}
                    delete_func={() => handle_delete_task(index)}
                  />
                </li>
              );
            })}
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
