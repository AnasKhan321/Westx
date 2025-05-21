


interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
  }
  
  const Loader = ({ size = 'md', text, fullScreen = false }: LoaderProps) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    };
  
    const loaderContent = (
      <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : ''}`}>
        {/* Purple gradient ring loader */}
        <div className={`${sizeClasses[size]} rounded-full animate-spin border-2 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-purple-200`} />
        
        {/* Optional loading text */}
        {text && (
          <p className="text-sm text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  
    // If fullScreen, wrap in a fixed container
    if (fullScreen) {
      return (
        <div className="flex h-[96vh] my-[2vh] w-full justify-center items-center  md:bg-secondaryColor backdrop-blur-sm z-50">
          {loaderContent}
        </div>
      );
    }
  
    return loaderContent;
  };
  
  export default Loader;