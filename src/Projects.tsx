const projects = [
  {
    id: 1,
    name: 'ai-chat',
    info: [
      {
        title: 'Project Overview',
        content: 'The AI-powered chat web app is designed to provide seamless real-time messaging with integrated AI capabilities. It allows users to communicate via text and images while leveraging AI for chatbot interactions and text-to-image generation. Users can also update their profile images, ensuring a personalized experience. The platform focuses on a smooth, interactive, and intelligent communication system.',
        video: 'https://res.cloudinary.com/deiiozl5e/video/upload/v1740488757/AI_-CHat_Final_cozofs.mp4'
      },
      {
        title: 'Tech Stack (MERN)',
        content: 'The frontend is built using React.js with Tailwind CSS for a modern and responsive UI. The backend is powered by Node.js and Express.js, with Socket.io enabling real-time messaging. AI functionalities are implemented using Gemini API for chatbot interactions and Hugging Face for text-to-image generation. MongoDB is used for efficient database management, while Nodemailer handles OTP-based email verification for secure authentication.',
        image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740486860/project_2_ylf4ly.png'
      },
      {
        title: 'Future Scope',
        content: 'Future enhancements include real-time code collaboration, allowing developers to work together seamlessly within the chat platform. A group chat feature will be introduced, incorporating AI-powered assistance for better communication. Additionally, advanced AI capabilities such as voice interactions and smart replies will be integrated to enhance user engagement and productivity.',
        image: 'https://images.pexels.com/photos/6664884/pexels-photo-6664884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  },
  {
    id: 2,
    name: 'devhub',
    info: [
      {
        title: 'Project Overview',
        content: 'The GitHub-based social web app allows users to seamlessly interact with GitHub repositories and profiles. Users can log in using their GitHub credentials, view their personal repositories, explore other users profiles, and discover top repositories based on different programming languages. The platform enhances engagement by enabling users to like repositories and track interactions, making it a community-driven space for developers.',
        video: 'https://res.cloudinary.com/deiiozl5e/video/upload/v1740488337/Ai_chat_app_online-video-cutter.com_1_vvpzrr.mp4'
      },
      {
        title: 'Tech Stack (MERN)',
        content: 'The frontend is built with React.js and styled using DaisyUI for a sleek and responsive interface. The backend is powered by Node.js and Express.js, with Passport.js handling GitHub authentication. MongoDB is used as the database to store user interactions and preferences, ensuring a smooth and efficient experience.',
        image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740486860/project_1_ewm2uh.png'
      },
      {
        title: 'Future Scope',
        content: 'Planned improvements include discussion threads to enhance communication within the platform. AI-powered recommendations for repositories based on user activity and interests will also be implemented to provide a more personalized experience.',
        image: 'https://images.pexels.com/photos/7718755/pexels-photo-7718755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  },
  {
    id: 3,
    name: 'travelmate',
    info: [
      {
        title: 'Project Overview',
        content: 'The Airbnb clone is a MERN stack web application that provides a seamless hotel booking experience with an admin dashboard for hotel management. Admins can create hotels, upload images, and manage listings, while users can browse hotels, select dates, check availability, choose the number of guests, and complete bookings via Razorpay. The platform ensures a smooth user experience with a responsive UI, secure transactions, and real-time availability updates.',
        video: 'https://res.cloudinary.com/deiiozl5e/video/upload/v1740495632/final-travelmate_ruryzg.mp4'
      },
      {
        title: 'Tech Stack (MERN)',
        content: 'The frontend is built with React.js and Tailwind CSS for a modern and responsive design. The backend is powered by Node.js and Express.js, with MongoDB managing hotel details, user bookings, and transactions. Razorpay is integrated for secure and seamless payments, while Context API is used for efficient state management. Multer is used for handling image uploads efficiently.',
        image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1740495682/Screenshot_2025-02-25_203106_yzmzyg.png'
      },
      {
        title: 'Future Scope',
        content: 'Planned enhancements include a travel guide feature that suggests nearby attractions, restaurants, and activities based on the hotel’s location. Additionally, user reviews and ratings will be implemented to enhance trust and decision-making.',
        image: 'https://images.pexels.com/photos/3299/postit-scrabble-to-do.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  }
];

export default projects;
