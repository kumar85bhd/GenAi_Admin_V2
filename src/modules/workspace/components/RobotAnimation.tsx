import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Code } from 'lucide-react';

interface RobotAnimationProps {
  scale?: number;
  className?: string;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ scale = 0.5, className = '' }) => {
  return (
    <div className={`hidden md:flex items-center justify-center relative ${className}`}>
      {/* Glowing Aura */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-56 h-56 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[50px]"
      />
      
      {/* Robot Composition */}
      <motion.div 
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-56 h-56 flex items-center justify-center"
      >
        {/* Robot Character */}
        <div className="relative z-10 flex flex-col items-center transform" style={{ transform: `scale(${scale})` }}>
          {/* Head */}
          <div className="relative w-40 h-32 bg-gradient-to-b from-slate-100 to-slate-300 rounded-[2.5rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-slate-100 flex items-center justify-center z-20">
            {/* Face Screen */}
            <div className="w-[88%] h-[82%] bg-slate-950 rounded-[2rem] relative overflow-hidden shadow-inner flex flex-col items-center justify-center border border-slate-800">
               {/* Screen Gloss */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-b-full opacity-50" />
               
               {/* Eyes */}
               <div className="flex gap-6 mb-2">
                 <motion.div 
                   initial={{ scaleY: 0.1 }}
                   animate={{ scaleY: 1 }}
                   transition={{ duration: 0.5, delay: 0.5 }}
                   className="w-8 h-4 border-t-[5px] border-cyan-400 rounded-t-full drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                 />
                 <motion.div 
                   initial={{ scaleY: 0.1 }}
                   animate={{ scaleY: 1 }}
                   transition={{ duration: 0.5, delay: 0.5 }}
                   className="w-8 h-4 border-t-[5px] border-cyan-400 rounded-t-full drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                 />
               </div>
               
               {/* Smile */}
               <motion.div 
                  className="w-4 h-2 border-b-[3px] border-cyan-400 rounded-b-full opacity-80"
               />
            </div>

            {/* Ears */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-16 bg-gradient-to-r from-slate-300 to-slate-100 rounded-2xl shadow-md -z-10 border-l border-slate-300" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-16 bg-gradient-to-l from-slate-300 to-slate-100 rounded-2xl shadow-md -z-10 border-r border-slate-300" />
          </div>

          {/* Body */}
          <div className="relative -mt-4 w-28 h-20 bg-gradient-to-b from-slate-200 to-slate-400 rounded-[2rem] shadow-xl z-10 flex items-center justify-center border-t border-slate-300">
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
             </div>
          </div>
        </div>
        
        {/* Floating Tech Icons */}
        <motion.div 
          className="absolute -top-6 -right-2 p-3 bg-slate-800/80 backdrop-blur-md rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          style={{ transform: `scale(${scale})` }}
        >
          <Cpu size={24} className="text-indigo-400" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 -right-12 p-2.5 bg-slate-800/80 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20"
          animate={{ x: [0, 10, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          style={{ transform: `scale(${scale})` }}
        >
          <Database size={20} className="text-purple-400" />
        </motion.div>

        <motion.div 
          className="absolute -bottom-4 -left-6 p-3 bg-slate-800/80 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
          style={{ transform: `scale(${scale})` }}
        >
          <Code size={24} className="text-cyan-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RobotAnimation;
