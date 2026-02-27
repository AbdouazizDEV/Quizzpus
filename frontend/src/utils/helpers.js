import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#C9A84C', '#F2D06B', '#FF6B35', '#F5EFD9']
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerStars = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['#FFD700', '#C9A84C', '#F2D06B']
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

export const showFloatingPoints = (points, x, y) => {
  const pointsEl = document.createElement('div');
  pointsEl.className = 'float-points';
  pointsEl.textContent = `+${points} pts`;
  pointsEl.style.left = `${x}px`;
  pointsEl.style.top = `${y}px`;
  
  document.body.appendChild(pointsEl);
  
  setTimeout(() => {
    pointsEl.remove();
  }, 1500);
};

export const getLevelInfo = (points) => {
  if (points < 100) {
    return { level: 1, name: 'Débutant', icon: '🌱', nextLevel: 100, progress: points };
  } else if (points < 500) {
    return { level: 2, name: 'Apprenant', icon: '📚', nextLevel: 500, progress: points - 100 };
  } else if (points < 1000) {
    return { level: 3, name: 'Curieux', icon: '🧠', nextLevel: 1000, progress: points - 500 };
  } else if (points < 3000) {
    return { level: 4, name: 'Érudit', icon: '⭐', nextLevel: 3000, progress: points - 1000 };
  } else if (points < 10000) {
    return { level: 5, name: 'Explorateur', icon: '🌍', nextLevel: 10000, progress: points - 3000 };
  } else {
    return { level: 6, name: 'Champion', icon: '👑', nextLevel: 10000, progress: 10000 };
  }
};
