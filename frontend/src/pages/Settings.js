import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Globe, Volume2, Moon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1B2042]" data-testid="settings">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-6">
          Paramètres
        </h1>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#F5EFD9] mb-3">Notifications</h3>
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[#C9A84C]" />
                  <span className="text-[#F5EFD9]">Rappel quotidien</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F5EFD9] mb-3">Application</h3>
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} className="text-[#C9A84C]" />
                  <span className="text-[#F5EFD9]">Sons et vibrations</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F5EFD9] mb-3">Communauté</h3>
            <div className="glass-card p-4">
              <button
                onClick={() => navigate('/community')}
                className="w-full glass-card-hover p-4 flex items-center gap-4"
                data-testid="community-settings-button"
              >
                <Users size={24} className="text-[#C9A84C]" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[#F5EFD9]">Rejoindre la communauté</p>
                  <p className="text-sm text-[#F5EFD9]/60">WhatsApp, Discord, entretiens</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
