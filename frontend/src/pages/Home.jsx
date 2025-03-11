import Header from '../components/ui/Header';
import GoalForm from '../components/GoalForm/GoalForm';
import TaskModal from '../components/ui/TaskModal';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useAuth from '../../auth/hooks/useAuth';
import { useCallback } from 'react';
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate';
import TaskForm from '../components/TaskForm/TaskForm';
import GoalModal from '../components/ui/GoalModal';

const HomePage = () => {
  const { user, loggedIn, auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  // used to demo changes in the auth state
  useEffect(() => {
    console.log('Auth state updated:', user, loggedIn, auth);
  }, [user, loggedIn, auth]);

  const [goals, setGoals] = useState([]);
  const [currGoal, setCurrGoal] = useState(null);
  const [editGoal, setEditGoal] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});

  const [tasks, setTasks] = useState([]);
  const [currTask, setCurrTask] = useState(null);
  const [editTask, setEditTask] = useState(false);

  const [xp] = useState(0);
  const [confetti] = useState(false);

  // API-----

  const fetchUserGoals = useCallback(async () => {
    if (loggedIn) {
      axiosPrivate
        .get('/goals')
        .then((res) => {
          console.log('Fetched goals:', res.data.data);
          const responseData = res.data;
          const goals = responseData.data
            .map((goal) => ({
              id: goal._id,
              name: goal.name,
              description: goal.description,
              completed: goal.isCompleted,
              deadline: Date.parse(goal.deadline),
            }))
            .sort((a, b) => a.completed - b.completed);
          console.log('Goals fetched:', goals);
          setGoals(goals);
        })
        .catch((err) => console.error(err));
    }
  }, [loggedIn, axiosPrivate]);

  const fetchUserTasks = useCallback(async () => {
    if (loggedIn) {
      axiosPrivate
        .get('/tasks')
        .then((res) => {
          const responseData = res.data;
          // const uncompletedTasks = responseData.tasks.filter(
          //   (task) => !task.isCompleted
          // );
          const tasks = responseData.tasks.map((task) => ({
            id: task._id,
            name: task.name,
            description: task.description,
            completed: task.isCompleted,
            deadline: Date.parse(task.deadline),
            goalId: task.goal_id._id,
          }));
          setTasks(tasks);
          console.log('Task fetched:', tasks);
          //   setGoals(goals);
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
            fetchUserTasks();
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, goals, axiosPrivate, fetchUserTasks]
  );

  const updateUserGoal = useCallback(
    // router.put('/:id', auth, updateGoal);
    async (goal) => {
      console.log('Calling axios.put with:', goal);
      if (loggedIn) {
        axiosPrivate
          .put(`/goals/${goal.id}`, goal)
          .then((res) => {
            console.log('Update response:', res.data);
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
    [loggedIn, axiosPrivate, fetchUserTasks]
  );

  const completeUserTask = useCallback(
    async (taskId) => {
      if (loggedIn) {
        axiosPrivate
          .patch(`/tasks/${taskId}/complete`)
          .then((res) => {
            const completedTask = res.data;
            setCheckedTasks((prevState) => ({
              ...prevState,
              [completedTask._id]: false,
            }));
            fetchUserTasks();
            // call fetchUserGoals to update the goal completion status
            // not response from backend to differentate when task completion
            // leads to goal completetion
            fetchUserGoals();
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, axiosPrivate, fetchUserTasks, fetchUserGoals]
  );

  const deleteUserTask = useCallback(
    async (taskId) => {
      if (loggedIn) {
        axiosPrivate
          .delete(`/tasks/${taskId}`)
          .then((res) => {
            const deletedTask = res.data.deletedTask;
            const deletedGoal = res.data.deletedGoal;
            setCheckedTasks((prevState) => ({
              ...prevState,
              [deletedTask._id]: false, // Uncheck the task by setting it to false
            }));
            fetchUserTasks();
            if (deletedGoal !== undefined) {
              fetchUserGoals();
            }
          })
          .catch((err) => console.error(err));
      }
    },
    [loggedIn, axiosPrivate, fetchUserTasks, fetchUserGoals]
  );

  const updateUserTask = useCallback(
    async (task) => {
      if (loggedIn) {
        axiosPrivate
          .patch(`/tasks/${task.id}`, task)
          .then((res) => {
            const updatedTask = {
              ...res.data.task,
              deadline: Date.parse(res.data.task.deadline),
            };

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

  // fetch the pet's experience when the component mounts
  const fetchUserPet = useCallback(async () => {
    if (loggedIn && user?.id) {
      try {
        const res = await axiosPrivate.get('/pets');
        if (res.data.success && res.data.data) {
          const pet = res.data.data;
          set_xp(pet.exp); // Set XP from backend
          updatePetImage(pet.exp); // Update pet image
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
      }
    }
  }, [loggedIn, user, axiosPrivate]);
  
  
  const updatePetImage = (xp) => {
    if (xp >= 66) {
      set_image('/images/pet-3.png');
    } else if (xp >= 33) {
      set_image('/images/pet-2.png');
    } else {
      set_image('/images/pet-1.png');
    }
  };
  

  useEffect(() => {
    fetchUserGoals();
  }, [user, fetchUserGoals]);

  useEffect(() => {
    fetchUserTasks();
  }, [user, fetchUserTasks]);

  const get_user = (loggedIn, user) => {
    if (loggedIn) {
      return user.name.charAt(0).toUpperCase();
    } else {
      return '?';
    }
  };

  //Event handler for opening goal form
  const openGoalForm = (goal = null) => {
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
  const handleSubmitGoal = (goal) => {
    console.log('handle', goal);
    if (editGoal) {
      setGoals(goals.map((g) => (g.name === currGoal.name ? goal : g)));
      updateUserGoal(goal);
    } else {
      setGoals([...goals, goal]);
      const requestBody = {
        name: goal.name,
        description: goal.description,
        deadline: goal.deadline,
      };
      createUserGoals(requestBody);
    }

    document.getElementById('goal-form-modal').close();
    setCurrGoal(null);
    setEditGoal(false);
  };

  //event handler for deleting a goal
  const handleDeleteGoal = (index, goalId) => {
    setGoals(goals.filter((_, i) => i !== index));
    deleteUserGoal(goalId);
  };

  const openTaskForm = (task = null) => {
    console.log('Opening form with: ', task);
    setCurrTask(task);
    setEditTask(!!task);
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
        deadline: newTask.deadline,
        goal_id: newTask.goalId,
      };

      createUserTask(requestBody);
    }

    document.getElementById('task-form-modal').close();
    setCurrTask(null);
    setEditTask(false);
  };

  const handleCompleteTask = async (index) => {
    if (!loggedIn || !user?.id) return;
  
    const curr_task = tasks[index];
    if (curr_task.completed) return; // Prevent duplicate XP gains
  
    const xp_gain = 5;
    const new_xp = Math.min(xp + xp_gain, 100); // Cap XP at 100
  
    try {
      // Mark the task as completed in the backend
      await completeUserTask(curr_task.id);
  
      // Update pet experience
      await axiosPrivate.put('/pets/gain-exp', { exp: xp_gain });
      set_xp(new_xp);
      updatePetImage(new_xp); // Update pet image based on new XP
  
      // Show confetti animation
      set_confetti(true);
      setTimeout(() => set_confetti(false), 5000);
    } catch (error) {
      console.error('Error completing task or updating XP:', error);
    }
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
            {goals.map((goal, index) => {
              const goalEndDateTime = new Date(goal.deadline);
              const goalDeadline = goalEndDateTime.toLocaleDateString();
              console.log(
                'goal end date',
                goal.deadline,
                goalEndDateTime,
                'deadline',
                goalDeadline
              );

              return (
                <li
                  key={index}
                  className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'
                >
                  <label
                    htmlFor={`goal-modal-${index}`}
                    className={`flex justify-between text-sm cursor-pointer underline ${
                      goal.completed
                        ? 'text-gray-500 line-through'
                        : 'text-accent'
                    }`}
                  >
                    <span className='pr-1'> {goal.name}</span>
                  </label>
                  <button
                    className='text-red-500 text-sm'
                    onClick={() => handleDeleteGoal(index, goal.id)}
                  >
                    Delete
                  </button>
                  <GoalModal
                    id={`goal-modal-${index}`}
                    name={goal.name}
                    description={goal.description}
                    deadline={goalDeadline}
                    onEdit={() => {
                      setEditGoal(true);
                      openGoalForm(goal);
                    }}
                    data-testid={`goal-modal-${index}`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Tasks*/}
          <h3 className='text-base font-bold mb-2 pt-2 pb-2 pr-2'>Tasks</h3>
          <ul className='mb-4'>
            {tasks.map((task, index) => {
              let taskDeadline = null;
              const now = new Date();
              const taskEndDateTime = new Date(task.deadline);
              if (taskEndDateTime.toDateString() === now.toDateString()) {
                taskDeadline = taskEndDateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
              } else {
                taskDeadline = taskEndDateTime.toLocaleDateString();
              }
              const goalName =
                goals.find((goal) => goal.id === task.goalId)?.name ??
                'No goal';
              return (
                <li
                  key={index}
                  className='p-2 rounded-lg transition hover:bg-neutral cursor-pointer flex justify-between items-center'
                >
                  <div className='flex justify-start gap-2'>
                    {!task.completed && (
                      <label
                        htmlFor={`task-checkbox-${index}`}
                        className='text-sm cursor-pointer items-center'
                      >
                        <input
                          type='checkbox'
                          id={`task-checkbox-${index}`}
                          className='checkbox-sm'
                          checked={checkedTasks[task.id]}
                          onChange={() => {
                            setCheckedTasks((prevState) => ({
                              ...prevState,
                              [task._id]: true,
                            }));
                            handleCompleteTask(task.id);
                          }}
                        />
                      </label>
                    )}

                    <label
                      htmlFor={`task-modal-${index}`}
                      className={`flex justify-between text-sm text-accent cursor-pointer underline ${
                        task.completed
                          ? 'text-gray-500 line-through'
                          : 'text-accent'
                      }`}
                    >
                      <span className='pr-1'>{task.name}</span>
                    </label>
                  </div>
                  <span>{taskDeadline}</span>
                  <button
                    className='text-red-500 text-sm'
                    onClick={() => deleteUserTask(task.id)}
                  >
                    Delete
                  </button>

                  <TaskModal
                    id={`task-modal-${index}`}
                    name={task.name}
                    description={task.description}
                    deadline={taskDeadline}
                    goalName={goalName}
                    onEdit={() => {
                      setEditTask(true);
                      openTaskForm({
                        ...task,
                        deadline: new Date(task.deadline),
                      });
                    }}
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
          <GoalForm
            onSubmit={handleSubmitGoal}
            edit={editGoal}
            currentGoal={currGoal}
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
            <label
              htmlFor='add-goal-modal'
              className='btn btn-link text-accent cursor-pointer mt-4'
              onClick={() => openGoalForm(null)}
            >
              + Add Goal
            </label>
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

        {/* User icon */}
        <div className='absolute top-4 right-4'>
          <div className='avatar avatar-placeholder'>
            <div className='bg-neutral text-neutral-content w-12 rounded-full text-center'>
              <div
                className='text-2xl font-bold py-2'
                data-testid='home-user-icon'
              >
                {get_user(loggedIn, user)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
