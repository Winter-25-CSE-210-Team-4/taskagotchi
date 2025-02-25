import Header from "../components/ui/Header";
import { useNavigate } from "react-router-dom";



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
                
                    <h3 className="text-base font-bold mb-2 pb-2 pr-2">Tasks</h3>
                    <ul className="mb-4">
                        <li className="flex justify-between text-sm">💧 Drink water <span>5:00pm</span></li>
                        <li className="flex justify-between text-sm">🚶 Take a walk <span>6:00pm</span></li>
                    </ul>
                    <h3 className="text-base font-bold pb-2 pr-2 mb-2">Goals</h3>
                    <ul>
                        <li className="text-sm">💪 Be healthier</li>
                        <li className="text-sm">🌲 Go outdoors more!</li>
                    </ul>
                    <div className="mt-auto flex flex-col gap-2">
                        <button className="btn btn-link text-accent"
                            onClick={() => navigate("/dummy")}
                        >+ Add Task</button>
                        <button className="btn btn-link text-accent"
                            onClick={() => navigate("/dummy")}
                        >+ Add Goal</button>
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
                        {/*TODO: Add bar component here*/}
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
