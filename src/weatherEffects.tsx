import React from 'react';
import { motion } from 'framer-motion';

export const RainEffect = () => {
  const raindrops = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 0.6 + Math.random() * 0.4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {raindrops.map(drop => (
        <motion.div
          key={drop.id}
          initial={{ y: -20, x: 0, opacity: 0 }}
          animate={{ 
            y: '120vh',
            x: 20,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: 'linear'
          }}
          className="absolute w-0.5 h-3 bg-white/30 rounded-full"
          style={{ left: drop.left }}
        />
      ))}
    </div>
  );
};

export const CloudsEffect = () => {
  const clouds = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    scale: 0.5 + Math.random() * 0.5,
    y: `${20 + Math.random() * 40}%`,
    duration: 20 + Math.random() * 10
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{ y: cloud.y }}
          initial={{ x: '-20%', opacity: 0.8 }}
          animate={{ x: '120%', opacity: 0.8 }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div 
            className="w-32 h-32 bg-white/20 rounded-full blur-xl"
            style={{ transform: `scale(${cloud.scale})` }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export const SunEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-10 right-10 w-32 h-32"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50" />
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg" />
      </motion.div>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-[calc(10%+64px)] right-[calc(10%+64px)] w-40 h-1 origin-[-32px_0px]"
          style={{
            transform: `rotate(${i * 30}deg)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          <div className="w-full h-full bg-yellow-400/30 blur-sm" />
        </motion.div>
      ))}
    </div>
  );
};

export const SnowEffect = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 6 + Math.random() * 4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map(flake => (
        <motion.div
          key={flake.id}
          initial={{ y: -20, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '120vh',
            rotate: 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: 'linear'
          }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
          style={{ left: flake.left }}
        />
      ))}
    </div>
  );
};

export const ThunderstormEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <RainEffect />
      <motion.div
        className="absolute inset-0 bg-white/5"
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: Math.random() * 5 + 3,
        }}
      />
    </div>
  );
};

export const WeatherBackground = ({ weatherCode }: { weatherCode: string }) => {
  const getWeatherEffect = () => {
    const code = weatherCode.slice(0, 2);
    switch (code) {
      case '01': return <SunEffect />;
      case '02':
      case '03':
      case '04': return <CloudsEffect />;
      case '09':
      case '10': return <RainEffect />;
      case '11': return <ThunderstormEffect />;
      case '13': return <SnowEffect />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {getWeatherEffect()}
    </div>
  );
};