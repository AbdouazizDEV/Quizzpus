import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  
  const mockNotifications = [
    { id: 1, type: 'achievement', message: '🏆 Tu es dans le Top 50 cette semaine !', time: 'Il y a 2h' },
    { id: 2, type: 'quiz', message: '🎯 Nouveau quizz disponible — Sciences', time: 'Il y a 5h' },
    { id: 3, type: 'streak', message: '🔥 Ne casse pas ta série ! Joue aujourd\'hui', time: 'Il y a 1j' }
  ];

  return (
    <div className="min-h-screen bg-[#1B2042]" data-testid="notifications">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-6">
          Notifications
        </h1>

        <div className="space-y-3">
          {mockNotifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
              data-testid={`notification-${notif.id}`}
            >
              <p className="text-[#F5EFD9] mb-1">{notif.message}</p>
              <p className="text-sm text-[#F5EFD9]/40">{notif.time}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
