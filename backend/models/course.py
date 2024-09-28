from database import db
from flask import jsonify

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=True, nullable=False)
    school = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(1000), nullable=True)
    rating = db.Column(db.String(10), nullable=True, default=0.0)
    completionRate = db.Column(db.Float, nullable=False, default=0.0)
    image = db.Column(db.String(500), nullable=True)
    enrolledCount = db.Column(db.Integer, nullable=False, default=0)

    @staticmethod
    def add_course(title, school, description=None, image=None):

        # Debugging: Print existing courses
        print("Existing courses before insertion")
        existing_courses = Course.query.all()
        for course in existing_courses:
            print(course.title, course.school)

        new_course = Course(
            title=title,
            school=school,
            description=description,
            image=image
        )
        try:
            db.session.add(new_course)
            db.session.commit()
            return jsonify({"message": "Course added successfully"}), 201
        except Exception as e:
            db.session.rollback()
            print(f"Error occured: {e}")
            return jsonify({"error": str(e)}), 400
        

    @staticmethod
    def get_courses():
        return Course.query.all()
    
    @staticmethod
    def get_course_by_id(id):
        return Course.query.get(id)
    
    @staticmethod
    def get_course_by_title(title):
        return Course.query.filter_by(title=title).first()
    
    @staticmethod
    def get_courses_by_school(school):
        return Course.query.filter_by(school=school).all()
    
    def __repr__(self):
        return f'<ID: {self.id}>, Course: {self.title}, School: {self.school}'