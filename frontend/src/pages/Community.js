import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Users, Calendar, GraduationCap, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { applyAmbassador } from '../utils/api';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAmbassadorForm, setShowAmbassadorForm] = useState(false);
  const [ambassadorForm, setAmbassadorForm] = useState({
    first_name: '',
    university: '',
    city: '',
    email: user?.email || '',
    motivation: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Calculer l'âge du compte
  const accountAgeDays = user?.created_at 
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const isEligibleForInterview = accountAgeDays >= 30;

  const handleAmbassadorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await applyAmbassador(ambassadorForm);
      toast.success('Candidature envoyée ! Nous te contacterons bientôt.');
      setShowAmbassadorForm(false);
      setAmbassadorForm({
        first_name: '',
        university: '',
        city: '',
        email: user?.email || '',
        motivation: ''
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Réessaie plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="community-page">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
          👥 Rejoins notre communauté
        </h1>
        <p className="text-[#F5EFD9]/70 mb-8">
          Sois parmi les premiers à façonner Quizz+
        </p>

        {/* Section 1: WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
          style={{ background: 'rgba(37, 211, 102, 0.1)', borderColor: 'rgba(37, 211, 102, 0.3)' }}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
                Groupe WhatsApp Beta Testeurs
              </h3>
              <p className="text-[#F5EFD9]/70 mb-4">
                Rejoins les premiers testeurs de Quizz+. Partage tes retours, signale des bugs, découvre les nouveautés en avant-première.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-[#25D366]/20 text-[#25D366] text-xs font-semibold rounded-full">
                  🔒 Groupe privé — Places limitées
                </span>
                <span className="text-sm text-[#F5EFD9]/60">247 membres actifs</span>
              </div>
              <a
                href="https://wa.me/221771234567?text=Bonjour, je souhaite rejoindre le groupe Beta Testeurs Quizz+"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 cta-button"
              >
                <MessageCircle size={18} />
                Rejoindre le groupe WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Discord */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
          style={{ background: 'rgba(88, 101, 242, 0.1)', borderColor: 'rgba(88, 101, 242, 0.3)' }}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎮</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
                Serveur Discord Quizz+
              </h3>
              <p className="text-[#F5EFD9]/70 mb-4">
                Discussions, suggestions, tournois entre membres, annonces exclusives.
              </p>
              <div className="mb-4">
                <p className="text-sm text-[#F5EFD9]/60 mb-2">Channels disponibles :</p>
                <div className="flex flex-wrap gap-2">
                  {['#général', '#suggestions', '#bug-reports', '#classements', '#tournois'].map((channel) => (
                    <span key={channel} className="px-2 py-1 bg-white/5 rounded text-xs text-[#F5EFD9]/70">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                <span className="text-sm text-[#F5EFD9]/60">🟢 En ligne maintenant</span>
              </div>
              <a
                href="https://discord.gg/quizzplus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 cta-button"
              >
                <Users size={18} />
                Rejoindre le Discord
              </a>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Interview 1-to-1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6"
          style={{ background: 'rgba(201, 168, 76, 0.1)', borderColor: 'rgba(201, 168, 76, 0.3)' }}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎙️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
                Entretien exclusif avec l'équipe
              </h3>
              <p className="text-[#F5EFD9]/70 mb-4">
                Tu utilises Quizz+ depuis au moins 1 mois ? Nous t'invitons à un entretien de 20 minutes avec notre équipe pour partager ton expérience en profondeur.
              </p>
              {isEligibleForInterview ? (
                <div>
                  <a
                    href="https://calendly.com/quizzplus/interview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 cta-button mb-4"
                  >
                    <Calendar size={18} />
                    Réserver mon entretien
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-[#F5EFD9]/60 mb-3">
                    Disponible après 1 mois d'utilisation 🗓️
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#F5EFD9]/60 mb-2">
                      <span>Tu es à J+{accountAgeDays}</span>
                      <span>J+30</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((accountAgeDays / 30) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F2D06B]"
                      />
                    </div>
                    <p className="text-xs text-[#F5EFD9]/60 mt-2">
                      Encore {30 - accountAgeDays} jours !
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section 4: Ambassadeurs Campus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎓</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
                Devenir Ambassadeur Campus
              </h3>
              <p className="text-[#F5EFD9]/70 mb-4">
                Étudiant(e) à l'UCAD, ESP, ISM ou dans une autre université ? Représente Quizz+ sur ton campus et gagne des avantages exclusifs.
              </p>
              {!showAmbassadorForm ? (
                <button
                  onClick={() => setShowAmbassadorForm(true)}
                  className="cta-button inline-flex items-center gap-2"
                >
                  <GraduationCap size={18} />
                  Je postule
                </button>
              ) : (
                <form onSubmit={handleAmbassadorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#F5EFD9]/70 mb-2">Prénom</label>
                    <input
                      type="text"
                      required
                      value={ambassadorForm.first_name}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, first_name: e.target.value })}
                      className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
                      placeholder="Ton prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#F5EFD9]/70 mb-2">Université</label>
                    <input
                      type="text"
                      required
                      value={ambassadorForm.university}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, university: e.target.value })}
                      className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
                      placeholder="UCAD, ESP, ISM, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#F5EFD9]/70 mb-2">Ville</label>
                    <input
                      type="text"
                      required
                      value={ambassadorForm.city}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, city: e.target.value })}
                      className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
                      placeholder="Dakar, Thiès, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#F5EFD9]/70 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={ambassadorForm.email}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, email: e.target.value })}
                      className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
                      placeholder="ton@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#F5EFD9]/70 mb-2">Motivation</label>
                    <textarea
                      required
                      value={ambassadorForm.motivation}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, motivation: e.target.value })}
                      className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none resize-none"
                      rows={4}
                      placeholder="Pourquoi veux-tu devenir ambassadeur ?"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAmbassadorForm(false)}
                      className="secondary-button flex-1"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="cta-button flex-1 disabled:opacity-50"
                    >
                      {loading ? 'Envoi...' : 'Envoyer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Community;
