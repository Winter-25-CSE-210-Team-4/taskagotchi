import './App.css';
import GoalForm from './components/GoalForm';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  return (
    <>
      {/* TODO: Replace with page routing layout */}
      <h1 className='text-5xl font-bold underline'>Hello world!</h1>
      <button className='btn m-2' onClick={handleClick}>
        Button
      </button>
      <GoalForm onSubmit={(goal) => console.log(goal)} />
      <GoalForm onSubmit={(goal) => console.log(goal)} edit={true} />
    </>
  );
}

export default App;
