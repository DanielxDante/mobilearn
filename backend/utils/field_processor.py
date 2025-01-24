# Skills from the database is comma delimited
# Skills are very diverse, almost no common skills between courses
# There is a need to tokenize, then lemmatize them to make them more meaningful
# Example result from tokenization -> 'programming' & 'coding' -> 'program'
# Embeddings from skills are used to find similar skills; generate relationship between skills

# Strategies to optimize textual data (differs from name, description, and skills):
# 1. Lemmatize words
# 2. Remove stop words and add importance using TF-IDF through frequency
# 3. Tokenize phrases
# 4. Use of word embeddings

import re
import nltk
import pandas as pd
from collections import defaultdict
from gensim.models import Word2Vec
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

class FieldProcessor:
    def __init__(self):
        # Download required NLTK data
        nltk.download('punkt')
        nltk.download('averaged_perceptron_tagger')
        nltk.download('wordnet')

        # Initialize lemmatizer
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

        # embedding models
        self.name_embeddings = None
        self.description_embeddings = None
        self.skill_embeddings = None

        # scalers and encoders
        self.numerical_scaler = None
        self.categorical_encoder = None
    
    def scale_numerical_fields(self, df, columns):
        """ Scale numerical fields using StandardScaler """
        # create scaler
        scaler = StandardScaler()

        # fit and transform data
        scaled_data = scaler.fit_transform(df[columns])
        
        # create new dataframe with scaled data
        scaled_df = df.copy()
        scaled_df[columns] = scaled_data

        # store scaler for inverse transform
        self.numerical_scaler = scaler

        return scaled_df
    
    def encode_categorical_fields(self, df, columns):
        """ Encode categorical fields using OneHotEncoder """
        # create one-hot encoder
        encoder = OneHotEncoder(
            sparse=False,
            handle_unknown='ignore'
        )

        # fit and transform data
        encoded_data = encoder.fit_transform(df[columns])

        # get feature names
        feature_names = encoder.get_feature_names_out(columns)

        # create new dataframe with encoded data
        encoded_df = df.copy()
        encoded_df.drop(columns=columns, inplace=True)

        # add one-hot encoded columns
        encoded_df = pd.concat([
            encoded_df,
            pd.DataFrame(
                encoded_data,
                columns=feature_names
            )
        ], axis=1)

        # store encoder for transform
        self.categorical_encoder = encoder

        return encoded_df
    
    def preprocess_name(self, name):
        """ 
        Preprocess course names
        - Light preprocessing
        - Keep technical terms
        """
        # lowercase and remove special characters
        name = re.sub(r'[^a-zA-Z0-9\s]', '', name.lower())

        # tokenize
        tokens = word_tokenize(name)

        # lemmatize but keep technical terms
        lemmatized_tokens = [
            self.lemmatizer.lemmatize(token)
            for token in tokens
            if len(token) > 1 # remove very short tokens
        ]

        return ' '.join(lemmatized_tokens)
    
    def preprocess_description(self, description):
        """ 
        Preprocess course descriptions
        - Light preprocessing
        - Remove stop words
        - Lemmatize words
        """
        # lowercase and remove special characters
        description = re.sub(r'[^a-zA-Z0-9\s]', '', description.lower())

        # tokenize
        tokens = word_tokenize(description)

        # remove stop words and lemmatize
        lemmatized_tokens = [
            self.lemmatizer.lemmatize(token)
            for token in tokens
            if token not in self.stop_words
        ]

        return ' '.join(lemmatized_tokens)
    
    def preprocess_text_fields(self, df, columns):
        """ Preprocess text fields """
        preprocessed_df = df.copy()

        for column in columns:
            if 'name' in column.lower():
                preprocessed_df[column] = preprocessed_df[column].apply(self.preprocess_name)
            elif 'description' in column.lower():
                preprocessed_df[column] = preprocessed_df[column].apply(self.preprocess_description)
            elif 'skills' in column.lower():
                preprocessed_df[column] = preprocessed_df[column].apply(self.preprocess_skills)
            else:
                preprocessed_df[column] = preprocessed_df[column].apply(self.preprocess_description)

        return preprocessed_df

    def create_preprocessing_pipeline(
        self,
        df,
        numerical_columns=None,
        categorical_columns=None,
        text_columns=None
    ):
        """ Create a preprocessing pipeline for all fields """
        # scale numerical fields
        if numerical_columns:
            df = self.scale_numerical_fields(df, numerical_columns)

        # encode categorical fields
        if categorical_columns:
            df = self.encode_categorical_fields(df, categorical_columns)

        return df
        
    # def preprocess_skills(self, skills_string):
    #     """Preprocess a comma-separated skills string"""
    #     if not skills_string or pd.isna(skills_string):
    #         return []
            
    #     # Split and clean skills
    #     skills = [s.strip().lower() for s in skills_string.split(',')]
        
    #     # Lemmatize each skill (convert variations to base form)
    #     skills = [self._process_skill(skill) for skill in skills]
        
    #     return [s for s in skills if s]  # Remove empty strings
        
    # def _process_skill(self, skill):
    #     """Process individual skill with lemmatization and cleanup"""
    #     # Tokenize multi-word skills
    #     tokens = word_tokenize(skill)
        
    #     # Lemmatize each token
    #     lemmatized = [self.lemmatizer.lemmatize(token) for token in tokens]
        
    #     # Rejoin multi-word skills
    #     return ' '.join(lemmatized)
        
    # def train_skill_embeddings(self, all_skills_lists):
    #     """Train Word2Vec model on skill sequences"""
    #     # Prepare sentences for Word2Vec (each skill list is a sentence)
    #     sentences = [skills.split() for skills in all_skills_lists if skills]
        
    #     # Train Word2Vec model
    #     model = Word2Vec(sentences=sentences, 
    #                     vector_size=100,  # Embedding dimension
    #                     window=5,         # Context window
    #                     min_count=1,      # Keep all skills
    #                     workers=4)        # Number of threads
        
    #     self.skill_embeddings = model.wv
        
    # def get_skill_vector(self, skill):
    #     """Get vector representation of a skill"""
    #     if skill in self.skill_vectors:
    #         return self.skill_vectors[skill]
            
    #     try:
    #         return self.skill_embeddings[skill]
    #     except KeyError:
    #         return None
            
    # def find_similar_skills(self, skill, top_n=5):
    #     """Find similar skills using trained embeddings"""
    #     if skill in self.similar_skills_cache:
    #         return self.similar_skills_cache[skill]
            
    #     try:
    #         similar_skills = self.skill_embeddings.most_similar(skill, topn=top_n)
    #         self.similar_skills_cache[skill] = similar_skills
    #         return similar_skills
    #     except KeyError:
    #         return []