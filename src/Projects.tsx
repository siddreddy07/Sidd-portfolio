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
        image: 'https://images.unsplash.com/photo-1650735310415-392ab5378954?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
  },
  {
    id: 4,
    name: 'email-buddy',
    info: [
      {
        title: 'Project Overview',
        content: 'The AI Email Buddy is a Chrome extension built to enhance the Gmail experience by summarizing email content using the OpenRouter API. It highlights 3–4 key points, turns plain URLs into clickable links, includes image URLs in the summary, and shows status using colored badges. Designed for efficiency, it auto-refreshes to summarize new emails and stores API keys securely within the extension.',
        video: 'https://res.cloudinary.com/deiiozl5e/video/upload/v1746065900/gpcizflif4ekb3j4tkgu.mp4'
      },
      {
        title: 'Tech Stack (MERN)',
        content: 'The project is built using vanilla JavaScript for content scripts, React for the popup interface, and Tailwind CSS for styling. React Icons are used for visual elements in the UI, while the OpenRouter API handles email summarization. The extension uses Chrome Extension APIs for Gmail integration and is bundled using a modern build setup like Webpack or similar tooling.',
        image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1750671590/email_buddy_qxw6ag.jpg'
      },
      {
        title: 'Future Scope',
        content: 'In the future, the extension could support attachment summarization (e.g., PDFs), work across other email providers like Outlook, and offer customizable summary lengths. Adding OAuth login to replace the manual API key step, providing a lightweight analytics dashboard for summaries, and eventually publishing it on the Chrome Web Store are also planned improvements.',
        image: 'https://images.pexels.com/photos/3299/postit-scrabble-to-do.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  },
  {
    id: 5,
    name: 'AutoTwitterPost',
    info: [
      {
        title: 'Project Overview',
        content: 'The MCP Twitter Post System is a real-time tweet-launching platform designed with a clean client-server architecture. The heart of the system is the MCP Server, a Node.js-powered backend that listens for tweet commands from the client, processes them using the Twitter API, and ensures seamless communication via Server-Sent Events (SSE). Users can send tweets directly from the command line, with instant feedback and secure handling of API credentials.',
        video: 'https://player.cloudinary.com/embed/?cloud_name=deiiozl5e&public_id=cirbctw1ohdmoxk2ezbz&profile=cld-adaptive-stream'
      },
      {
        title: 'Tech Stack (MERN)',
        content: 'The system is built using Node.js, with the backend logic handled by the MCP Server using either native HTTP or Express. It utilizes Server-Sent Events (SSE) to enable real-time, one-way communication from server to client. The Twitter API, accessed via the twitter-api-v2 library, is used to post tweets programmatically. Secrets such as API keys are managed securely using Dotenv, and the project is cleanly organized into client/ and server/ directories for maintainability.',
        image: 'https://res.cloudinary.com/deiiozl5e/image/upload/v1750671601/Screenshot_2025-06-23_150834_mcnaer.png'
      },
      {
        title: 'Future Scope',
        content: 'Planned enhancements include adding a web-based interface for composing and managing tweets, support for scheduling tweets, and managing multiple Twitter accounts. The MCP Server can be extended to include logging, rate-limit handling, and integration with other platforms such as Slack or Discord. Additionally, real-time tweet history, error feedback, and OAuth-based login are in the pipeline to improve usability and security.',
        image: 'https://images.pexels.com/photos/3299/postit-scrabble-to-do.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  }
];

export default projects;
