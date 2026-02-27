import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success('Email de récupération envoyé !');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1B2042] flex flex-col items-center justify-center px-6 py-12" data-testid="forgot-password-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-8"
          data-testid="back-to-login-button"
        >
          <ArrowLeft size={20} />
          Retour
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-[#F5EFD9]/70">
            Entre ton email et nous t'enverrons un lien de récupération.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F5EFD9]/80 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F5EFD9]/40" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="forgot-password-email-input"
                  className="input-field pl-10"
                  placeholder="ton@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="forgot-password-submit-button"
              className="cta-button w-full disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center"
          >
            <CheckCircle size={48} className="text-[#2ECC71] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#F5EFD9] mb-2">
              Email envoyé !
            </h3>
            <p className="text-[#F5EFD9]/70">
              Vérifie ta boîte de réception et clique sur le lien pour réinitialiser ton mot de passe.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
