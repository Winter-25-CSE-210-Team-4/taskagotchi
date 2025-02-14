import './App.css';

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
    </>
  );
}

export default App;
