import React, { useState, useEffect } from 'react';

interface PointsAnimationProps {
  points: number;
  initialPoints?: number;
  duration?: number;
}

const PointsAnimation: React.FC<PointsAnimationProps> = ({ 
  points, 
  initialPoints = 0,
  duration = 1000
}) => {
  const [displayedPoints, setDisplayedPoints] = useState(initialPoints);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Reset animation if points change
    if (points !== displayedPoints) {
      setAnimationComplete(false);
      
      const startValue = initialPoints;
      const endValue = points;
      const startTime = performance.now();
      
      const animateValue = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeOutQuad = (t: number) => t * (2 - t);
        const easedProgress = easeOutQuad(progress);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);
        setDisplayedPoints(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateValue);
        } else {
          setAnimationComplete(true);
        }
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [points, initialPoints, duration, displayedPoints]);
  
  return (
    <div className="inline-flex items-center">
      <span className={`font-bold ${animationComplete ? 'text-amber-600' : 'text-gray-800'}`}>
        {displayedPoints}
      </span>
      <span className="ml-1">pts</span>
    </div>
  );
};

export default PointsAnimation;