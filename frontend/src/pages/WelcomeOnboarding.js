import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../utils/api';
import { toast } from 'sonner';

const WelcomeOnboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { name: 'Sénégal', flag: '🇸🇳' },
    { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { name: 'Cameroun', flag: '🇨🇲' },
    { name: 'Bénin', flag: '🇧🇯' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Maroc', flag: '🇲🇦' },
    { name: 'Mali', flag: '🇲🇱' },
    { name: 'Guinée', flag: '🇬🇳' },
    { name: 'Autre', flag: '🌍' }
  ];

  const themes = [
    { id: 'Culture générale', name: 'Culture générale', icon: '🌍' },
    { id: 'Afrique', name: 'Afrique', icon: '🌺' },
    { id: 'Histoire', name: 'Histoire', icon: '📜' },
    { id: 'Sciences', name: 'Sciences', icon: '🔬' },
    { id: 'Divertissement', name: 'Divertissement', icon: '🎬' },
    { id: 'Sénégal', name: 'Sénégal', icon: '🇸🇳' },
    { id: 'Sport', name: 'Sport', icon: '⚽' },
    { id: 'Santé', name: 'Santé', icon: '💊' }
  ];

  const handleThemeToggle = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(t => t !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedCountry) {
      toast.error('Sélectionne ton pays');
      return;
    }
    if (step === 2 && selectedThemes.length < 2) {
      toast.error('Sélectionne au moins 2 thèmes');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    
    // Sauvegarder en localStorage comme fallback
    const profileData = {
      country: selectedCountry,
      favorite_themes: selectedThemes,
      timestamp: Date.now()
    };
    localStorage.setItem('pending_profile_update', JSON.stringify(profileData));
    
    // Mettre à jour le contexte local immédiatement
    const updatedUser = {
      ...user,
      country: selectedCountry,
      favorite_themes: selectedThemes
    };
    updateUser(updatedUser);
    
    try {
      // Tentative de sauvegarde API
      const response = await updateUserProfile({
        country: selectedCountry,
        favorite_themes: selectedThemes
      });
      
      // Succès : mettre à jour avec les données du serveur
      updateUser(response.data);
      localStorage.removeItem('pending_profile_update');
      toast.success('Profil complété !');
    } catch (error) {
      // Erreur API : logger pour debug mais ne pas bloquer
      console.error('Erreur API lors de la mise à jour du profil:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        data: profileData
      });
      
      // Afficher un message informatif mais pas bloquant
      toast.warning('Profil sauvegardé localement. Synchronisation en cours...');
      
      // Retry en arrière-plan après 2 secondes
      setTimeout(async () => {
        try {
          const retryResponse = await updateUserProfile({
            country: selectedCountry,
            favorite_themes: selectedThemes
          });
          updateUser(retryResponse.data);
          localStorage.removeItem('pending_profile_update');
          console.log('Profil synchronisé avec succès');
        } catch (retryError) {
          console.error('Échec du retry de synchronisation:', retryError);
        }
      }, 2000);
    } finally {
      setLoading(false);
      // TOUJOURS naviguer vers le dashboard, même en cas d'erreur
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B2042] px-6 py-12" data-testid="welcome-onboarding">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? 'bg-[#C9A84C] text-[#1B2042]'
                    : 'bg-white/10 text-[#F5EFD9]/40'
                }`}
              >
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-[#C9A84C]' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Country Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-[#F5EFD9] mb-2" data-testid="country-step-title">
              D'où viens-tu ?
            </h2>
            <p className="text-[#F5EFD9]/70 mb-8">
              Sélectionne ton pays pour personnaliser ton expérience
            </p>

            <div className="grid grid-cols-3 gap-4">
              {countries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => setSelectedCountry(country.name)}
                  data-testid={`country-${country.name}`}
                  className={`glass-card-hover p-4 text-center transition-all ${
                    selectedCountry === country.name
                      ? 'ring-2 ring-[#C9A84C] bg-[#C9A84C]/20'
                      : ''
                  }`}
                >
                  <div className="text-4xl mb-2">{country.flag}</div>
                  <div className="text-sm font-medium text-[#F5EFD9]">
                    {country.name}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedCountry}
              data-testid="country-next-button"
              className="cta-button w-full mt-8 disabled:opacity-50"
            >
              Suivant <ChevronRight size={20} className="ml-2" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Themes Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-[#F5EFD9] mb-2" data-testid="themes-step-title">
              Tes thèmes favoris
            </h2>
            <p className="text-[#F5EFD9]/70 mb-2">
              Sélectionne au moins 2 thèmes qui t'intéressent
            </p>
            <p className="text-[#C9A84C] text-sm mb-8">
              {selectedThemes.length} thème{selectedThemes.length > 1 ? 's' : ''} sélectionné{selectedThemes.length > 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeToggle(theme.id)}
                  data-testid={`theme-${theme.id}`}
                  className={`glass-card-hover p-6 text-left transition-all relative ${
                    selectedThemes.includes(theme.id)
                      ? 'ring-2 ring-[#C9A84C] bg-[#C9A84C]/20'
                      : ''
                  }`}
                >
                  {selectedThemes.includes(theme.id) && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#C9A84C] rounded-full flex items-center justify-center">
                      <Check size={16} className="text-[#1B2042]" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{theme.icon}</div>
                  <div className="font-semibold text-[#F5EFD9]">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                data-testid="themes-back-button"
                className="secondary-button flex-1"
              >
                Retour
              </button>
              <button
                onClick={handleNext}
                disabled={selectedThemes.length < 2}
                data-testid="themes-next-button"
                className="cta-button flex-1 disabled:opacity-50"
              >
                Suivant <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#C9A84C]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-[#F5EFD9] mb-2" data-testid="confirmation-title">
                Bonjour {user?.name?.split(' ')[0]} !
              </h2>
              <p className="text-[#F5EFD9]/70 mb-8">
                Tu es prêt(e) à jouer et apprendre ?
              </p>
            </div>

            <div className="glass-card p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">
                  {countries.find(c => c.name === selectedCountry)?.flag}
                </div>
                <div>
                  <div className="text-sm text-[#F5EFD9]/60">Ton pays</div>
                  <div className="font-semibold text-[#F5EFD9]">{selectedCountry}</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm text-[#F5EFD9]/60 mb-2">Tes thèmes</div>
                <div className="flex flex-wrap gap-2">
                  {selectedThemes.map((themeId) => {
                    const theme = themes.find(t => t.id === themeId);
                    return (
                      <div
                        key={themeId}
                        className="px-3 py-1 bg-[#C9A84C]/20 rounded-full text-sm font-medium text-[#F5EFD9] flex items-center gap-1"
                      >
                        <span>{theme.icon}</span>
                        <span>{theme.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              data-testid="confirmation-complete-button"
              className="cta-button w-full disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Allons-y ! 🚀'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeOnboarding;
