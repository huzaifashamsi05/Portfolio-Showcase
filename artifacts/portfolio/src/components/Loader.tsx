import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 800); // Wait for fade out
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isDone ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-32 h-32 border-t-2 border-cyan-neon rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-24 h-24 border-b-2 border-purple-neon rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-purple-neon text-glow-cyan"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          MHS
        </motion.div>
      </div>
    </motion.div>
  );
}
