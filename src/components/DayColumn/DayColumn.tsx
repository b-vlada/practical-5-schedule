import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek, Lesson } from '../../types';
import { dayNames } from '../../utils/dayNames';
import { LessonCard } from '../LessonCard/LessonCard';
import styles from './DayColumn.module.css';

interface DayColumnProps {
  day: DayOfWeek;
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, lessons, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: day });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dayColumn} ${isOver ? styles.dragOver : ''}`}
    >
      <div className={styles.dayHeader}>{dayNames[day]}</div>
      <div className={styles.lessonsList}>
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};