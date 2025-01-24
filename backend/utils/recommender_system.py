# Recommendation System Architectures
# GNNs
# Two-Tower -> combining vectors from content and user interactions
# Ranking -> for no user interactions; go for novelty
# Deep Learning to generate hash scores -> social media cases

# Recommendation Models
# Bert4Rec

# Predictive Quality Metrics
# Precision
# Recall
# F1 Score

# Ranking Quality Metrics
# NDCG
# MRR
# MAP
# Hit Rate

# Behavioural Metrics
# Diversity
# Serendipity
# Novelty
# Popularity Bias

# Additional ways to improve recommendation systems
# 1. Use of hybrid models # TODO
# 2. Use of reinforcement learning
# 3. Use of cold start strategies # TODO
## Complete Cold Start
## Warm Start
# 4. Keyword extraction/Stop word removal

# Strategies to optimize textual data
# 1. Lemmatize words
# 2. Remove stop words and add importance using TF-IDF through frequency
# 3. Tokenize phrases
# 4. Use of word embeddings

import pandas as pd
import numpy as np
from sqlalchemy import Integer, String, Float, Column
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app import api
from database import session_scope, create_session
from models.course import Course
from utils.text_processor import TextProcessor

class CourseRecommender:
    def __init__(self):
        """ Initialize the recommender system with database connection """
        self.session = create_session()
        self.courses_df = None
        self.similarity_matrix = None
        self.skill_processor = SkillProcessor()
    
    def _handle_null_numeric(self, value, default_strategy='zero'):
        """ Handle null numeric values """
        if pd.isnull(value):
            if default_strategy == 'zero':
                return 0
            elif default_strategy == 'mean':
                return self.courses_df[self.current_column].mean()
            elif default_strategy == 'median':
                return self.courses_df[self.current_column].median()
        return value
    
    def _handle_null_categorical(self, value, default_strategy='unknown'):
        """ Handle null categorical values """
        if pd.isnull(value):
            if default_strategy == 'unknown':
                return 'unknown'
            elif default_strategy == 'mode':
                return self.courses_df[self.current_column].mode()[0]
        return value
    
    def _get_course_skill_vector(self, skills):
        """Create an averaged vector representation of course skills"""
        vectors = []
        for skill in skills:
            vector = self.skill_processor.get_skill_vector(skill)
            if vector is not None:
                vectors.append(vector)
        
        if vectors:
            return np.mean(vectors, axis=0)
        return np.zeros(100)  # Default vector size
    
    def load_data(self):
        """ Load data from the database """
        self.load_courses()
    
    def load_courses(self):
        """ Load courses into pandas DataFrame """
        # Query all courses from database
        courses = self.session.query(Course).all()

        # Convert to DataFrame
        self.courses_df = pd.DataFrame([
            {
                # Common course fields
                'course_id': course.id, # primary key
                'name': course.name, # embeddings
                'description': course.description, # embeddings
                'course_type': course.type, # one-hot encoded
                'duration': float(course.duration),
                'rating': float(course.rating),
                'price': float(course.price),
                'difficulty': course.difficulty, # one-hot encoded
                'skills': course.skills, # embeddings

                # Course-type specific features
                'school_name': getattr(course, 'school_name', None),
                'program_type': getattr(course, 'program_type', None),
                'field': getattr(course, 'field', None),
                'major': getattr(course, 'major', None),
                'department': getattr(course, 'department', None),
                'expertise': getattr(course, 'expertise', None),
                'subject': getattr(course, 'subject', None),
                'platform': getattr(course, 'platform', None),
            }
            for course in courses
        ])

        # handle nulls in numeric columns
        numeric_columns = []
        for column in numeric_columns:
            self.current_column = column
            self.courses_df[column] = self.courses_df[column].apply(
                lambda x: self._handle_null_numeric(x, default_strategy='zero')
            )

        # handle nulls in categorical columns
        categorical_columns = [
            'school_name', 'program_type', 'field', 'major', 'department',
            'expertise', 'subject', 'platform'
        ]
        for column in categorical_columns:
            self.current_column = column
            self.courses_df[column] = self.courses_df[column].apply(
                lambda x: self._handle_null_categorical(x, default_strategy='unknown')
            )
        
        

        # process skills
        self.courses_df['processed_skills'] = self.courses_df['skills'].apply(
            lambda x: self.skill_processor.preprocess_skills(x)
        )

         # Train skill embeddings
        all_skills = ' '.join(
            self.courses_df['processed_skills'].apply(lambda x: ' '.join(x))
        )
        self.skill_processor.train_skill_embeddings([all_skills])
        
        # Create skill vectors for each course
        self.courses_df['skill_vectors'] = self.courses_df['processed_skills'].apply(
            self._get_course_skill_vector
        )

        self.session.close()
    
    def prepare_features(self):
        """ Prepare features for content-based filtering """
        # TF-IDF Vectorizer for course description
        tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf_vectorizer.fit_transform(self.courses_df['description'])
        self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    def get_content_based_recommendations(
        self,
        latest_enrolled_course_id,
        top_n=5,
        same_type_weight=0.3,
        min_similarity=0.1    
    ):
        pass

    def get_collaborative_based_recommendations(
        self,
        user_enroll_history, 
        top_n=5
    ):
        pass

if __name__ == '__main__':
    # TODO: Add inference model persistence
    recommender = CourseRecommender()

    # load data and prepare features
    recommender.load_data()

    # Get recommendations for a specific course (Content Filtering)
    course_recommendations = recommender.get_content_based_recommendations(
        course_id=1
    )
    print("Content Filtering: ", course_recommendations)

    # Get recommendations based on user history (Collaborative Filtering)
    user_enroll_history = [1, 3, 5]
    personalized_recommendations = recommender.get_collaborative_based_recommendations(
        user_enroll_history=user_enroll_history
    )
    print("Collaborative Filtering: ", personalized_recommendations)