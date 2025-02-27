export const getWeatherBackground = (weatherCode: string): string => {
  const timeOfDay = weatherCode.includes('n') ? 'night' : 'day';
  const condition = weatherCode.slice(0, 2);

  const backgrounds = {
    day: {
      '01': 'from-sky-400 to-blue-500',
      '02': 'from-blue-400 to-blue-600',
      '03': 'from-gray-300 to-gray-400',
      '04': 'from-gray-400 to-gray-600',
      '09': 'from-blue-700 to-gray-700',
      '10': 'from-blue-600 to-gray-600',
      '11': 'from-gray-700 to-purple-900',
      '13': 'from-blue-100 to-blue-300',
      '50': 'from-gray-400 to-gray-500'
    },
    night: {
      '01': 'from-blue-900 to-purple-900',
      '02': 'from-gray-800 to-blue-900',
      '03': 'from-gray-700 to-gray-800',
      '04': 'from-gray-800 to-gray-900',
      '09': 'from-gray-800 to-blue-900',
      '10': 'from-gray-900 to-blue-900',
      '11': 'from-gray-900 to-purple-900',
      '13': 'from-blue-900 to-purple-900',
      '50': 'from-gray-700 to-gray-800'
    }
  };

  return backgrounds[timeOfDay][condition] || 'from-blue-500 to-purple-600';
};

export const getWeatherEmoji = (weatherCode: string): string => {
  const condition = weatherCode.slice(0, 2);
  const emojis: { [key: string]: string } = {
    '01': '☀️',
    '02': '⛅',
    '03': '☁️',
    '04': '☁️',
    '09': '🌧️',
    '10': '🌦️',
    '11': '⛈️',
    '13': '❄️',
    '50': '🌫️'
  };
  return emojis[condition] || '🌡️';
};

export const isDayTime = (weatherCode: string): boolean => {
  return !weatherCode.includes('n');
};