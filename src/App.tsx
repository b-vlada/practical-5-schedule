import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Lesson, FilterState, DayOfWeek } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { dayNames } from './utils/dayNames';
import { DayColumn } from './components/DayColumn/DayColumn';
import { LessonForm } from './components/LessonForm/LessonForm';
import styles from './App.module.css';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function App() {
  const [lessons, setLessons] = useLocalStorage<Lesson[]>('schedule-lessons', []);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    day: 'all',
    teacher: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDay = filters.day === 'all' || lesson.day === filters.day;
    const matchesTeacher = !filters.teacher || lesson.teacher.toLowerCase().includes(filters.teacher.toLowerCase());
    return matchesSearch && matchesDay && matchesTeacher;
  });

  const getLessonsByDay = (day: DayOfWeek): Lesson[] => {
    return filteredLessons.filter(lesson => lesson.day === day);
  };

  const handleSaveLesson = (lesson: Lesson) => {
    if (editingLesson) {
      setLessons(lessons.map(l => l.id === lesson.id ? lesson : l));
    } else {
      setLessons([...lessons, lesson]);
    }
    setShowModal(false);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('Удалить занятие?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const lessonId = active.id as string;
    const newDay = over.id as DayOfWeek;
    
    if (!DAYS.includes(newDay)) return;

    setLessons(lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, day: newDay } : lesson
    ));
  };

  const stats = {
    total: lessons.length,
    today: lessons.filter(l => l.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek).length,
    teachers: new Set(lessons.map(l => l.teacher)).size
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>📅 Конструктор расписания</h1>
          <div className={styles.controls}>
            <input
              className={styles.input}
              placeholder="🔍 Поиск..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className={styles.select}
              value={filters.day}
              onChange={(e) => setFilters({ ...filters, day: e.target.value as DayOfWeek | 'all' })}
            >
              <option value="all">Все дни</option>
              {DAYS.map(day => (
                <option key={day} value={day}>{dayNames[day]}</option>
              ))}
            </select>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => setShowModal(true)}>
              + Добавить
            </button>
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Всего занятий</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.today}</div>
            <div className={styles.statLabel}>Сегодня</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.teachers}</div>
            <div className={styles.statLabel}>Преподавателей</div>
          </div>
        </div>

        <div className={styles.grid}>
          {DAYS.map(day => (
            <SortableContext
              key={day}
              items={getLessonsByDay(day).map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <DayColumn
                day={day}
                lessons={getLessonsByDay(day)}
                onEdit={(lesson) => {
                  setEditingLesson(lesson);
                  setShowModal(true);
                }}
                onDelete={handleDeleteLesson}
              />
            </SortableContext>
          ))}
        </div>

        {filteredLessons.length === 0 && lessons.length > 0 && (
          <div className={styles.emptyState}>
            Нет занятий по выбранным фильтрам
          </div>
        )}

        {showModal && (
          <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingLesson ? '✏️ Редактировать' : '➕ Добавить'} занятие
                </h2>
                <button className={styles.closeButton} onClick={() => {
                  setShowModal(false);
                  setEditingLesson(null);
                }}>×</button>
              </div>
              <LessonForm
                initialLesson={editingLesson}
                existingLessons={lessons}
                onSave={handleSaveLesson}
                onCancel={() => {
                  setShowModal(false);
                  setEditingLesson(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}

export default App;