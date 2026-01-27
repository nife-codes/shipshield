import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from './variants'; // make sure the path is correct

const FadeIn = ({ children, duration = 0.5, delay = 0 }) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

