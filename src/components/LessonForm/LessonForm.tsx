import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lesson } from '../../types';
import styles from "./LessonForm.module.css";

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(lesson.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.lessonCard}
      onDoubleClick={() => onEdit(lesson)}
    >
      <button
        className={styles.deleteButton}
        onClick={handleDeleteClick}
        title="Удалить занятие"
      >
        ×
      </button>
      
      <div className={styles.lessonTitle}>{lesson.title}</div>
      <div className={styles.lessonTime}>{lesson.startTime} - {lesson.endTime}</div>
      <div className={styles.lessonDetails}>
        <span>👨‍🏫 {lesson.teacher}</span>
        <span>🚪 {lesson.room}</span>
      </div>
    </div>
  );
};