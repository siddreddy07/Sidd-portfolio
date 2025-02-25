import React, { useEffect, useState } from 'react';
import { Github, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ScrollProgress from '../components/ScrollProgress';
import FlowingMenu from '../bits/components/FlowingMenu';
import TooltipButton from '../components/TooltipButton';
import { buttonsData } from '../buttondata';
import { Works } from '../Works';
import ImageTrail from '../bits/components/ImageTrail';

const words = ['WEB', 'BACKEND', 'MERN STACK'];

const projects = [
  {
    id: 'ai-chat',
    link:'/project/ai-chat',
    text: 'AI-Powered Chat WebApp',
    image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740494078/Screenshot_2025-02-25_200414_c0hfen.png',
    description: 'AI Integrated Real-time chat application'
  },
  {
    id: 'devhub',
    link:'/project/devhub',
    text: 'Devhub - Github Auth App',
    image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740493914/Screenshot_2025-01-21_205846_cmlvy1.png',
    description: 'Devhub social app : explore, like, connect.'
  },
  {
    id: 'travelmate',
    link:'/project/travelmate',
    text: 'Travelmate - Airbnb Clone',
    image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740495640/Screenshot_2025-02-25_203003_qfjmgl.png',
    description: 'Travelmate : manage, book, pay securely.'
  }
];

function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentProject, setCurrentProject] = useState(0);
  
  const [info,setinfo] = useState()

  const [open, setOpen] = useState(true);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const demoItems = [
    {text: 'DEVHUB', image: 'https://picsum.photos/600/400?random=3'},
    {text: 'AI - Powered Chat App'},
    {text: 'AIRBNB-CLONE', image: 'https://picsum.photos/600/400?random=3' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      nextProject();
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [currentProject]);

  const nextProject = () => {
    setDirection(1);
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const previousProject = () => {
    setDirection(-1);
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleProjectClick = (id: string) => {
    console.log(id)
    navigate(`/project/${id}`);
  };


  const handleWorkClick = async(work)=>{

    setinfo(work)

  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="scroll-container">
      <Navbar />
      <ScrollProgress />

      <motion.section 
        id="home" 
        className="section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center px-4">
          <h1 className={`scroll-text ${isVisible ? 'visible' : ''}`}>
            {words[currentWord]}
          </h1>
          <h2 className="static-text">DEVELOPER</h2>
          <p className="mt-8 text-base md:text-lg intro-text mx-auto">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent">N SIDDHARTH REDDY,</p>
          <p className='md:block hidden'>I'm a developer with internship experience in MERN stack web development, where I contributed to creating scalable and user-friendly applications. I'm focused on applying my skills and contributing to dynamic teams.</p>
          <p className='md:hidden block'>Developer with MERN stack internship experience, contributing to scalable web development. Seeking opportunities to grow and contribute</p>
          </p>
        </div>
      </motion.section>

      
      <motion.section 
        id="projects" 
        className="section projects"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent">
            PROJECTS 💻
          </h2>
          
          <div className="relative md:hidden max-w-4xl mx-auto">
            <div className="carousel-container overflow-hidden relative">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentProject}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="project-card w-full"
                  onClick={() => handleProjectClick(projects[currentProject].id)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                    <img 
                      src={projects[currentProject]?.image}
                      alt={projects[currentProject]?.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{projects[currentProject].title}</h3>
                  <p className="text-gray-300">{projects[currentProject].description}</p>
                </motion.div>
              </AnimatePresence>

              <div className="carousel-controls absolute top-1/3 left-0 right-0 -translate-y-1/2 flex justify-between gap-8 items-center pointer-events-none px-4">
                <button
                  className="pointer-events-auto p-2 bg-[#64ffda] rounded-full text-black hover:scale-110 transition-transform"
                  onClick={previousProject}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="pointer-events-auto p-2 bg-[#64ffda] rounded-full text-black hover:scale-110 transition-transform"
                  onClick={nextProject}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 -mt-16 md:-mt-12">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentProject ? 'bg-[#64ffda]' : 'bg-gray-600'
                  }`}
                  onClick={() => {
                    setDirection(index > currentProject ? 1 : -1);
                    setCurrentProject(index);
                  }}
                />
              ))}
            </div>
          </div>
            


          <div className='hidden md:block' style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu items={projects} />
</div>
          
          </div>
      </motion.section>

      <motion.section 
        id="work" 
        className="section work-experience"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
       
    

        <div className="text-center w-full mt-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent">
            Work Experience
          </h2>
          <div className="flex justify-center gap-1">
            {
              Works.map((work,index)=>(
                <div className={`w-24 h-24 rounded-full border-2 border-transparent hover:border-transparent ${work?.company == info?.company ? 'scale-125 z-50 hover:scale-125 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-padding' : 'hover:z-0 border-zinc-200'} cursor-pointer hover:scale-125 hover:bg-gradient-to-r hover:from-[#64ffda] hover:to-[#00bcd4] hover:bg-clip-padding hover:z-50 duration-300 transition-all ease-in-out p-[2px]`} onClick={()=>{handleWorkClick(work)}}>
                <div className="w-full h-full rounded-full overflow-hidden"><img src={work.profile} alt="" /></div>
</div>
              ))
            }
            
          </div>
          <h3 className={`mt-8 md:mt-10 text-xl md:text-2xl text-zinc-200 hover:bg-gradient-to-r ${info ? 'hover:from-[#64ffda] hover:to-[#00bcd4] hover:bg-clip-text hover:text-transparent' : ''} transition-all duration-300 ease-in-out font-semibold`}><a href={info?.url}>{info?.profile ? info?.company :  'Internships'}</a></h3>
          <p className={`mt-4 ${info ? 'md:text-3xl' : ''} text-xl text-[#64ffda]`}>{info?.jobtitle || 'Click on the Badges to reveal More'}</p>
          <p className="text-[#ffffff]">{info?.duration || ''}</p>
       

          <motion.button 
            className="mt-16 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href="mailto:hrxsiddharth@gmail.com"}
          >
            Get In Touch ↗
          </motion.button>
          
          <div className="flex justify-center gap-6 md:gap-8 mt-12 md:mt-16 social-links">
          <TooltipButton buttons={buttonsData} />
          </div>
          <hr className='md:mt-2 mt-4'/>
          <p className="flex gap-2 text-center items-center justify-center mt-10 md:mt-4 text-sm text-[#64ffda]">Crafted with ❤️ ~ by <p className='underline text-zinc-200'>siddharth reddy</p></p>
        

        </div>




      </motion.section>

    </div>
  );
}

export default Home;