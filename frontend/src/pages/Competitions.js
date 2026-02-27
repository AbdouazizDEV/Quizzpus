import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Competitions = () => {
  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="competitions">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
          Compétitions Live
        </h1>
        <p className="text-[#F5EFD9]/70 mb-8">
          Affronte d'autres joueurs en temps réel
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-[#C9A84C]/20 rounded-full flex items-center justify-center">
            <Trophy size={40} className="text-[#C9A84C]" />
          </div>
          <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
            Bientôt disponible !
          </h3>
          <p className="text-[#F5EFD9]/70">
            Les compétitions live arrivent prochainement. Prépare-toi à défier les meilleurs joueurs !
          </p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Competitions;
