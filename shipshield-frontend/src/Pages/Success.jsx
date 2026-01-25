import React, { useEffect, useState } from "react";
import CustomButton from "../components/ui/Button";
import SpinningScore from "../components/score/SpinningScore";
import Confetti from "react-confetti";
import { ShieldCheck, Zap, Bug } from "lucide-react";
import { motion} from 'framer-motion'

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
    <section className="bg-[#F2F3F7] flex justify-center p-4 md:p-10 items-center min-h-screen">
      {showConfetti && <Confetti numberOfPieces={120} />}

      <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
              className="bg-white flex flex-col border border-[#D9F5E6] items-center rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
        >
          <SpinningScore score={95} size={150} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-black font-bold text-2xl uppercase text-center mt-3">
          Your project is now <br />
          ready to <span className="text-[#7B5CF6]">ship!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#6B7280] text-sm text-center mt-2">
          Excellent work. All critical vulnerabilities have been patched and code
          quality <br />
          metrics meet the deployment threshold
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, staggerChildren: 0.1 }}
          className="flex gap-6 mt-6">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex flex-col items-center bg-[#F9FAFB] p-4 rounded-md min-w-[120px]"
            >
              <item.icon className="text-[#7B5CF6] mb-2" size={20} />
              <p className="text-[#6B7280] text-xs">{item.title}</p>
              <h1 className="text-black font-bold">{item.result}</h1>
            </motion.div>
          ))}
        </motion.div>

        <hr className="text-[#b4b4b494] w-full my-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <CustomButton color="primary">
            scan another repo
          </CustomButton>
        </motion.div>
      </motion.main>
    </section>
  );
};

export default Success;
