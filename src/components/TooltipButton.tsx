
const TooltipButton = ({ buttons }) => {



    return (
      <div className="flex bg-transparent w-24">
        {buttons.map((button, index) => (
          <div key={index} className="group bg-transparent relative inline-block">
            <button className="p-2 bg-transparent"  onClick={() => window.open(button.url, "_blank")}>
              <span className="w-8 hover:scale-110 text-2xl md:text-3xl font-bold hover:bg-gradient-to-r hover:from-[#64ffda] hover:to-[#00bcd4] hover:bg-clip-text duration-200">
                {button.icon}
              </span>
            </button>
            <span className="absolute -top-10 left-[50%] -translate-x-[50%] 
              z-20 origin-left scale-0 px-3 rounded-lg border 
              border-gray-300 bg-white text-black py-2 text-sm font-bold
              shadow-md transition-all duration-300 ease-in-out 
              group-hover:scale-100">
              {button.name}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  export default TooltipButton;
  