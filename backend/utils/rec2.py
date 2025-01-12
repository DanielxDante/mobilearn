import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from typing import List, Dict, Tuple

class CourseRecommender:
    def __init__(self, courses_df: pd.DataFrame):
        """
        Initialize the recommender system with a DataFrame containing course information.
        
        Args:
            courses_df: DataFrame with columns matching the Course model
        """
        self.courses_df = courses_df
        self.content_similarities = None
        self.prepare_data()
        
    def prepare_data(self):
        """Prepare the data for both content and collaborative filtering"""
        # Fill NA values
        self.courses_df['skills'] = self.courses_df['skills'].fillna('')
        self.courses_df['description'] = self.courses_df['description'].fillna('')
        self.courses_df['difficulty'] = self.courses_df['difficulty'].fillna('BEGINNER')
        
        # Normalize numerical features
        scaler = MinMaxScaler()
        self.courses_df['normalized_price'] = scaler.fit_transform(
            self.courses_df['price'].fillna(0).values.reshape(-1, 1)
        )
        self.courses_df['normalized_duration'] = scaler.fit_transform(
            self.courses_df['duration'].fillna(0).values.reshape(-1, 1)
        )
        
    def build_content_based_model(self):
        """Build the content-based filtering model"""
        # Combine text features
        self.courses_df['combined_features'] = (
            self.courses_df['name'] + ' ' +
            self.courses_df['description'] + ' ' +
            self.courses_df['skills'] + ' ' +
            self.courses_df['difficulty'].astype(str) + ' ' +
            self.courses_df['course_type'].astype(str)
        )
        
        # Create TF-IDF matrix
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.courses_df['combined_features'])
        
        # Calculate content similarity matrix
        self.content_similarities = cosine_similarity(tfidf_matrix)
        
    def get_content_based_recommendations(self, course_id: int, n_recommendations: int = 5) -> List[Dict]:
        """
        Get content-based recommendations for a given course.
        
        Args:
            course_id: ID of the course to base recommendations on
            n_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended courses with similarity scores
        """
        if self.content_similarities is None:
            self.build_content_based_model()
            
        # Find the index of the course in our dataframe
        course_idx = self.courses_df[self.courses_df['id'] == course_id].index[0]
        
        # Get similarity scores for the course
        course_similarities = self.content_similarities[course_idx]
        
        # Get indices of most similar courses (excluding the course itself)
        similar_indices = course_similarities.argsort()[::-1][1:n_recommendations+1]
        
        # Create list of recommended courses with similarity scores
        recommendations = []
        for idx in similar_indices:
            course = self.courses_df.iloc[idx]
            recommendations.append({
                'id': course['id'],
                'name': course['name'],
                'similarity_score': course_similarities[idx],
                'course_type': course['course_type'],
                'difficulty': course['difficulty'],
                'price': float(course['price'])
            })
            
        return recommendations
    
    def build_collaborative_filtering_model(self, ratings_df: pd.DataFrame):
        """
        Build collaborative filtering model using user ratings.
        
        Args:
            ratings_df: DataFrame with columns (user_id, course_id, rating)
        """
        # Create user-item matrix
        self.ratings_matrix = ratings_df.pivot(
            index='user_id',
            columns='course_id',
            values='rating'
        ).fillna(0)
        
        # Calculate item-item similarity matrix
        self.collaborative_similarities = cosine_similarity(self.ratings_matrix.T)
        
    def get_collaborative_recommendations(
        self,
        user_id: int,
        n_recommendations: int = 5
    ) -> List[Dict]:
        """
        Get collaborative filtering recommendations for a user.
        
        Args:
            user_id: ID of the user to get recommendations for
            n_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended courses with predicted ratings
        """
        if user_id not in self.ratings_matrix.index:
            return []
            
        # Get user's ratings
        user_ratings = self.ratings_matrix.loc[user_id]
        
        # Calculate predicted ratings for all courses
        predicted_ratings = np.zeros(len(self.courses_df))
        
        for i in range(len(self.courses_df)):
            if user_ratings[i] == 0:  # Only predict for unrated courses
                similar_items = self.collaborative_similarities[i]
                similar_ratings = user_ratings * similar_items
                
                # Calculate weighted average
                if similar_ratings.sum() != 0:
                    predicted_ratings[i] = similar_ratings.sum() / similar_items.sum()
        
        # Get top N recommendations
        recommended_indices = predicted_ratings.argsort()[::-1][:n_recommendations]
        
        recommendations = []
        for idx in recommended_indices:
            course = self.courses_df.iloc[idx]
            recommendations.append({
                'id': course['id'],
                'name': course['name'],
                'predicted_rating': float(predicted_ratings[idx]),
                'course_type': course['course_type'],
                'difficulty': course['difficulty'],
                'price': float(course['price'])
            })
            
        return recommendations

    def get_hybrid_recommendations(
        self,
        user_id: int,
        course_id: int,
        n_recommendations: int = 5,
        content_weight: float = 0.5
    ) -> List[Dict]:
        """
        Get hybrid recommendations combining content-based and collaborative filtering.
        
        Args:
            user_id: ID of the user
            course_id: ID of the reference course
            n_recommendations: Number of recommendations to return
            content_weight: Weight given to content-based recommendations (0-1)
            
        Returns:
            List of recommended courses with combined scores
        """
        content_recs = self.get_content_based_recommendations(
            course_id,
            n_recommendations * 2
        )
        collab_recs = self.get_collaborative_recommendations(
            user_id,
            n_recommendations * 2
        )
        
        # Combine recommendations
        course_scores = {}
        
        # Add content-based scores
        for rec in content_recs:
            course_scores[rec['id']] = {
                'score': rec['similarity_score'] * content_weight,
                'course_data': rec
            }
            
        # Add collaborative filtering scores
        for rec in collab_recs:
            if rec['id'] in course_scores:
                course_scores[rec['id']]['score'] += (
                    rec['predicted_rating'] * (1 - content_weight)
                )
            else:
                course_scores[rec['id']] = {
                    'score': rec['predicted_rating'] * (1 - content_weight),
                    'course_data': rec
                }
                
        # Sort by combined score and get top N
        sorted_courses = sorted(
            course_scores.items(),
            key=lambda x: x[1]['score'],
            reverse=True
        )[:n_recommendations]
        
        return [
            {**item[1]['course_data'], 'combined_score': item[1]['score']}
            for item in sorted_courses
        ]
    
###################################################################################

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple
from collections import defaultdict
import torch
import torch.nn as nn
import torch.optim as optim
from datetime import datetime, timedelta
import redis
import json

class DQNModel(nn.Module):
    def __init__(self, state_size: int, action_size: int):
        super(DQNModel, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(state_size, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, action_size)
        )
        
    def forward(self, x):
        return self.network(x)

class ReplayBuffer:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.buffer = []
        self.position = 0
        
    def push(self, state, action, reward, next_state):
        if len(self.buffer) < self.capacity:
            self.buffer.append(None)
        self.buffer[self.position] = (state, action, reward, next_state)
        self.position = (self.position + 1) % self.capacity
        
    def sample(self, batch_size: int) -> List[Tuple]:
        return random.sample(self.buffer, batch_size)
    
    def __len__(self):
        return len(self.buffer)

class RLCourseRecommender:
    def __init__(self, 
                 content_recommender,
                 collaborative_recommender,
                 n_courses: int,
                 redis_host='localhost',
                 redis_port=6379):
        self.content_recommender = content_recommender
        self.collaborative_recommender = collaborative_recommender
        self.redis_client = redis.Redis(host=redis_host, port=redis_port)
        
        # RL components
        self.state_size = 128  # Size of user state vector
        self.action_size = n_courses  # Number of possible courses to recommend
        self.dqn = DQNModel(self.state_size, self.action_size)
        self.target_dqn = DQNModel(self.state_size, self.action_size)
        self.target_dqn.load_state_dict(self.dqn.state_dict())
        
        self.optimizer = optim.Adam(self.dqn.parameters())
        self.replay_buffer = ReplayBuffer(10000)
        self.batch_size = 32
        self.gamma = 0.99  # Discount factor
        self.epsilon = 0.1  # Exploration rate
        
        # Track user states and interactions
        self.user_states = defaultdict(lambda: torch.zeros(self.state_size))
        self.user_history = defaultdict(list)
        
    def get_user_state(self, user_id: int) -> torch.Tensor:
        """Create user state vector from their history and characteristics"""
        # Get user's recent interactions
        recent_interactions = self.user_history[user_id][-10:]  # Last 10 interactions
        
        # Get user profile data from Redis
        user_data = self.redis_client.get(f"user:{user_id}")
        if user_data:
            user_data = json.loads(user_data)
        else:
            user_data = {}
            
        # Create state vector components
        state = torch.zeros(self.state_size)
        
        # Encode user profile information
        if user_data.get('preferences'):
            state[0:10] = torch.tensor(self._encode_preferences(user_data['preferences']))
            
        # Encode recent interaction history
        if recent_interactions:
            interaction_encoding = self._encode_interactions(recent_interactions)
            state[10:30] = torch.tensor(interaction_encoding)
            
        # Encode time-based features
        time_features = self._encode_time_features(user_data.get('last_active'))
        state[30:40] = torch.tensor(time_features)
        
        return state
        
    def select_action(self, user_id: int, state: torch.Tensor) -> List[Dict]:
        """Select courses to recommend using epsilon-greedy strategy"""
        if random.random() < self.epsilon:
            # Exploration: use content/collaborative recommendations
            if random.random() < 0.5:
                recommendations = self.content_recommender.get_recommendations(user_id)
            else:
                recommendations = self.collaborative_recommender.get_recommendations(user_id)
        else:
            # Exploitation: use DQN
            with torch.no_grad():
                q_values = self.dqn(state)
                # Get top k course indices
                top_k = 5
                top_indices = q_values.topk(top_k).indices.numpy()
                
                # Convert to course recommendations
                recommendations = [
                    self._get_course_info(idx) for idx in top_indices
                ]
        
        return recommendations
        
    def record_interaction(self, 
                          user_id: int, 
                          course_id: int, 
                          interaction_type: str,
                          timestamp: datetime = None):
        """Record user interaction and update the model"""
        if timestamp is None:
            timestamp = datetime.now()
            
        # Calculate reward based on interaction type
        reward = self._calculate_reward(interaction_type)
        
        # Get states
        current_state = self.get_user_state(user_id)
        
        # Record interaction
        self.user_history[user_id].append({
            'course_id': course_id,
            'interaction_type': interaction_type,
            'timestamp': timestamp,
            'reward': reward
        })
        
        # Update user state
        next_state = self.get_user_state(user_id)
        
        # Store experience in replay buffer
        self.replay_buffer.push(
            current_state,
            course_id,
            reward,
            next_state
        )
        
        # Perform learning if we have enough samples
        if len(self.replay_buffer) >= self.batch_size:
            self._update_model()
            
    def _calculate_reward(self, interaction_type: str) -> float:
        """Calculate reward based on interaction type"""
        reward_map = {
            'view': 0.1,
            'click': 0.5,
            'enroll': 2.0,
            'complete': 5.0,
            'rate_5': 3.0,
            'rate_4': 2.0,
            'rate_3': 1.0,
            'rate_2': -1.0,
            'rate_1': -2.0,
            'dropout': -1.0
        }
        return reward_map.get(interaction_type, 0.0)
        
    def _update_model(self):
        """Perform one step of model update using replay buffer"""
        # Sample from replay buffer
        batch = self.replay_buffer.sample(self.batch_size)
        states, actions, rewards, next_states = zip(*batch)
        
        # Convert to tensors
        states = torch.stack(states)
        actions = torch.tensor(actions)
        rewards = torch.tensor(rewards)
        next_states = torch.stack(next_states)
        
        # Compute current Q values
        current_q_values = self.dqn(states).gather(1, actions.unsqueeze(1))
        
        # Compute next Q values using target network
        with torch.no_grad():
            next_q_values = self.target_dqn(next_states).max(1)[0]
            
        # Compute expected Q values
        expected_q_values = rewards + (self.gamma * next_q_values)
        
        # Compute loss and update model
        loss = nn.MSELoss()(current_q_values.squeeze(), expected_q_values)
        
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        # Periodically update target network
        if random.random() < 0.01:  # 1% chance each update
            self.target_dqn.load_state_dict(self.dqn.state_dict())
            
    def _encode_preferences(self, preferences: Dict) -> List[float]:
        """Encode user preferences into a vector"""
        # Example encoding - adjust based on your preference structure
        encoded = np.zeros(10)
        if 'preferred_difficulty' in preferences:
            difficulty_map = {'BEGINNER': 0, 'INTERMEDIATE': 1, 'ADVANCED': 2}
            encoded[0] = difficulty_map.get(preferences['preferred_difficulty'], 0)
        if 'preferred_topics' in preferences:
            # Encode topics as multi-hot encoding
            topic_map = {'PROGRAMMING': 0, 'DESIGN': 1, 'BUSINESS': 2, 'DATA': 3}
            for topic in preferences['preferred_topics']:
                if topic in topic_map:
                    encoded[1 + topic_map[topic]] = 1
        return encoded.tolist()
        
    def _encode_interactions(self, interactions: List[Dict]) -> List[float]:
        """Encode recent interactions into a vector"""
        encoded = np.zeros(20)
        for i, interaction in enumerate(interactions[-20:]):  # Last 20 interactions
            encoded[i] = self._calculate_reward(interaction['interaction_type'])
        return encoded.tolist()
        
    def _encode_time_features(self, last_active: datetime) -> List[float]:
        """Encode time-based features"""
        if not last_active:
            return [0] * 10
            
        now = datetime.now()
        time_diff = now - last_active
        
        encoded = np.zeros(10)
        # Hours since last active
        encoded[0] = min(time_diff.total_seconds() / 3600, 24) / 24
        # Day of week
        encoded[1] = now.weekday() / 6
        # Hour of day
        encoded[2] = now.hour / 23
        
        return encoded.tolist()
        
    def _get_course_info(self, course_idx: int) -> Dict:
        """Get course information from index"""
        course = self.content_recommender.courses_df.iloc[course_idx]
        return {
            'id': int(course['id']),
            'name': str(course['name']),
            'course_type': str(course['course_type']),
            'difficulty': str(course['difficulty']),
            'price': float(course['price'])
        }