from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(BigInteger, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    threads = relationship("ForumThread", back_populates="author", foreign_keys="[ForumThread.user_id]")
    posts = relationship("ForumPost", back_populates="author", foreign_keys="[ForumPost.user_id]")
    thread_votes = relationship("ThreadVote", back_populates="user")
    post_votes = relationship("PostVote", back_populates="user")

class Instructor(Base):
    __tablename__ = 'instructors'
    
    instructor_id = Column(BigInteger, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    title = Column(String(100))  # e.g., "Professor", "Teaching Assistant"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    threads = relationship("ForumThread", back_populates="instructor_author", foreign_keys="[ForumThread.instructor_id]")
    posts = relationship("ForumPost", back_populates="instructor_author", foreign_keys="[ForumPost.instructor_id]")
    courses = relationship("CourseInstructor", back_populates="instructor")

class CourseInstructor(Base):
    __tablename__ = 'course_instructors'
    
    course_id = Column(BigInteger, ForeignKey('courses.course_id'), primary_key=True)
    instructor_id = Column(BigInteger, ForeignKey('instructors.instructor_id'), primary_key=True)
    is_head_instructor = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="instructors")
    instructor = relationship("Instructor", back_populates="courses")

class Course(Base):
    __tablename__ = 'courses'
    
    course_id = Column(BigInteger, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    threads = relationship("ForumThread", back_populates="course")
    tags = relationship("ThreadTag", back_populates="course")
    instructors = relationship("CourseInstructor", back_populates="course")

class ForumThread(Base):
    __tablename__ = 'forum_threads'
    
    thread_id = Column(BigInteger, primary_key=True)
    course_id = Column(BigInteger, ForeignKey('courses.course_id'), nullable=False)
    user_id = Column(BigInteger, ForeignKey('users.user_id'))
    instructor_id = Column(BigInteger, ForeignKey('instructors.instructor_id'))
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    is_announcement = Column(Boolean, default=False)
    is_instructor_reply_required = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="threads")
    author = relationship("User", back_populates="threads", foreign_keys=[user_id])
    instructor_author = relationship("Instructor", back_populates="threads", foreign_keys=[instructor_id])
    posts = relationship("ForumPost", back_populates="thread")
    votes = relationship("ThreadVote", back_populates="thread")
    tags = relationship("ThreadTag", secondary="thread_tag_mappings", back_populates="threads")

class ForumPost(Base):
    __tablename__ = 'forum_posts'
    
    post_id = Column(BigInteger, primary_key=True)
    thread_id = Column(BigInteger, ForeignKey('forum_threads.thread_id'), nullable=False)
    user_id = Column(BigInteger, ForeignKey('users.user_id'))
    instructor_id = Column(BigInteger, ForeignKey('instructors.instructor_id'))
    parent_post_id = Column(BigInteger, ForeignKey('forum_posts.post_id'))
    content = Column(Text, nullable=False)
    is_solution = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    thread = relationship("ForumThread", back_populates="posts")
    author = relationship("User", back_populates="posts", foreign_keys=[user_id])
    instructor_author = relationship("Instructor", back_populates="posts", foreign_keys=[instructor_id])
    parent_post = relationship("ForumPost", remote_side=[post_id], backref="replies")
    votes = relationship("PostVote", back_populates="post")

class ThreadTag(Base):
    __tablename__ = 'thread_tags'
    
    tag_id = Column(BigInteger, primary_key=True)
    name = Column(String(50), nullable=False)
    course_id = Column(BigInteger, ForeignKey('courses.course_id'), nullable=False)

    # Relationships
    course = relationship("Course", back_populates="tags")
    threads = relationship("ForumThread", secondary="thread_tag_mappings", back_populates="tags")

class ThreadTagMapping(Base):
    __tablename__ = 'thread_tag_mappings'
    
    thread_id = Column(BigInteger, ForeignKey('forum_threads.thread_id'), primary_key=True)
    tag_id = Column(BigInteger, ForeignKey('thread_tags.tag_id'), primary_key=True)

class ThreadVote(Base):
    __tablename__ = 'thread_votes'
    
    thread_id = Column(BigInteger, ForeignKey('forum_threads.thread_id'), primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), primary_key=True)
    vote_type = Column(SmallInteger, nullable=False)  # 1: upvote, -1: downvote
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    thread = relationship("ForumThread", back_populates="votes")
    user = relationship("User", back_populates="thread_votes")

class PostVote(Base):
    __tablename__ = 'post_votes'
    
    post_id = Column(BigInteger, ForeignKey('forum_posts.post_id'), primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), primary_key=True)
    vote_type = Column(SmallInteger, nullable=False)  # 1: upvote, -1: downvote
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("ForumPost", back_populates="votes")
    user = relationship("User", back_populates="post_votes")
