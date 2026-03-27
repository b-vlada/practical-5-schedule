import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lesson } from '../../types';
import styles from './LessonCard.module.css';

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--lesson-color': lesson.color
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.lessonCard}
    >
      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(lesson.id);
        }}
        title="Удалить занятие"
        type="button"
      >
        ×
      </button>
      
      <div 
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        title="Перетащи для перемещения"
      >
        <span className={styles.dragIcon}>☰</span>
      </div>
      
      <div 
        className={styles.lessonContent}
        onClick={() => onEdit(lesson)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.lessonTitle}>{lesson.title}</div>
        <div className={styles.lessonTime}>{lesson.startTime} - {lesson.endTime}</div>
        <div className={styles.lessonDetails}>
          <span>👨‍🏫 {lesson.teacher}</span>
          <span>🚪 {lesson.room}</span>
        </div>
      </div>
    </div>
  );
};