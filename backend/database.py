import csv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

COMMUNITY_DATASET_PATH = './data/communities.csv'
INSTRUCTOR_DATASET_PATH = './data/instructors.csv'
COURSES_DATASET_PATH = './data/coursera_cleaned.csv'
SAMPLE_INTRO_TEXT_LESSON_PATH = './data/sample_intro_text_lesson.json'
SAMPLE_OUTRO_TEXT_LESSON_PATH = './data/sample_outro_text_lesson.json'
SAMPLE_VIDEO_LESSON_PATH = './data/sample_video_lesson.mp4'
SAMPLE_HOMEWORK_LESSON_PATH = './data/sample_homework_lesson.pdf'

db = SQLAlchemy()
Base = declarative_base()

def init_db(app):
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 15,
        'max_overflow': 15
    }
    db.init_app(app)

def check_db():
    """ Check PostgreSQL database connection """
    try:
        with db.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            conn.close()
    except OperationalError as e:
        raise RuntimeError(f"PostgreSQL database connection failed: {e}")

def create_tables():
    """ Initialise PostgreSQL database tables """
    Base.metadata.create_all(bind=db.engine)

def create_session():
    """ Create a session for apis """
    session = sessionmaker(bind=db.engine)
    return session()

@contextmanager
def session_scope():
    """ 
    Provide a scope around a series of operations   
    Used for POST requests
    """
    session = create_session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()

def load_initial_data():
    """ Load initial data into database """
    print("Loading initial data into the database. This process may take a while. Please be patient...")
    load_channel()
    load_communities()
    load_instructors()
    load_courses()
    load_chapters()
    load_lessons()

def load_channel():
    """ Create a default public channel """
    from models.channel import Channel

    with session_scope() as session:
        Channel.add_channel(
            session,
            name='Public',
            description='MobiLearn public channel for all users',
            invite_code='mobilearn',
            channel_picture_url='https://d20shsb24t3qaz.cloudfront.net/icon.png'
        )

def load_communities():
    """ Load initial communities """
    from models.channel import Channel
    from models.community import Community, COMMUNITY
    from services.channel_services import ChannelService

    with session_scope() as session:
        public_channel = Channel.get_channel_by_invite_code(session, 'mobilearn')
        
        # Add default community for stray instructors
        new_community = Community.add_community(
            session,
            community_type=COMMUNITY.ORGANIZATION,
            name='MobiLearn Network',
            description='MobiLearn community welcomes all instructors to join us!',
            website_url='https://personal.ntu.edu.sg/zhangj/',
            community_logo_url='https://d20shsb24t3qaz.cloudfront.net/icon.png'
        )
        ChannelService.attach_community(session, public_channel.id, new_community.id)

        # Add communities in Kaggle Coursera dataset
        with open(COMMUNITY_DATASET_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                new_community = Community.add_community(
                    session,
                    community_type=row['Type'],
                    name=row['Name'],
                    description=row['Description'],
                    website_url=row['Website Url'],
                    community_logo_url=row['Logo Url']
                )
                ChannelService.attach_community(session, public_channel.id, new_community.id)

def load_instructors():
    """ Load initial instructors """
    from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
    from models.community import Community
    from services.community_services import CommunityService

    with session_scope() as session:
        # Add instructors in Kaggle Coursera dataset
        with open(INSTRUCTOR_DATASET_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                instructor = Instructor.add_instructor(
                    session,
                    name=row['Name'],
                    password=row['Password'],
                    email=row['Email'],
                    phone_number=row['Phone Number'],
                    company=row['Company'],
                    position=row['Position'],
                    gender=row['Gender'],
                    status=INSTRUCTOR_STATUS.ACTIVE
                )
                community = Community.get_community_by_name(session, row['Company'])
                CommunityService.attach_instructor(session, community.id, instructor.id)

def load_courses():
    """ Load initial courses """
    from models.course import Course, STATUS as COURSE_STATUS, COURSE
    from models.instructor import Instructor
    from models.community import Community
    from services.instructor_services import InstructorService

    with session_scope() as session:
        # Add courses in Kaggle Coursera dataset
        with open(COURSES_DATASET_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                instructor_names = row['Instructor'].split(',')

                community = row['Offered By']
                community = Community.get_community_by_name(session, community)

                course = Course.add_course(
                    session,
                    community_id=community.id,
                    name=row['Course Title'].strip(),
                    description=row['What you will learn'],
                    course_type=COURSE.SPECIALIZATION,
                    duration=float(row['Duration']),
                    image_url=row['Course Picture Url'],
                    price=float(row['Price']),
                    difficulty=row['Level'].replace('level', '').strip().lower(),
                    skills=row['Skill gain'].split(','),
                    subject=row['Keyword'],
                    status=COURSE_STATUS.ACTIVE
                )
                
                for instructor_name in instructor_names:
                    instructor_email = instructor_name.strip().replace('.', '').replace('(', '').replace(')', '').replace(' ', '_').lower() + "@edu.com"
                    instructor = Instructor.get_instructor_by_email(session, instructor_email)
                    InstructorService.attach_course(session, instructor.id, course.id)

def load_chapters():
    from models.course import Course
    from models.chapter import Chapter

    with session_scope() as session:
        with open(COURSES_DATASET_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                course_name = row['Course Title'].strip()
                modules = [module.strip() for module in row['Modules'].split(',')]

                if len(modules) < 3:
                    modules = ['Week 1', 'Week 2', 'Week 3']

                course = Course.get_course_by_name(session, course_name)
                if not course:
                    print(f"Course not found: {course_name}")
                    break

                for i in range(1, 4): # Add 3 chapters for each course
                    Chapter.add_chapter(
                        session,
                        course_id=course.id,
                        title=modules[i-1],
                        order=i
                    )

def load_lessons():
    from pathlib import Path
    from werkzeug.datastructures import FileStorage

    from models.course import Course
    from models.lesson import Lesson, LESSON
    from services.chapter_services import ChapterService
    from utils.s3 import upload_file

    with session_scope() as session:
        courses = Course.get_courses(session)
        for course in courses:
            chapters = course.chapters
            for chapter in chapters:
                if chapter.order == 1: # Introduction chapter
                    with open(SAMPLE_INTRO_TEXT_LESSON_PATH, 'r') as file:
                        intro_text = file.read()

                    lesson = Lesson.add_lesson(
                        session,
                        name="Introduction",
                        lesson_type=LESSON.TEXT,
                        content=intro_text,
                    )

                    ChapterService.attach_lesson(session, chapter.id, lesson.id, 1)
                elif chapter.order == 2: # Main content chapter
                    # # Add video lesson
                    # with open(SAMPLE_VIDEO_LESSON_PATH, 'rb') as f:
                    #     file = FileStorage(
                    #         stream=f,
                    #         filename=Path(SAMPLE_VIDEO_LESSON_PATH).name,
                    #         content_type='video/mp4'
                    #     )

                    #     lesson = Lesson.add_lesson(
                    #         session,
                    #         name="Main Content - Video",
                    #         lesson_type=LESSON.VIDEO,
                    #     )

                    #     lesson.video_url = upload_file(file, f"lesson_{lesson.id}")

                    #     ChapterService.attach_lesson(session, chapter.id, lesson.id, 1)

                    # # Add homework lesson
                    # with open(SAMPLE_HOMEWORK_LESSON_PATH, 'rb') as f:
                    #     file = FileStorage(
                    #         stream=f,
                    #         filename=Path(SAMPLE_HOMEWORK_LESSON_PATH).name,
                    #         content_type='application/pdf'
                    #     )

                    #     lesson = Lesson.add_lesson(
                    #         session,
                    #         name="Main Content - Homework",
                    #         lesson_type=LESSON.HOMEWORK,
                    #     )

                    #     lesson.homework_url = upload_file(file, f"lesson_{lesson.id}")

                    #     ChapterService.attach_lesson(session, chapter.id, lesson.id, 2)

                    with open(SAMPLE_INTRO_TEXT_LESSON_PATH, 'r') as file:
                        intro_text = file.read()

                    lesson = Lesson.add_lesson(
                        session,
                        name="Main Content",
                        lesson_type=LESSON.TEXT,
                        content=intro_text,
                    )

                    ChapterService.attach_lesson(session, chapter.id, lesson.id, 1)
                elif chapter.order == 3: # Conclusion chapter
                    with open(SAMPLE_OUTRO_TEXT_LESSON_PATH, 'r') as file:
                        outro_text = file.read()

                    lesson = Lesson.add_lesson(
                        session,
                        name="Conclusion",
                        lesson_type=LESSON.TEXT,
                        content=outro_text,
                    )

                    ChapterService.attach_lesson(session, chapter.id, lesson.id, 1)
                

