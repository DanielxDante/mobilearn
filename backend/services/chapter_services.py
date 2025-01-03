from sqlalchemy import or_, not_, func

from models.course import Course
from models.chapter import Chapter
from models.chapter_lesson import ChapterLesson
from models.lesson import Lesson

class ChapterServiceError(Exception):
    pass

class ChapterService:
    @staticmethod
    def attach_lesson(session, chapter_id, lesson_id, order):
        """ Attach a lesson to a chapter """
        chapter = Chapter.get_chapter_by_id(session, chapter_id)
        if not chapter:
            raise ValueError("Chapter not found")

        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        session.query(ChapterLesson).filter(
            ChapterLesson.chapter_id == chapter_id,
            ChapterLesson.order >= order
        ).update({ChapterLesson.order: ChapterLesson.order + 1})

        chapter_lesson = ChapterLesson(
            chapter_id=chapter_id,
            lesson_id=lesson_id,
            order=order
        )
        session.add(chapter_lesson)
        session.flush()

        return chapter
    
    @staticmethod
    def detach_lesson(session, chapter_id, lesson_id):
        """ Detach a lesson from a chapter """
        chapter = Chapter.get_chapter_by_id(session, chapter_id)
        if not chapter:
            raise ValueError("Chapter not found")

        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        chapter_lesson = session.query(ChapterLesson).filter_by(chapter_id=chapter_id, lesson_id=lesson_id).first()
        if not chapter_lesson:
            raise ValueError("Chapter-Lesson association not found")
        
        session.query(ChapterLesson).filter(
            ChapterLesson.chapter_id == chapter_id,
            ChapterLesson.order > chapter_lesson.order
        ).update({ChapterLesson.order: ChapterLesson.order - 1})

        session.delete(chapter_lesson)
        session.flush()

        return chapter