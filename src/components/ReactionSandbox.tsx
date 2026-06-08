import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { checkReaction, type ReactionEffect, type ReactionResult } from '../services/reactions';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Flame, Zap, Wind } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client (optional)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const availableReagents = [
  { id: 'Na', name: 'Sodium (Na)', type: 'element' },
  { id: 'K', name: 'Potassium (K)', type: 'element' },
  { id: 'Cs', name: 'Cesium (Cs)', type: 'element' },
  { id: 'Mg', name: 'Magnesium (Mg)', type: 'element' },
  { id: 'Zn', name: 'Zinc (Zn)', type: 'element' },
  { id: 'C', name: 'Carbon (C)', type: 'element' },
  { id: 'O2', name: 'Oxygen (O₂)', type: 'gas' },
  { id: 'Cl2', name: 'Chlorine (Cl₂)', type: 'gas' },
  { id: 'H2O', name: 'Water (H₂O)', type: 'liquid' },
  { id: 'HCl', name: 'Hydrochloric Acid (HCl)', type: 'liquid' }
];

export const ReactionSandbox: React.FC = () => {
  const [reagentA, setReagentA] = useState<string | null>(null);
  const [reagentB, setReagentB] = useState<string | null>(null);
  const [reaction, setReaction] = useState<ReactionResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (reaction) setReaction(null); // Reset if already reacted
    setError(null);

    if (!reagentA) {
      setReagentA(id);
    } else if (!reagentB && id !== reagentA) {
      setReagentB(id);
      // Wait for user to click Simulate button instead of auto-triggering
    }
  };

  const handleSimulate = async () => {
    if (!reagentA || !reagentB) return;
    setIsEvaluating(true);
    setError(null);
    setReaction(null);

    try {
      if (supabase) {
        // AI-Powered Edge Function route
        const { data, error: supaError } = await supabase.functions.invoke('gemini-reaction', {
          body: { 
            elements: [{ Symbol: reagentA }, { Symbol: reagentB }], 
            conditions: { temperature: 298, pressure: 1.0 } 
          }
        });
        
        if (supaError) throw supaError;
        
        // Map the AI result to our ReactionResult format
        const aiResult = data;
        setReaction({
          equation: `${reagentA} + ${reagentB} → ${aiResult.products.join(' + ') || 'No Reaction'}`,
          description: aiResult.description,
          effect: aiResult.exothermic ? 'explosion' : 'glow'
        });
      } else {
        // Fallback to local rule-based engine
        const res = checkReaction(reagentA, reagentB);
        setReaction(res);
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Simulation failed: ' + errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setReagentA(null);
    setReagentB(null);
    setReaction(null);
    setError(null);
  };

  const renderEffect = (effect: ReactionEffect) => {
    switch (effect) {
      case 'explosion':
        return (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: [1, 2, 1.5, 0], opacity: [1, 1, 0, 0] }} 
            transition={{ duration: 1, times: [0, 0.1, 0.5, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-64 h-64 bg-orange-500 rounded-full mix-blend-screen blur-xl opacity-80" />
            <Zap size={100} className="absolute text-yellow-300 drop-shadow-[0_0_15px_rgba(255,255,0,1)]" />
          </motion.div>
        );
      case 'fire':
        return (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: [0, -20, -40], opacity: [1, 0.8, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center text-orange-500 pointer-events-none"
          >
            <Flame size={80} className="drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]" />
          </motion.div>
        );
      case 'flash':
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white mix-blend-screen blur-md pointer-events-none"
          />
        );
      case 'bubbles':
        return (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: -50, opacity: [0, 1, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-blue-300 pointer-events-none gap-2"
          >
            <Wind size={30} />
            <Wind size={20} className="ml-8" />
            <Wind size={40} className="mr-6" />
          </motion.div>
        );
      case 'glow':
        return (
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-40 h-40 bg-red-500 rounded-full mix-blend-screen blur-2xl opacity-60" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh] min-h-[600px]">
      
      {/* Reagent Shelf */}
      <GlassCard className="p-4 lg:col-span-1 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Droplet className="text-ochre" size={20} />
          Chemical Reagents
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {availableReagents.map(r => {
            const isSelected = reagentA === r.id || reagentB === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id)}
                disabled={isSelected}
                className={`p-3 rounded border text-sm font-bold transition-all text-left
                  ${isSelected 
                    ? 'border-ochre bg-ochre/10 text-ochre opacity-50 cursor-not-allowed' 
                    : 'border-slate-300 dark:border-white/10 bg-slate-200/50 dark:bg-black/20 text-slate-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/10 shadow-sm'
                  }
                `}
              >
                {r.name}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* The Beaker */}
      <GlassCard className="p-4 lg:col-span-2 flex flex-col items-center justify-center relative overflow-hidden">
        
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={handleSimulate}
            disabled={!reagentA || !reagentB || isEvaluating}
            className="px-4 py-2 bg-ochre hover:bg-ochre/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Zap size={16} />
            {isEvaluating ? 'Simulating...' : 'Simulate'}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm font-bold transition-colors shadow-md"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="absolute top-20 z-20 w-[90%] p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-bold border border-red-200 dark:border-red-500/30">
            {error}
          </div>
        )}

        <div className="text-center mb-8 z-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Reaction Beaker</h2>
          <p className="text-slate-500 dark:text-white/50 text-sm">Select two reagents from the shelf to drop them into the beaker.</p>
        </div>

        {/* Visual Beaker */}
        <div className="relative w-64 h-64 border-b-4 border-l-4 border-r-4 border-slate-400 dark:border-white/20 rounded-b-3xl bg-slate-200/30 dark:bg-black/20 flex flex-col items-center justify-end p-4 shadow-inner">
          <div className="absolute top-0 w-full h-1 bg-slate-400 dark:border-white/20" />
          
          <AnimatePresence>
            {reaction && renderEffect(reaction.effect)}
          </AnimatePresence>

          {/* Reagents sitting in beaker */}
          <div className="flex gap-4 z-10 font-black text-2xl text-slate-800 dark:text-white mb-4">
            {reagentA && (
              <motion.div initial={{ y: -200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/50 dark:bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                {reagentA}
              </motion.div>
            )}
            {reagentB && (
              <motion.div initial={{ y: -200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/50 dark:bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                {reagentB}
              </motion.div>
            )}
          </div>
        </div>

        {/* Reaction Output */}
        {reaction && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 text-center max-w-md bg-white/70 dark:bg-black/40 p-4 rounded-xl border border-slate-300 dark:border-white/10 shadow-lg backdrop-blur-md z-10"
          >
            <div className="text-lg font-mono font-bold text-ochre mb-2 tracking-wider">
              {reaction.equation}
            </div>
            <div className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
              {reaction.description}
            </div>
          </motion.div>
        )}
      </GlassCard>

    </div>
  );
};
