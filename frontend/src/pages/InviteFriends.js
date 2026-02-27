import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Copy, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InviteFriends = () => {
  const navigate = useNavigate();
  const inviteCode = 'QUIZZ2024XYZ';

  const handleCopy = () => {
    navigator.clipboard.writeText(`Rejoins-moi sur Quizz+ ! Code: ${inviteCode}`);
    toast.success('Code copié !');
  };

  return (
    <div className="min-h-screen bg-[#1B2042]" data-testid="invite-friends">
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
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-[#FF6B35]/20 rounded-full flex items-center justify-center">
            <Users size={40} className="text-[#FF6B35]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
            Inviter des amis
          </h1>
          <p className="text-[#F5EFD9]/70 mb-8">
            Gagnez 100 points chacun lors de l'inscription !
          </p>

          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-[#F5EFD9]/60 mb-2">Ton code de parrainage</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 px-4 py-3 rounded-lg font-mono text-[#C9A84C] text-lg">
                {inviteCode}
              </div>
              <button
                onClick={handleCopy}
                className="p-3 glass-card-hover rounded-lg"
                data-testid="copy-invite-code-button"
              >
                <Copy size={20} className="text-[#C9A84C]" />
              </button>
            </div>
          </div>

          <button
            onClick={() => toast.success('Partage bientôt disponible')}
            className="cta-button w-full flex items-center justify-center gap-2"
            data-testid="share-invite-button"
          >
            <Share2 size={20} />
            Partager le lien
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default InviteFriends;
