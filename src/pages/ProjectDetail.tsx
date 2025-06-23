import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollProgress from '../components/ScrollProgress';
import projects from '../Projects';

const projectContent = [
  {
    title: 'Project Overview',
    content: 'An AI-powered chat application that leverages natural language processing to provide intelligent responses to user queries. Built with React, Node.js, and OpenAI API.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Technical Architecture',
    content: 'The application follows a microservices architecture with separate services for authentication, chat management, and AI processing. Uses WebSocket for real-time communication.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'User Interface',
    content: 'Features a modern, intuitive interface with dark mode support, responsive design, and smooth animations. Implements progressive loading for optimal performance.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

function ProjectDetail() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [projectContent, setProjectContent] = useState([]);
  const [showBackButton, setShowBackButton] = useState(true);
  const { name } = useParams();
  console.log(name)


  useEffect(() => {
    // Find the project by name
    const foundProject = projects.find(proj => proj.name.toLowerCase() == name.toLowerCase());

    if (foundProject) {
        setProjectContent(foundProject?.info); // Store content in state
        
    } else {
        setProjectContent([]); // Handle not found case
    }
}, [name]);  // Re-run effect when 'name' changes


console.log(projectContent[0]?.video)


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Hide back button when scrolling past certain point
      setShowBackButton(window.scrollY < 200);
      
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden" ref={containerRef}>
      <Navbar />
      <ScrollProgress />
      
      <div className="container mx-auto px-4">
        <motion.button
          className="fixed top-20 w-full bg-zinc-900 -mt-4 md:-mt-1 lg:left-8 left-4 z-50 flex items-center gap-2 text-[#64ffda] hover:text-white"
          onClick={() => navigate('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: showBackButton ? 1 : 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20}/>
          Back to Home
        </motion.button>

        <div className="flex flex-col sticky overflow-y-hidden lg:flex-row mt-20 lg:mt-32">
          <div className="w-full top-20 overflow-y-hidden lg:w-1/2 p-2 lg:py-12">
            {projectContent.map((section, index) => (
              <motion.div
                key={index}
                ref={el => sectionsRef.current[index] = el}
                className="lg:min-h-[80vh] overflow-hidden min-h-[90vh] flex items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    delay: 0.2 
                  }
                }}
                viewport={{ 
                  once: true,
                  margin: "-100px"
                }}
              >
                <div className="relative top-1 z-10">
                  <motion.h2 
                    className="md:text-4xl text-2xl font-bold mb-8 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {section.title}
                  </motion.h2>
                  <motion.p 
                    className="md:text-2xl lg:text-xl text-base leading-relaxed text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {section.content}
                    {
                      section.video && (
                        <video className='mt-2 lg:hidden' playsInline autoPlay loop muted src={section.video} onClick={()=>window.open(`${section?.video}`)} ></video>
                      )
                    }
                    
                    {
                      name == 'ai-chat' &&  section.title == 'Tech Stack (MERN)' &&
                    <div className='flex mt-2 flex-wrap w-full items-center -b-8 gap-4'>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10' src="https://registry.npmmirror.com/@lobehub/icons-static-png/1.24.0/files/dark/gemini-color.png" alt="" />
                      <p className='text-[12px] md:text-sm'>Gemini Ai</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10' src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="" />
                      <p className='text-sm whitespace-break-spaces'>Hugging Face</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10' src="https://socket.io/images/logo-dark.svg" alt="" />
                      <p className='text-sm'>socket.io</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 rounded-full object-center h-10' src="https://th.bing.com/th/id/OIP.p3ffEFg8rWy0mt-K6bfvBgAAAA?rs=1&pid=ImgDetMain" alt="" />
                      <p className='text-sm'>Zustand</p>
                      </span>
                    </div>
                    }
                    {
                      name == 'devhub' &&  section.title == 'Tech Stack (MERN)' &&
                    <div className='flex mt-2 w-full items-center gap-4'>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10 bg-white p-0 rounded-full' src="https://pngimg.com/uploads/github/github_PNG58.png" alt="" />
                      <p className='text-sm'>Github oAuth</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10' src="https://th.bing.com/th?id=ODLS.203075bf-13fe-49da-a782-7f630c40bcae&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2" alt="" />
                      <p className='text-sm'>passport js</p>
                      </span>
                      
                    </div>
                    }
                    {
                      name == 'travelmate' &&  section.title == 'Tech Stack (MERN)' &&
                    <div className='flex mt-2 w-full items-center gap-4'>
                      <span className='flex flex-col items-start'>
                      <img className='w-20 h-6' src="https://dashboard.razorpay.com/img/logo_full.png" alt="" />
                      <p className='text-sm'>razorpay Integration</p>
                      </span>
                      
                    </div>
                    }
                    {
                      name == 'email-buddy' &&  section.title == 'Tech Stack (MERN)' &&
                    <div className='flex mt-2 w-full items-center gap-4'>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10 bg-white p-0 rounded-full' src="https://www-assets.kolide.com/assets/inventory/device_properties/icons/chrome-extensions-4312d461.png" alt="" />
                      <p className='text-sm'>Chrome Extension</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10' src="https://pbs.twimg.com/profile_images/1682268668321726464/NEb6_n7n_400x400.jpg" alt="" />
                      <p className='text-sm'>OpenRouter Api</p>
                      </span>
                      
                    </div>
                    }
                    {
                      name == 'AutoTwitterPost' &&  section.title == 'Tech Stack (MERN)' &&
                    <div className='flex mt-2 w-full items-center gap-4'>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10 bg-white p-0 rounded-full' src="https://avatars.githubusercontent.com/u/182288589?s=200&v=4" alt="" />
                      <p className='text-sm'>MCP Server</p>
                      </span>
                      <span className='flex flex-col items-center'>
                      <img className='w-10 h-10 rounded-full' src="https://imgs.search.brave.com/nKd3NFbMdj8R87z1rQjwbeGkkfHxaNJhSGoBC4IWSso/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZW5q/aS5jby93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNy9YLWxv/Z28tdHdpdHRlci0x/MDI0eDU3NC5qcGc" alt="" />
                      <p className='text-sm'>Twitter Api SDK</p>
                      </span>
                      
                    </div>
                    }

                    
                  </motion.p>
                  {
                      name ==  'devhub' && section.title == 'Future Scope' && (

                                  <motion.button 
                                    className="mt-16 ml-2 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={()=>window.open('https://devhub-zics.onrender.com/login',"_blank")}
                                  >
                                    Checkout Live ↗
                                  </motion.button>
                      )
                    }
                  {
                      name ==  'ai-chat' && section.title == 'Future Scope' && (

                                  <motion.button 
                                    className="mt-16 ml-2 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={()=>window.open('https://github.com/siddreddy07/AI-Chat-App',"_blank")}
                                  >
                                    Github Link ↗
                                  </motion.button>
                      )
                    }
                  {
                      name ==  'travelmate' && section.title == 'Future Scope' && (

                                  <motion.button 
                                    className="mt-16 ml-2 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={()=>window.open('https://github.com/siddreddy07/airbnd-clone',"_blank")}
                                  >
                                    Github Link ↗
                                  </motion.button>
                      )
                    }
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-full lg:w-1/4 hidden lg:sticky lg:top-32 h-[80vh] lg:flex items-center p-8 lg:py-12">
            <motion.div
              className="w-full h-[600px] rounded-2xl overflow-hidden "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {projectContent[activeSection]?.video ? (
  <motion.video
    key={activeSection}
    src={projectContent[activeSection]?.video}
    className="w-full max-w-[700px] h-[600px] shadow-inner object-contain rounded-lg fixed"
    initial={{ opacity: 0, scale: 1.1 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    loop
    autoPlay
    muted
  />
) : projectContent[activeSection]?.image ? (
  <motion.img
    key={activeSection}
    src={projectContent[activeSection]?.image}
    alt={projectContent[activeSection]?.title}
    className="w-[600px] object-scale-down bg-transparent shadow-inner h-[600px] rounded-lg fixed"
    initial={{ opacity: 0, scale: 1.1 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  />
) : null}



            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;