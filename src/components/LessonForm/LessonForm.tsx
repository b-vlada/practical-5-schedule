import { useState, useEffect } from 'react';
import type { Lesson, DayOfWeek } from '../../types';
import { getRandomColor, generateId, checkTimeOverlap } from '../../utils/timeUtils';
import styles from './LessonForm.module.css';

interface LessonFormProps {
  initialLesson?: Lesson | null;
  existingLessons: Lesson[];
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export function LessonForm({
  initialLesson,
  existingLessons,
  onSave,
  onCancel
}: LessonFormProps) {
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    day: 'monday',
    startTime: '09:00',
    endTime: '10:30',
    teacher: '',
    room: '',
    color: getRandomColor()
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLesson) {
      setFormData(initialLesson);
    }
  }, [initialLesson]);

  const handleChange = (field: keyof Lesson, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validate = (): boolean => {
    if (!formData.title?.trim()) {
      setError('Введите название занятия');
      return false;
    }
    if (!formData.teacher?.trim()) {
      setError('Введите имя преподавателя');
      return false;
    }
    if (!formData.room?.trim()) {
      setError('Введите номер аудитории');
      return false;
    }
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        setError('Время окончания должно быть позже начала');
        return false;
      }
    }
    if (formData.day && formData.startTime && formData.endTime) {
      const hasOverlap = existingLessons
        .filter(l => l.id !== formData.id && l.day === formData.day)
        .some(l => checkTimeOverlap(
          formData.startTime!, formData.endTime!,
          l.startTime, l.endTime
        ));
      if (hasOverlap) {
        setError('В это время уже есть занятие!');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lesson: Lesson = {
      id: formData.id || generateId(),
      title: formData.title!.trim(),
      day: formData.day as DayOfWeek,
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      teacher: formData.teacher!.trim(),
      room: formData.room!.trim(),
      color: formData.color || getRandomColor()
    };
    onSave(lesson);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Название занятия *"
        value={formData.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      
      <div className={styles.formRow}>
        <select
          className={styles.select}
          value={formData.day}
          onChange={(e) => handleChange('day', e.target.value)}
        >
          <option value="monday">Понедельник</option>
          <option value="tuesday">Вторник</option>
          <option value="wednesday">Среда</option>
          <option value="thursday">Четверг</option>
          <option value="friday">Пятница</option>
          <option value="saturday">Суббота</option>
          <option value="sunday">Воскресенье</option>
        </select>
      </div>

      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="time"
          value={formData.startTime || ''}
          onChange={(e) => handleChange('startTime', e.target.value)}
        />
        <input
          className={styles.input}
          type="time"
          value={formData.endTime || ''}
          onChange={(e) => handleChange('endTime', e.target.value)}
        />
      </div>

      <input
        className={styles.input}
        placeholder="Преподаватель *"
        value={formData.teacher || ''}
        onChange={(e) => handleChange('teacher', e.target.value)}
      />
      
      <input
        className={styles.input}
        placeholder="Аудитория *"
        value={formData.room || ''}
        onChange={(e) => handleChange('room', e.target.value)}
      />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttons}>
        <button type="submit" className={`${styles.button} ${styles.buttonSave}`}>
          {initialLesson ? 'Обновить' : 'Добавить'}
        </button>
        <button type="button" className={`${styles.button} ${styles.buttonCancel}`} onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}