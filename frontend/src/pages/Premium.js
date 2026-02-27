import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Premium = () => {
  const navigate = useNavigate();

  const features = [
    '♾️ Quizz illimités par jour',
    '🎯 Questions exclusives',
    '📊 Statistiques avancées',
    '🚫 Sans publicité',
    '🎁 Récompenses exclusives',
    '🏆 Accès anticipé aux nouvelles fonctionnalités'
  ];

  return (
    <div className="min-h-screen bg-[#1B2042]" data-testid="premium">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#C9A84C] to-[#F2D06B] rounded-full flex items-center justify-center">
            <Crown size={40} className="text-[#1B2042]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
            Passe à Quizz+ Premium 🌟
          </h1>
          <p className="text-[#F5EFD9]/70">
            Débloque tout le potentiel de Quizz+
          </p>
        </motion.div>

        <div className="glass-card p-6 mb-6">
          <h3 className="font-bold text-[#F5EFD9] mb-4">Avantages Premium</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-[#2ECC71]" />
                </div>
                <span className="text-[#F5EFD9]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-[#F5EFD9]">Mensuel</h4>
              <div className="text-right">
                <p className="text-2xl font-black gold-text">1 500 FCFA</p>
                <p className="text-sm text-[#F5EFD9]/60">/mois</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 ring-2 ring-[#C9A84C]">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-bold text-[#F5EFD9]">Annuel</h4>
                <span className="text-xs px-2 py-1 bg-[#2ECC71]/20 text-[#2ECC71] rounded-full">
                  Économise 17%
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black gold-text">15 000 FCFA</p>
                <p className="text-sm text-[#F5EFD9]/60">/an</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.info('Bientôt disponible')}
            className="cta-button w-full"
            data-testid="subscribe-premium-button"
          >
            S'abonner maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
