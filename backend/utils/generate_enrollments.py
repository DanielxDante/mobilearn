import csv
import random
import pandas as pd
from collections import defaultdict

def _load_preprocessed_course_data() -> pd.DataFrame:
    """
    Load preprocessed course data
    Extract only the course_id and skills
    """
    with open("data/preprocessed_courses.csv", "r", newline="", encoding="utf-8") as file:
        courses = []
        
        reader = csv.DictReader(file)
        for row in reader:
            course_id = row['course_id']
            skills = row['skills']
            courses.append({
                'course_id': course_id,
                'skills': skills
            })

    return pd.DataFrame(courses)

def _map_course_relationships(course_data) -> dict:
    """ Map course relationships """
    course_relationships = defaultdict(set)
    skill_to_courses = defaultdict(set)

    # create course to skill mapping
    for _, course in course_data.iterrows():
        for skills in course['skills']:
            skill_to_courses[skills].add(course['course_id'])
    
    # create course relationships based on shared skills
    for skill, courses in skill_to_courses.items():
        for course1 in courses:
            for course2 in courses:
                if course1 != course2:
                    course_relationships[course1].add(course2)

    return course_relationships

# consider generating a skill graph to show relationships
def generate_enrollments(
        n_users=50,
        max_enrollments_per_user=20,
        monte=0.6
    ) -> pd.DataFrame:
    """ Generate realistic enrollments """
    course_data = _load_preprocessed_course_data()
    course_relationships = _map_course_relationships(course_data)

    enrollments = []

    for user_id in range(1, n_users+1):
        n_enrollments = random.randint(2, max_enrollments_per_user)
        user_enrollments = set()

        # start with a random course
        first_course = random.choice(course_data['course_id'].values)
        enrollments.append({
            'user_id': user_id,
            'course_id': first_course
        })
        user_enrollments.add(first_course)

        for _ in range(n_enrollments - 1):
            possible_related_courses = set()
            for course in user_enrollments:
                possible_related_courses.update(course_relationships[course])
            
            possible_related_courses -= user_enrollments

            next_course = None
            if possible_related_courses and random.random() < monte:
                # select a related course
                next_course = random.choice(list(possible_related_courses))
            else:
                # select a random course
                available_courses = set(course_data['course_id'].values) - user_enrollments
                if available_courses:
                    next_course = random.choice(list(available_courses))
            
            if next_course:
                enrollments.append({
                    'user_id': user_id,
                    'course_id': next_course
                })
                user_enrollments.add(next_course)
        
    enrollments_df = pd.DataFrame(enrollments)
    enrollments_df.to_csv("data/generated_enrollments.csv", index=False)
    return enrollments_df


if __name__ == "__main__":
    generate_enrollments()