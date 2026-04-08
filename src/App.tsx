import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ListChecks, Loader2, Check, Copy } from 'lucide-react';
import { TextShimmer } from './components/core/text-shimmer';

const steps = [
  "[task 1]",
  "[task 2]",
  "[task 3]",
  "[task 4]",
  "[task 5]"
];

function CustomCodeBlock() {
  const [copied, setCopied] = useState(false);
  const code = "[code here]";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[450px] rounded-md bg-[#09090b] border border-zinc-800 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2 bg-[#09090b]">
        <div className="flex items-center gap-2">
          <TextShimmer className="font-mono text-sm" duration={1}>
            [filename]
          </TextShimmer>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-200"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 bg-[#09090b]">
        <pre className="text-sm font-mono">
          <code className="text-zinc-300">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  // Initial expansion animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200); // Increased delay to let the slide-in finish first
    return () => clearTimeout(timer);
  }, []);

  // Step progression
  useEffect(() => {
    if (!isOpen) return;
    
    // Start the first step shortly after opening
    const startTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 800);

    return () => clearTimeout(startTimer);
  }, [isOpen]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); // 4s per step to allow for 1s delay
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-zinc-300">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 18 }}
          className="p-4 flex items-center justify-between rounded-t-xl"
        >
          <div className="flex items-center gap-3">
            <ListChecks className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
            <span className="font-medium text-zinc-100">Todo List</span>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                height: { type: "spring", stiffness: 200, damping: 24 }, 
                opacity: { duration: 0.3 } 
              }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4 border-t border-zinc-800/50 mt-4 pt-4">
                {steps.map((step, index) => {
                  const status = index < currentStep ? 'completed' : index === currentStep ? 'loading' : 'pending';
                  const isDone = currentStep >= steps.length;
                  const isExpanded = status === 'loading' || (isDone && expandedTask === index);
                  
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ type: "spring", stiffness: 250, damping: 25, delay: index * 0.08 + 0.1 }}
                      className={`flex items-start gap-3.5 group ${isDone ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (isDone) {
                          setExpandedTask(expandedTask === index ? null : index);
                        }
                      }}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 shrink-0 mt-[1.5px]">
                        <AnimatePresence>
                          {/* Pending State (Empty Circle) */}
                          {status === 'pending' && (
                            <motion.div
                              key="pending"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="absolute inset-0 rounded-full border-2 border-emerald-900/60"
                            />
                          )}
                          
                          {/* Loading State (Spinner only, no dot) */}
                          {status === 'loading' && (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" strokeWidth={2.5} />
                            </motion.div>
                          )}
                          
                          {/* Completed State (Outline Circle + Tick) */}
                          {status === 'completed' && (
                            <motion.div
                              key="completed"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="absolute inset-0 rounded-full border-2 border-emerald-600 flex items-center justify-center"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[8px] h-[8px] text-emerald-600">
                                <motion.polyline 
                                  points="20 6 9 17 4 12" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="flex-1 text-[14px] leading-relaxed">
                        <div className="relative inline-block w-full">
                          {/* Base Text */}
                          {status === 'loading' ? (
                            <TextShimmer className="relative z-10 block font-mono text-sm" duration={1}>
                              {step}
                            </TextShimmer>
                          ) : (
                            <motion.span 
                              animate={{ 
                                color: status === 'completed' ? '#71717a' : '#52525b' 
                              }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="relative z-10 block"
                            >
                              {step}
                            </motion.span>
                          )}
                        </div>

                        {/* Code Block Expansion */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ 
                                height: 'auto', 
                                opacity: 1,
                                transition: { 
                                  height: { type: "spring", stiffness: 120, damping: 20, delay: index > 0 ? 1 : 0 },
                                  opacity: { duration: 0.3, delay: index > 0 ? 1 : 0 }
                                }
                              }}
                              exit={{ 
                                height: 0, 
                                opacity: 0,
                                transition: { 
                                  height: { type: "spring", stiffness: 150, damping: 25 },
                                  opacity: { duration: 0.2 }
                                }
                              }}
                              className="overflow-hidden"
                            >
                              <motion.div 
                                initial={{ y: -10, scale: 0.98, filter: 'blur(4px)' }}
                                animate={{ 
                                  y: 0, 
                                  scale: 1, 
                                  filter: 'blur(0px)',
                                  transition: { 
                                    type: "spring", stiffness: 120, damping: 20, 
                                    delay: index > 0 ? 1.1 : 0.1 
                                  }
                                }}
                                exit={{ 
                                  y: -10, 
                                  scale: 0.98, 
                                  filter: 'blur(4px)',
                                  transition: { type: "spring", stiffness: 150, damping: 25 }
                                }}
                                className="pt-3 pb-1"
                              >
                                <CustomCodeBlock />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}