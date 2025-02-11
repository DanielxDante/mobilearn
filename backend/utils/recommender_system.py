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
# 2. Use of cold start strategies
## Complete Cold Start
## Warm Start
# 4. Keyword extraction/Stop word removal

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from database import create_session
from models.course import Course
from utils.field_processor import FieldProcessor

def get_course_recommender():
    if CourseRecommenderSingleton._instance is None:
        CourseRecommenderSingleton._instance = CourseRecommenderSingleton()
        CourseRecommenderSingleton._instance._initialize(create_session())
    return CourseRecommenderSingleton._instance.get_instance()

class CourseRecommenderSingleton:
    _instance = None 

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CourseRecommenderSingleton, cls).__new__(cls)
        return cls._instance

    def _initialize(self, session):
        if not hasattr(self, "recommender"):
            print("Initializing recommender system...")
            self.recommender = CourseRecommender(session)
            self.recommender.load_data()
            self.recommender.preprocess_courses()
            print("Recommender system initialized.")

    def get_instance(self):
        return self.recommender

class CourseRecommender:
    def __init__(self, session):
        """ Initialize the recommender system with database connection """
        self.session = session

        self.courses_df = None

        self.similarity_matrix = None
        self.field_processor = FieldProcessor()
    
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
    
    def load_data(self):
        """ Load data from the database """
        self.load_courses()
        self.preprocess_courses()

        # self.load_users()
        # self.load_enrollments()
    
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
                'course_type': course.course_type, # one-hot encoded
                'duration': float(course.duration), # scaled
                'rating': float(course.rating), # scaled
                'price': float(course.price), # scaled
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

        # handle nulls in optional categorical columns
        categorical_columns = [
            'school_name', 'program_type', 'field', 'major', 'department',
            'expertise', 'subject', 'platform'
        ]
        for column in categorical_columns:
            self.current_column = column
            self.courses_df[column] = self.courses_df[column].apply(
                lambda x: self._handle_null_categorical(x, default_strategy='unknown')
            )

        self.session.close()
    
    def preprocess_courses(self):
        """ Preprocess course data """
        dummy_courses_df = self.courses_df.copy()

        numerical_columns = ['duration', 'rating', 'price']
        categorical_columns = [
            'course_type', 'difficulty', 
            'school_name', 'program_type', 
            'field', 'major', 'department', 
            'expertise', 'subject', 'platform'
        ]
        text_columns = ['name', 'description', 'skills']

        preprocessed_df = self.field_processor.execute_field_processing_pipeline(
            df=dummy_courses_df,
            numerical_columns=numerical_columns,
            categorical_columns=categorical_columns,
            text_columns=text_columns
        )

        # Export preprocessed DataFrame to CSV
        preprocessed_df.to_csv('data/preprocessed_courses.csv', index=False)

        # train text embeddings
        self.field_processor.train_text_embeddings(preprocessed_df)

        # generate course features
        feature_matrices = self.extract_course_features(preprocessed_df)

        # compute item similarity matrix
        self.similarity_matrix = self.compute_item_similarity(feature_matrices)

        return {
            'original_courses_df': self.courses_df,
            'preprocessed_df': preprocessed_df,
            'feature_matrices': feature_matrices,
            'similarity_matrix': self.similarity_matrix
        }

    
    def _get_text_embedding(self, text, embedding_type, embedding_model):
        """ Get embeddings for text """
        tokens = text.split() if isinstance(text, str) else text

        embeddings = []
        for token in tokens:
            try:
                if embedding_type == 'name':
                    embedding = embedding_model[token]
                    embeddings.append(embedding)
                elif embedding_type == 'description':
                    embedding = embedding_model[token]
                    embeddings.append(embedding)
                elif embedding_type == 'skills':
                    embedding = embedding_model[token]
                    embeddings.append(embedding)
            except KeyError:
                continue
        
        return np.mean(embeddings, axis=0) if embeddings else np.zeros(embedding_model.vector_size)

    def extract_course_features(self, preprocessed_df):
        """ Engineer features for courses for item-to-item recommendations """
        # get numerical features
        numerical_features = preprocessed_df[['duration', 'rating', 'price']].values

        # extract text embeddings
        name_embeddings = preprocessed_df['name'].apply(
            lambda x: self._get_text_embedding(
                x,
                embedding_type='name',
                embedding_model=self.field_processor.name_embeddings
            )
        )
        description_embeddings = preprocessed_df['description'].apply(
            lambda x: self._get_text_embedding(
                x,
                embedding_type='description',
                embedding_model=self.field_processor.description_embeddings
            )
        )
        skills_embeddings = preprocessed_df['skills'].apply(
            lambda x: self._get_text_embedding(
                x,
                embedding_type='skills',
                embedding_model=self.field_processor.skill_embeddings
            )
        )

        name_embedding_matrix = np.vstack(name_embeddings.values)
        description_embedding_matrix = np.vstack(description_embeddings.values)
        skills_embedding_matrix = np.vstack(skills_embeddings.values)

        # get categorical features
        categorical_columns = [col for col in preprocessed_df.columns 
                               if col.startswith((
                                      'course_type_', 'difficulty_', 
                                      'school_name_', 'program_type_', 
                                      'field_', 'major_', 'department_', 
                                      'expertise_', 'subject_', 'platform_'
                               ))]
        categorical_features = preprocessed_df[categorical_columns].values

        combined_embedding_matrix = np.hstack([
            name_embedding_matrix,
            description_embedding_matrix, 
            skills_embedding_matrix,
            numerical_features,
            categorical_features
        ])

        return {
            'combined_embedding_matrix': combined_embedding_matrix,
            'name_embeddings': name_embedding_matrix,
            'description_embeddings': description_embedding_matrix,
            'skills_embeddings': skills_embedding_matrix,
            'numerical_features': numerical_features,
            'categorical_features': categorical_features
        }
    
    def compute_item_similarity(self, feature_matrices, weights=None):
        """
        Compute item similarity matrix
        Weights are customizable for different features
        """
        if weights is None:
            weights = {
                'name': 0.3,
                'description': 0.1,
                'skills': 0.3,
                'numerical': 0.15,
                'categorical': 0.15
            }
        
        # Compute individual similarity matrices
        name_sim = cosine_similarity(feature_matrices['name_embeddings'])
        desc_sim = cosine_similarity(feature_matrices['description_embeddings'])
        skills_sim = cosine_similarity(feature_matrices['skills_embeddings'])
        numerical_sim = cosine_similarity(feature_matrices['numerical_features'])
        categorical_sim = cosine_similarity(feature_matrices['categorical_features'])
        
        # Combine similarities with weights
        weighted_sim = (
            weights['name'] * name_sim +
            weights['description'] * desc_sim +
            weights['skills'] * skills_sim +
            weights['numerical'] * numerical_sim +
            weights['categorical'] * categorical_sim
        )
        
        return weighted_sim
    
    def get_item_to_item_recommendations(
        self,
        course_id,
        top_n=10,
        min_similarity=0.1    
    ):
        """ Get item-to-item recommendations for a specific course """
        # get course index
        course_indices = self.courses_df[self.courses_df['course_id'] == course_id].index
        if len(course_indices) == 0:
            raise ValueError(f"Course ID {course_id} not found in the dataset.")
        course_index = course_indices[0]

        # get similarity scores for the course
        similarity_scores = self.similarity_matrix[course_index]

        # get top N similar courses
        similar_courses_indices = np.argsort(similarity_scores)[::-1]
        similar_courses_indices = similar_courses_indices[similarity_scores[similar_courses_indices] > min_similarity]

        # exclude the given course_id
        similar_courses_indices = similar_courses_indices[similar_courses_indices != course_index]

        # return top N course_ids as a comma delimited array
        top_n_course_ids = self.courses_df.iloc[similar_courses_indices]['course_id'].head(top_n).values.tolist()

        return top_n_course_ids

    def get_user_to_item_recommendations(
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

    # test field processor
    # similar_skills = preprocessor.find_similar_words('python', embedding_type='skill')

    # Get recommendations for a specific course (Content Filtering)
    # course_recommendations = recommender.get_item_to_item_recommendations(
    #     course_id=1
    # )
    # print("Content Filtering: ", course_recommendations)

    # Get recommendations based on user history (Collaborative Filtering)
    # user_enroll_history = [1, 3, 5]
    # personalized_recommendations = recommender.get_collaborative_based_recommendations(
    #     user_enroll_history=user_enroll_history
    # )
    # print("Collaborative Filtering: ", personalized_recommendations)