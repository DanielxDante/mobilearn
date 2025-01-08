import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as pl
from typing import Dict, List, Optional, Tuple
import logging
import joblib
from datetime import datetime
import faiss

class CourseDataset(Dataset):
    def __init__(self, user_ids, course_ids, ratings, n_users, n_courses):
        self.user_ids = torch.LongTensor(user_ids)
        self.course_ids = torch.LongTensor(course_ids)
        self.ratings = torch.FloatTensor(ratings)
        self.n_users = n_users
        self.n_courses = n_courses

    def __len__(self):
        return len(self.ratings)

    def __getitem__(self, idx):
        return self.user_ids[idx], self.course_ids[idx], self.ratings[idx]

class HybridRecommenderNet(pl.LightningModule):
    def __init__(self, n_users, n_courses, n_factors=50, content_features_dim=512):
        super().__init__()
        self.user_factors = nn.Embedding(n_users, n_factors)
        self.course_factors = nn.Embedding(n_courses, n_factors)
        self.content_projection = nn.Linear(content_features_dim, n_factors)
        
        self.predictor = nn.Sequential(
            nn.Linear(n_factors * 3, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )
        
    def forward(self, user_ids, course_ids, content_features):
        user_embeddings = self.user_factors(user_ids)
        course_embeddings = self.course_factors(course_ids)
        content_embeddings = self.content_projection(content_features)
        
        combined = torch.cat([
            user_embeddings,
            course_embeddings,
            content_embeddings
        ], dim=1)
        
        return self.predictor(combined).squeeze()

class AdvancedCourseRecommender:
    def __init__(self, use_gpu: bool = True):
        self.device = torch.device('cuda' if use_gpu and torch.cuda.is_available() else 'cpu')
        self.model = None
        self.user_encoder = LabelEncoder()
        self.course_encoder = LabelEncoder()
        self.vectorizer = TfidfVectorizer(max_features=512)
        self.scaler = StandardScaler()
        self.faiss_index = None
        self.logger = self._setup_logger()
        
    def _setup_logger(self):
        logger = logging.getLogger('CourseRecommender')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def preprocess_content(self, courses_df: pd.DataFrame) -> np.ndarray:
        text_features = courses_df['title'] + ' ' + courses_df['description']
        tfidf_features = self.vectorizer.fit_transform(text_features).toarray()
        
        numerical_features = courses_df[[
            'difficulty_level', 'duration_hours', 'avg_rating', 
            'num_reviews', 'price'
        ]].values
        
        numerical_features = self.scaler.fit_transform(numerical_features)
        return np.hstack([tfidf_features, numerical_features])

    def build_faiss_index(self, embeddings: np.ndarray):
        dimension = embeddings.shape[1]
        self.faiss_index = faiss.IndexFlatL2(dimension)
        self.faiss_index.add(embeddings.astype('float32'))

    def fit(self, 
            interactions_df: pd.DataFrame, 
            courses_df: pd.DataFrame, 
            epochs: int = 10,
            batch_size: int = 256,
            learning_rate: float = 0.001):
            
        self.logger.info("Starting model training...")
        
        # Encode IDs
        user_ids = self.user_encoder.fit_transform(interactions_df['user_id'])
        course_ids = self.course_encoder.fit_transform(interactions_df['course_id'])
        
        # Process content features
        content_features = self.preprocess_content(courses_df)
        
        # Create dataset
        dataset = CourseDataset(
            user_ids, 
            course_ids,
            interactions_df['rating'].values,
            len(self.user_encoder.classes_),
            len(self.course_encoder.classes_)
        )
        
        # Initialize model
        self.model = HybridRecommenderNet(
            n_users=len(self.user_encoder.classes_),
            n_courses=len(self.course_encoder.classes_),
            content_features_dim=content_features.shape[1]
        ).to(self.device)
        
        # Training loop
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        criterion = nn.MSELoss()
        
        for epoch in range(epochs):
            total_loss = 0
            dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
            
            for batch_user_ids, batch_course_ids, batch_ratings in dataloader:
                batch_content_features = torch.FloatTensor(
                    content_features[batch_course_ids]
                ).to(self.device)
                
                pred_ratings = self.model(
                    batch_user_ids.to(self.device),
                    batch_course_ids.to(self.device),
                    batch_content_features
                )
                
                loss = criterion(pred_ratings, batch_ratings.to(self.device))
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
            
            self.logger.info(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(dataloader):.4f}")
        
        # Build FAISS index for fast similarity search
        course_embeddings = self.model.course_factors.weight.detach().cpu().numpy()
        self.build_faiss_index(course_embeddings)
        
        self.logger.info("Training completed successfully")

    def get_recommendations(self, 
                          user_id: Optional[str] = None,
                          course_id: Optional[str] = None,
                          user_preferences: Optional[Dict] = None,
                          n_recommendations: int = 5) -> List[str]:
        """
        Get recommendations using multiple strategies:
        1. If user_id provided: Collaborative filtering
        2. If course_id provided: Similar course recommendations
        3. If user_preferences provided: Content-based filtering
        """
        if user_id is not None:
            return self._get_user_recommendations(user_id, n_recommendations)
        elif course_id is not None:
            return self._get_similar_courses(course_id, n_recommendations)
        elif user_preferences is not None:
            return self._get_preference_based_recommendations(user_preferences, n_recommendations)
        else:
            raise ValueError("Must provide either user_id, course_id, or user_preferences")

    def _get_user_recommendations(self, user_id: str, n: int) -> List[str]:
        encoded_user_id = self.user_encoder.transform([user_id])[0]
        user_embedding = self.model.user_factors(
            torch.LongTensor([encoded_user_id]).to(self.device)
        ).detach().cpu().numpy()
        
        D, I = self.faiss_index.search(user_embedding, n)
        return self.course_encoder.inverse_transform(I[0])

    def _get_similar_courses(self, course_id: str, n: int) -> List[str]:
        encoded_course_id = self.course_encoder.transform([course_id])[0]
        course_embedding = self.model.course_factors(
            torch.LongTensor([encoded_course_id]).to(self.device)
        ).detach().cpu().numpy()
        
        D, I = self.faiss_index.search(course_embedding, n + 1)  # +1 to exclude the input course
        recommended_ids = self.course_encoder.inverse_transform(I[0][1:])  # exclude first item (input course)
        return recommended_ids.tolist()

    def _get_preference_based_recommendations(self, preferences: Dict, n: int) -> List[str]:
        # Create a feature vector from preferences
        dummy_text = f"{preferences.get('category', '')} {preferences.get('difficulty', '')}"
        text_features = self.vectorizer.transform([dummy_text]).toarray()
        
        numerical_features = np.array([[
            preferences.get('difficulty_level', 0),
            preferences.get('duration_hours', 0),
            preferences.get('min_rating', 0),
            0,  # num_reviews placeholder
            preferences.get('max_price', 0)
        ]])
        
        numerical_features = self.scaler.transform(numerical_features)
        preference_features = np.hstack([text_features, numerical_features])
        
        # Project preferences into embedding space
        preference_embedding = self.model.content_projection(
            torch.FloatTensor(preference_features).to(self.device)
        ).detach().cpu().numpy()
        
        D, I = self.faiss_index.search(preference_embedding, n)
        return self.course_encoder.inverse_transform(I[0]).tolist()

    def save_model(self, path: str):
        state = {
            'model_state': self.model.state_dict(),
            'user_encoder': self.user_encoder,
            'course_encoder': self.course_encoder,
            'vectorizer': self.vectorizer,
            'scaler': self.scaler,
            'faiss_index': faiss.serialize_index(self.faiss_index)
        }
        torch.save(state, path)
        self.logger.info(f"Model saved to {path}")

    def load_model(self, path: str):
        state = torch.load(path, map_location=self.device)
        self.model.load_state_dict(state['model_state'])
        self.user_encoder = state['user_encoder']
        self.course_encoder = state['course_encoder']
        self.vectorizer = state['vectorizer']
        self.scaler = state['scaler']
        self.faiss_index = faiss.deserialize_index(state['faiss_index'])
        self.logger.info(f"Model loaded from {path}")