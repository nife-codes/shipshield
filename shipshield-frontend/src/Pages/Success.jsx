import React, { useEffect, useState } from "react";
import CustomButton from "../components/ui/Button";
import SpinningScore from "../components/score/SpinningScore";
import Confetti from "react-confetti";
import { ShieldCheck, Zap, Bug } from "lucide-react";
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

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
          <SpinningScore score={score} size={150} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-black font-bold text-2xl uppercase text-center mt-3">
          {score >= 75 ? (
            <>Your project is now <br />
            ready to <span className="text-[#7B5CF6]">ship!</span></>
          ) : (
            <>Analysis Complete</>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#6B7280] text-sm text-center mt-2">
          {score >= 75 ? (
            <>Excellent work. Your repository meets deployment standards with a score of {score}/100.</>
          ) : (
            <>Your repository has been analyzed. Review the issues below to improve your score.</>
          )}
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

        {topIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Issues Found:</h3>
            <div className="space-y-2">
              {topIssues.map((issue, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{issue}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <hr className="text-[#b4b4b494] w-full my-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4"
        >
          <CustomButton color="primary" onClick={() => navigate('/fixpr', { state: { analysis } })}>
            Generate Fix PR
          </CustomButton>
          <CustomButton color="secondary" onClick={() => navigate('/')}>
            Scan Another Repo
          </CustomButton>
        </motion.div>
      </motion.main>
    </section>
  );
};

export default Success;
