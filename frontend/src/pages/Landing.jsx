import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col h-screen w-full min-w-[1024px]'>
            <div
                className='hero min-h-screen'
                style={{
                    backgroundImage: `url("/images/landing_background.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
            
                <div className='absolute inset-0 backdrop-blur-sm'></div>
                <div className='hero-overlay bg-transparent'></div>
                <div className='hero-content text-neutral-content text-center bg-[#f1fbfa] p-8 rounded-xl'>
                    <div className="max-w-md">
                        <h1 className='mb-2 text-8xl font-bold font-nanum'>Taskagotchi</h1>

                        <div className='flex flex-col flex-1 justify-center items-left mb-4'> 
                            <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-accent shadow-lg rounded-xl border-black bg-accent text-center text-xl text-white border border-accent mb-5 rounded-lg hover:bg-primary hover:border-primary"
                            >Login
                            </button>
                            <button 
                            onClick={() => navigate('/signup')}
                            className="btn btn-outline bg-transparent text-center text-xl text-accent border-2 rounded-lg hover:bg-primary"
                            >SignUp
                            </button>
                        </div>
                    </div>
                </div>
                </div>

        </div>
    );
};
export default LandingPage;