import Header from "../components/ui/Header";
import { useNavigate } from "react-router-dom";
import ExampleModal  from "../components/ui/ExampleModal";



const HomePage = () => {

    const navigate = useNavigate();


    return (
        <div className="flex flex-col h-screen w-full min-w-[1024px]">
            {/* Header*/}
            <Header />


            {/* Main content */}
            <div className="flex flex-1 bg-white font-inter">

                {/* Sidebar*/}
                <div className="w-1/4 min-w-[250px] bg-zinc-100 p-4 flex flex-col border-r-4 border-zinc-200 shadow-2xl">
                
                    {/* Tasks*/}
                    <h3 className="text-base font-bold mb-2 pb-2 pr-2">Tasks</h3>
                    <ul className="mb-4">
                        <li>
                            <label htmlFor="drink-water-modal" className="flex justify-between text-sm cursor-pointer">
                            💧 Drink water <span>5:00pm</span>
                            </label>
                             <ExampleModal id="drink-water-modal" title="Drink Water" description="Stay hydrated! Drink a glass of water at 5:00pm." />         
                        </li>
                        <li>

                            <label htmlFor="take-walk-modal" className="flex justify-between text-sm cursor-pointer">
                                🚶 Take a walk <span>6:00pm</span>
                            </label>
                            <ExampleModal id="take-walk-modal" title="Take a Walk" description="Get some fresh air and move your body at 6:00pm." />
                        </li>
                    </ul>
                     {/*Goals*/}
                    <h3 className="text-base font-bold pb-2 pr-2 mb-2">Goals</h3>
                    <ul>
                        <li>
                            <label htmlFor="be-healthier-modal" className="text-sm cursor-pointer">💪 Be healthier</label>
                            <ExampleModal id="be-healthier-modal" title="Be Healthier" description="Maintain a balanced diet and exercise regularly." />
                        </li>
                        <li>
                            <label htmlFor="go-outdoors-modal" className="text-sm cursor-pointer">🌲 Go outdoors more!</label>
                            <ExampleModal id="go-outdoors-modal" title="Go Outdoors More" description="Spend more time in nature for a healthier mind and body." />
                        </li>
                    </ul>

                    {/*Add Tasks and Goals*/}
                    <div className="mt-auto flex flex-col gap-2">
                        <label htmlFor="add-task-modal" className="btn btn-link text-accent cursor-pointer">+ Add Task</label>
                            <ExampleModal 
                                id="add-task-modal" 
                                title="Add New Task" 
                                description={
                                    <div>
                                        <input type="text" placeholder="Task Name" className="input input-bordered w-full my-2" />
                                        <input type="time" className="input input-bordered w-full my-2" />
                                        <button className="btn btn-primary w-full">Save Task</button>
                                    </div>
                                } 
                            />
                        <label htmlFor="add-goal-modal" className="btn btn-link text-accent cursor-pointer">+ Add Goal</label>
                            <ExampleModal 
                                id="add-goal-modal" 
                                title="Add New Goal" 
                                description={
                                    <div>
                                        <input type="text" placeholder="Goal Name" className="input input-bordered w-full my-2" />
                                        <textarea placeholder="Goal Description" className="textarea textarea-bordered w-full my-2"></textarea>
                                        <button className="btn btn-primary w-full">Save Goal</button>
                                    </div>
                                } 
                            />
                    </div>
                
                </div>

                {/* Character*/}
                <div className="flex flex-1 justify-center items-center flex-col pb-4">
                    <img 
                        src="/images/monster-transparentbg.png" 
                        alt="TaskaGoTchi Character" 
                        className="w-96 h-96 object-contain mt-8 mb-8"
                    />

                

                    <div className="w-96 h-24 bg-zinc-100 rounded-lg flex flex-col justify-center relative mt-8 shadow-xl">
                        {/* Health Bar*/}
                        <span className="absolute top-0 left-2 text-sm font-semibold text-accent">
                            Health: 50/100
                        </span>
                        <progress className="progress progress-secondary border border-accent w-96 h-10" value={50} max="100"></progress>
                    </div>
                </div>

            
              {/* Stats button */}
              <div className="absolute top-4 right-4">
                    <button className="btn btn-accent "
                        onClick={() => navigate("/dummy")}
                    >stats</button>
                </div>



            </div>




        </div>
    );
    
};
export default HomePage;
