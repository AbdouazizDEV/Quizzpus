import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, Gamepad2 } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Accueil', testId: 'nav-home' },
    { to: '/quiz', icon: BookOpen, label: 'Quizz', testId: 'nav-quiz' },
    { to: '/leaderboard', icon: Trophy, label: 'Classement', testId: 'nav-leaderboard' },
    { to: '/competitions', icon: Gamepad2, label: 'Compétitions', testId: 'nav-competitions' },
    { to: '/profile', icon: User, label: 'Profil', testId: 'nav-profile' }
  ];

  return (
    <div className="bottom-nav" data-testid="bottom-navigation">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            data-testid={item.testId}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#C9A84C]'
                  : 'text-[#F5EFD9]/60 hover:text-[#F5EFD9]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
