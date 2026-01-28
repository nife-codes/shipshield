// components/score/SpinningScore.jsx
import { useEffect, useState } from "react";

export default function SpinningScore({
  score = 42,
  size = 200,
  strokeWidth = 10,
  color = "#4F5BD5",
  bgColor = "#E5E7EB",
  duration = 1000,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const percentage = Math.min(elapsed / duration, 1);
      setProgress(Math.round(percentage * score));

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score, duration]);

  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative bg-white rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${duration}ms ease-out`,
          }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute text-center">
        <div
          className="font-semibold text-[#4F5BD5]"
          style={{ fontSize: size * 0.28 }}
        >
          <h1>{progress}</h1>
        </div>
        <div className="text-xs tracking-widest text-gray-500">
          <p>SCORE</p>
        </div>
      </div>
    </div>
  );
}
