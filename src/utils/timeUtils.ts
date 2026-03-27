export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const checkTimeOverlap = (
  start1: string, end1: string,
  start2: string, end2: string
): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getRandomColor = (): string => {
  const colors = [
    '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA',
    '#FFDFBA', '#E2F0CB', '#F0E6EF', '#FFD3B6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};