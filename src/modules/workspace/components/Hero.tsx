import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Cpu, Network, Zap, Code, Database, BrainCircuit } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[140px] md:h-[160px] rounded-3xl overflow-hidden group isolate bg-slate-50 dark:bg-slate-950 shadow-xl shadow-indigo-100/50 dark:shadow-2xl dark:shadow-indigo-900/20 border border-indigo-100 dark:border-indigo-500/10 transition-colors duration-300">
      {/* 1. Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/80 via-slate-50 to-slate-50 dark:from-indigo-900/40 dark:via-slate-950 dark:to-slate-950 transition-colors duration-300" />
      
      {/* 2. Animated Grid & Particles (Dark Mode Only) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-20 transition-opacity duration-300" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Floating Digital Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-indigo-500/10 dark:bg-indigo-500/20 backdrop-blur-sm border border-indigo-300/30 dark:border-indigo-400/30 rounded-lg"
          style={{
            width: Math.random() * 40 + 20,
            height: Math.random() * 40 + 20,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* 3. Content Layer */}
      <div className="relative h-full flex items-center justify-center px-8 md:px-12 py-3 z-10">
        {/* Animated AI Agent Icon */}
        <div className="hidden md:flex items-center justify-center w-full h-full relative">
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
            <div className="relative z-10 flex flex-col items-center transform scale-50 md:scale-75">
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
            >
              <Cpu size={24} className="text-indigo-400" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 -right-12 p-2.5 bg-slate-800/80 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20"
              animate={{ x: [0, 10, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <Database size={20} className="text-purple-400" />
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -left-6 p-3 bg-slate-800/80 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
            >
              <Code size={24} className="text-cyan-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
