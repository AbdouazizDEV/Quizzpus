import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, X, Building2, Trophy, Sparkles, Handshake, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { joinPremiumWaitlist, submitPartnerRequest, submitEnterpriseLead } from '../utils/api';
import BottomNav from '../components/BottomNav';

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState(user?.email || '');
  const [partnerForm, setPartnerForm] = useState({
    company_name: '',
    sector: '',
    email: user?.email || '',
    phone: '',
    estimated_budget: '',
    message: ''
  });
  const [enterpriseForm, setEnterpriseForm] = useState({
    name: '',
    company: '',
    team_size: '1-10',
    email: user?.email || '',
    phone: '',
    needs: ''
  });
  const [loading, setLoading] = useState(false);

  const premiumFeatures = [
    { icon: '♾️', text: 'Quizz illimités par jour (vs 3/jour en gratuit)' },
    { icon: '🎯', text: 'Accès à toutes les compétitions live' },
    { icon: '📊', text: 'Statistiques avancées et analyse de progression' },
    { icon: '🚫', text: 'Zéro publicité' },
    { icon: '🏆', text: 'Badge "Premium" exclusif sur le classement' },
    { icon: '🎁', text: 'Récompenses hebdomadaires doublées' },
    { icon: '🔔', text: 'Alertes prioritaires pour les tournois' },
    { icon: '📚', text: 'Accès aux quiz exclusifs Premium (contenu enrichi)' },
    { icon: '🌍', text: 'Accès en avant-première aux nouveaux thèmes et pays' },
    { icon: '🤝', text: 'Support prioritaire' }
  ];

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await joinPremiumWaitlist(waitlistEmail);
      toast.success('Inscrit sur la liste d\'attente ! Nous te contacterons bientôt.');
      setShowWaitlistModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitPartnerRequest(partnerForm);
      toast.success('Demande envoyée ! Nous te contacterons bientôt.');
      setShowPartnerForm(false);
      setPartnerForm({
        company_name: '',
        sector: '',
        email: user?.email || '',
        phone: '',
        estimated_budget: '',
        message: ''
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitEnterpriseLead(enterpriseForm);
      toast.success('Demande envoyée ! Nous te contacterons bientôt.');
      setShowEnterpriseForm(false);
      setEnterpriseForm({
        name: '',
        company: '',
        team_size: '1-10',
        email: user?.email || '',
        phone: '',
        needs: ''
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="premium-page">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A84C]/20 border border-[#C9A84C] rounded-full mb-4">
            <Sparkles size={16} className="text-[#C9A84C]" />
            <span className="text-sm font-bold text-[#C9A84C]">PREMIUM</span>
          </div>
          <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
            Passe à l'expérience complète
          </h1>
          <p className="text-[#F5EFD9]/70">
            Un modèle équilibré entre accessibilité, durabilité et impact social positif.
          </p>
        </motion.div>

        {/* SECTION A: Abonnements Premium Individuels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-[#F5EFD9] mb-4">Avantages Premium</h2>
          <div className="glass-card p-6 mb-6">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-[#F5EFD9] flex-1">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plans tarifaires */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5">
              <h3 className="font-bold text-[#F5EFD9] mb-2">Mensuel</h3>
              <div className="text-2xl font-black gold-text mb-1">1 500 FCFA</div>
              <div className="text-xs text-[#F5EFD9]/60 mb-4">~2,30€ / mois</div>
              <button
                onClick={() => setShowWaitlistModal(true)}
                className="w-full secondary-button text-sm py-2"
              >
                Choisir Mensuel
              </button>
            </div>

            <div className="glass-card p-5 ring-2 ring-[#C9A84C] relative">
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full">
                🔥 ÉCONOMISE 17%
              </div>
              <h3 className="font-bold text-[#F5EFD9] mb-2">Annuel</h3>
              <div className="mb-1">
                <div className="text-lg font-bold text-[#F5EFD9]/60 line-through">18 000 FCFA</div>
                <div className="text-2xl font-black gold-text">15 000 FCFA</div>
              </div>
              <div className="text-xs text-[#F5EFD9]/60 mb-4">~23€ / an • soit 1 250 FCFA/mois</div>
              <button
                onClick={() => setShowWaitlistModal(true)}
                className="w-full cta-button text-sm py-2"
              >
                Choisir Annuel
              </button>
            </div>
          </div>

          {/* Comparatif */}
          <div className="glass-card p-6 mb-6">
            <h3 className="font-bold text-[#F5EFD9] mb-4">Comparatif Gratuit vs Premium</h3>
            <div className="space-y-3">
              {[
                { feature: 'Quizz par jour', free: '3', premium: 'Illimités' },
                { feature: 'Compétitions live', free: '1/semaine', premium: 'Illimitées' },
                { feature: 'Fun facts', free: '2/jour', premium: 'Illimités' },
                { feature: 'Classement', free: 'Mondial', premium: 'Mondial + Amis' },
                { feature: 'Badges', free: 'Standard', premium: 'Standard + Exclusifs' },
                { feature: 'Publicités', free: 'Oui', premium: 'Non' },
                { feature: 'Support', free: 'Standard', premium: 'Prioritaire' }
              ].map((row, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <span className="text-[#F5EFD9] text-sm">{row.feature}</span>
                  <div className="flex gap-4">
                    <span className="text-[#F5EFD9]/60 text-sm w-20 text-right">{row.free}</span>
                    <span className="text-[#C9A84C] text-sm font-semibold w-24 text-right">{row.premium}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowWaitlistModal(true)}
            className="w-full cta-button mb-8"
          >
            Essayer 7 jours gratuits puis 1 500 FCFA/mois
          </button>
        </motion.div>

        {/* SECTION B: Sponsoring & Publicité Éthique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Handshake size={24} className="text-[#C9A84C]" />
            <h2 className="text-xl font-bold text-[#F5EFD9]">Sponsoring & Publicité Éthique</h2>
          </div>
          <p className="text-[#F5EFD9]/70 mb-4">
            Quizz+ collabore uniquement avec des marques et institutions alignées avec nos valeurs éducatives et culturelles. Pas de pub intrusive. Des partenariats qui ont du sens.
          </p>
          <div className="mb-4">
            <p className="text-sm text-[#F5EFD9]/60 mb-2">Formats disponibles :</p>
            <ul className="space-y-1 text-sm text-[#F5EFD9]/70">
              <li>• Native ads intégrés entre les questions (non-intrusifs)</li>
              <li>• Fun facts sponsorisés (ex: "Fun fact présenté par Orange Sénégal")</li>
              <li>• Récompenses sponsorisées dans le classement hebdo</li>
              <li>• Thèmes quizz co-brandés</li>
            </ul>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {['Orange', 'Free', 'Sonatel Foundation', 'Trace TV', 'Ministère de l\'Éducation'].map((partner) => (
              <div key={partner} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-[#F5EFD9]/70">
                {partner}
              </div>
            ))}
          </div>
          {!showPartnerForm ? (
            <button
              onClick={() => setShowPartnerForm(true)}
              className="w-full secondary-button"
            >
              Devenir partenaire
            </button>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom société"
                value={partnerForm.company_name}
                onChange={(e) => setPartnerForm({ ...partnerForm, company_name: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="text"
                required
                placeholder="Secteur d'activité"
                value={partnerForm.sector}
                onChange={(e) => setPartnerForm({ ...partnerForm, sector: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={partnerForm.email}
                onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={partnerForm.phone}
                onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="text"
                placeholder="Budget estimé"
                value={partnerForm.estimated_budget}
                onChange={(e) => setPartnerForm({ ...partnerForm, estimated_budget: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <textarea
                placeholder="Message"
                value={partnerForm.message}
                onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerForm(false)}
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
        </motion.div>

        {/* SECTION C: Offres Entreprises (B2B) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={20} className="text-[#C9A84C]" />
            <span className="px-2 py-1 bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold rounded-full">
              🏢 ENTREPRISES
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#F5EFD9] mb-2">Solutions sur mesure pour vos équipes</h2>
          <p className="text-[#F5EFD9]/70 mb-4">
            Transformez la formation et la culture d'entreprise avec Quizz+. Engageant, mesurable, africain.
          </p>
          <div className="space-y-3 mb-4">
            {[
              { title: 'Pack RH & Onboarding', desc: 'Quiz d\'intégration personnalisés pour nouveaux employés' },
              { title: 'Pack Formation Continue', desc: 'Bibliothèque de quiz thématiques métiers' },
              { title: 'Pack Team Building', desc: 'Tournois internes entre équipes/départements' }
            ].map((pack, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-[#F5EFD9] mb-1">{pack.title}</h4>
                <p className="text-sm text-[#F5EFD9]/70">{pack.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#C9A84C] font-semibold mb-4">Tarification : Sur devis — à partir de 50 000 FCFA/mois</p>
          {!showEnterpriseForm ? (
            <button
              onClick={() => setShowEnterpriseForm(true)}
              className="w-full secondary-button"
            >
              Demander une démo
            </button>
          ) : (
            <form onSubmit={handleEnterpriseSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom"
                value={enterpriseForm.name}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, name: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="text"
                required
                placeholder="Société"
                value={enterpriseForm.company}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, company: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <select
                required
                value={enterpriseForm.team_size}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, team_size: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              >
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="200+">200+ employés</option>
              </select>
              <input
                type="email"
                required
                placeholder="Email professionnel"
                value={enterpriseForm.email}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, email: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={enterpriseForm.phone}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, phone: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none"
              />
              <textarea
                placeholder="Besoins"
                value={enterpriseForm.needs}
                onChange={(e) => setEnterpriseForm({ ...enterpriseForm, needs: e.target.value })}
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnterpriseForm(false)}
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
        </motion.div>

        {/* SECTION D: Tournois Live & Événements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-[#C9A84C]" />
            <span className="px-2 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-semibold rounded-full">
              ⚡ ÉVÉNEMENTS
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#F5EFD9] mb-2">Tournois Live & Événements Sponsorisés</h2>
          <p className="text-[#F5EFD9]/70 mb-4">
            Des compétitions ludiques et des rencontres qui fédèrent la communauté autour du savoir.
          </p>
          <div className="space-y-2 mb-4">
            {[
              { icon: '🏆', text: 'Tournois hebdomadaires thématiques (classement spécial)' },
              { icon: '🎪', text: 'Événements campus (UCAD, ESP, ISM et autres universités)' },
              { icon: '📺', text: 'Tournois télévisés / streamés (partenariat Trace TV)' },
              { icon: '🌍', text: 'Championnat d\'Afrique Francophone (annuel)' }
            ].map((event, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-[#F5EFD9]/70">
                <span>{event.icon}</span>
                <span>{event.text}</span>
              </div>
            ))}
          </div>
          <div className="glass-card p-4 mb-4" style={{ background: 'rgba(201, 168, 76, 0.1)' }}>
            <div className="text-xs text-[#C9A84C] font-semibold mb-2">PROCHAIN TOURNOI</div>
            <h4 className="font-bold text-[#F5EFD9] mb-1">Culture Générale - Championnat</h4>
            <p className="text-sm text-[#F5EFD9]/70 mb-2">15 mars 2024 • Prix : 50 000 FCFA</p>
            <p className="text-xs text-[#F5EFD9]/60 mb-3">247 participants inscrits</p>
            <button className="w-full cta-button text-sm py-2">
              S'inscrire au tournoi
            </button>
          </div>
          <button className="w-full secondary-button">
            Organiser un événement
          </button>
        </motion.div>
      </div>

      {/* Modal Waitlist */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1B2042]/90 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#F5EFD9]">Paiement bientôt disponible</h3>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} className="text-[#F5EFD9]" />
              </button>
            </div>
            <p className="text-[#F5EFD9]/70 mb-4">
              Inscris-toi pour être notifié en premier dès que le paiement sera disponible !
            </p>
            <form onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Ton email"
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWaitlistModal(false)}
                  className="secondary-button flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-button flex-1 disabled:opacity-50"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Premium;
