export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Lesson {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  teacher: string;
  room: string;
  color: string;
}

export interface FilterState {
  search: string;
  day: DayOfWeek | 'all';
  teacher: string;
}