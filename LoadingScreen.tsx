import { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center cosmic-bg">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl neon-text mb-4 floating-animation">
            Love Space
          </h1>
          <p className="text-2xl neon-purple-text pulse-animation">
            Creating magic for Liza...
          </p>
        </div>
        
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 text-xl neon-text">
          {progress}%
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          {['❤️', '💕', '💖'].map((emoji, index) => (
            <span 
              key={index}
              className="text-4xl heart-glow pulse-animation"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;