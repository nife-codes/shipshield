import React, { useEffect, useState } from "react";
import CustomButton from "../components/ui/Button";
import SpinningScore from "../components/score/SpinningScore";
import Confetti from "react-confetti";
import { ShieldCheck, Zap, Bug } from "lucide-react";


const Success = () => {
  const [showConfetti, setShowConfetti] = useState(true);

  const data = [
  {
    icon: ShieldCheck,
    title: "Security Rating",
    result: "A+",
  },
  {
    icon: Zap,
    title: "Performance",
    result: "95/100",
  },
  {
    icon: Bug,
    title: "Issues Fixed",
    result: "12",
  },
];


 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-[#F2F3F7] flex justify-center p-10 items-center min-h-screen">
      {showConfetti && <Confetti numberOfPieces={120} />}

      <main className="bg-white flex flex-col border border-[#D9F5E6] items-center rounded-lg p-10 max-w-max">
        <SpinningScore score={95} size={150} />

        <h1 className="text-black font-bold text-2xl uppercase text-center mt-3">
          Your project is now <br />
          ready to <span className="text-[#7B5CF6]">ship!</span>
        </h1>

        <p className="text-[#6B7280] text-sm text-center mt-2">
          Excellent work. All critical vulnerabilities have been patched and code
          quality <br />
          metrics meet the deployment threshold
        </p>

        <div className="flex gap-6 mt-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#F9FAFB] p-4 rounded-md min-w-[120px]"
            >
              <item.icon className="text-[#7B5CF6] mb-2" size={20} />
              <p className="text-[#6B7280] text-xs">{item.title}</p>
              <h1 className="text-black font-bold">{item.result}</h1>
            </div>
          ))}
        </div>

        <hr className="text-[#b4b4b494] w-full my-6" />

        <CustomButton color="primary">
          scan another repo
        </CustomButton>
      </main>
    </section>
  );
};

export default Success;
