# Recommendation System Architectures
# GNNs or Transformers -> for graph-based recommendations
# Two-Tower -> combining vectors from content and user interactions
# Ranking -> for no user interactions; go for novelty
# Deep Learning to generate hash scores -> social media cases

# Recommendation Models
# implicit
# spotlight
# surprise
# lightfm

# Predictive Quality Metrics
# Precision
# Recall
# F1 Score

# Ranking Quality Metrics
# TODO: calculate these metrics for the open source systems by splitting the matrix into training and test sets
# NDCG
# MRR
# MAP
# Hit Rate
# AUC

# Behavioural Metrics
# Diversity
# Serendipity
# Novelty
# Popularity Bias

# Additional ways to improve recommendation systems
# 1. Use of hybrid models
# 2. Use of cold start strategies
## Complete Cold Start
## Warm Start
# 4. Keyword extraction/Stop word removal
# 5. Use of ranking (review ratings as user-course interaction data)
# 6. Use of embedding store (like Faiss)

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares

from database import create_session
from models.course import Course
from models.enrollment import Enrollment
from utils.field_processor import FieldProcessor
from utils.generate_enrollments import generate_enrollments

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
        # HACK: initialize recommender system depending on type of recommendations
        if not hasattr(self, "recommender"):
            print("Initializing recommender system...")
            self.recommender = CourseRecommender(session)
            self.recommender.load_data()
            self.recommender.preprocess_courses()
            self.recommender.prepare_user_course_data()
            self.recommender.train_implicit_recommendation_model()
            print("Recommender system initialized.")

    def get_instance(self):
        return self.recommender

class CourseRecommender:
    def __init__(self, session):
        """ Initialize the recommender system with database connection """
        self.session = session

        self.courses_df = None
        self.enrollments_df = None

        self.similarity_matrix = None

        self.interactions_matrix = None
        self.user_mapping = None
        self.course_mapping = None
        self.model = None

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
        self.load_enrollments()
    
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
    
    def load_enrollments(self):
        """ 
        Load user-course enrollments into pandas DataFrame
        Interactions are binary (enrolled or not enrolled)
        """
        # Query all enrollments from database
        # enrollments = self.session.query(Enrollment).all()

        # Convert to DataFrame
        # self.enrollments_df = pd.DataFrame([
        #     {
        #         'user_id': enrollment.user_id,
        #         'course_id': enrollment.course_id,
        #     }
        #     for enrollment in enrollments
        # ])

        # HACK: use generated enrollments due to lack of user data
        self.enrollments_df = generate_enrollments()

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
    
    # HACK: Consider using difference distance metrics such as TF-IDF, BM25, etc.
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
        
        # Compute individual similarity matrices through cosine similarity
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
    
    def prepare_user_course_data(self):
        """ Prepare user-course data for collaborative filtering """
        # create unique mappings for user and course IDs
        self.user_mapping = {user_id: idx + 1 for idx, user_id in enumerate(self.enrollments_df['user_id'].unique())}
        self.course_mapping = {course_id: idx + 1 for idx, course_id in enumerate(self.enrollments_df['course_id'].unique())}

        # map user and course IDs to integer indices
        user_indices = [self.user_mapping[user_id] for user_id in self.enrollments_df['user_id']]
        course_indices = [self.course_mapping[course_id] for course_id in self.enrollments_df['course_id']]

        # create sparse matrix for user-course interactions
        self.interactions_matrix = csr_matrix(
            (np.ones(self.enrollments_df.shape[0]),
             (user_indices, course_indices)),
            shape=(len(self.user_mapping) + 1, len(self.course_mapping) + 1)
        )

        return self.interactions_matrix, self.user_mapping, self.course_mapping
    
    def train_implicit_recommendation_model(
        self,
        factors=50,
        iterations=50,
        confidence_multiplier=40
    ):
        """
        Train recommendation model through implicit
        implicit uses Alternating Least Squares
        """
        model = AlternatingLeastSquares(
            factors=factors,
            iterations=iterations,
            alpha=confidence_multiplier
        )
        model.fit(confidence_multiplier * self.interactions_matrix)
        
        self.model = model

        return self.model
    
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
        user_id,
        top_n=10
    ):
        """ Get user-to-item recommendations for a specific user """
        user_idx = self.user_mapping[user_id]
        user_items = self.interactions_matrix[user_idx]

        recommended_course_indices, scores = self.model.recommend(
            userid=user_idx,
            user_items=user_items,
            N=top_n,
            filter_already_liked_items=True
        )

        reverse_course_mapping = {idx: course for course, idx in self.course_mapping.items()}
        # recommended_courses = [
        #     (reverse_course_mapping[course_id], float(score))
        #     for course_id, score in zip(recommended_course_indices, scores)
        # ]
        top_n_course_ids = [int(reverse_course_mapping[course_id]) for course_id in recommended_course_indices]

        return top_n_course_ids
