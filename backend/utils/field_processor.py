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
        self.vector_size = 100
        self.window = 5
        self.min_count = 1
        self.workers = 4
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
        - Remove stop words
        - Lemmatize
        - Tokenize
        """
        # lowercase and remove special characters
        description = re.sub(r'[^a-zA-Z0-9\s]', '', description.lower())

        # tokenize
        tokens = word_tokenize(description)

        # remove stop words and lemmatize
        lemmatized_tokens = []
        for token in tokens:
            if (len(token) > 1 and 
                token not in self.stop_words and
                token.isalpha()
            ):
                lemmatized_tokens.append(self.lemmatizer.lemmatize(token))

        return ' '.join(lemmatized_tokens)

    def preprocess_skills(self, skills_string):
        """
        Preprocess a comma-separated skills string
        - Split comma-separated skills
        - Lemmatize
        - Preserve multi-word skills
        """ 
        # split and clean skills
        skills = [s.strip().lower() for s in skills_string.split(',')]

        processed_skills = []
        for skill in skills:
            # tokenize multi-word skills
            tokens = word_tokenize(skill)

            # lemmatize each token
            lemmatized_skill = [self.lemmatizer.lemmatize(token) for token in tokens]

            # rejoin multi-word skills
            processed_skill = ' '.join(lemmatized_skill)

            if processed_skill:
                processed_skills.append(processed_skill)

        return processed_skills
    
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
            else: # default to description preprocessing
                preprocessed_df[column] = preprocessed_df[column].apply(self.preprocess_description)

        return preprocessed_df

    def execute_field_processing_pipeline(
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
        
        # preprocess text fields
        if text_columns:
            df = self.preprocess_text_fields(df, text_columns)

        return df
    
    def train_text_embeddings(
            self,
            df,
            name_col='name',
            description_col='description',
            skills_col='skills',
            preprocessed=True
        ):
        """ Train word embeddings on text fields """
        # prepare sentences for Word2Vec
        if preprocessed:
            name_sentences = [
                word_tokenize(name)
                for name in df[name_col] if isinstance(name, str) 
            ]

            description_sentences = [
                word_tokenize(description)
                for description in df[description_col] if isinstance(description, str)
            ]

            skill_sentences = [
                skill.split()
                for skills in df[skills_col]
                for skill in skills if isinstance(skills, list)
            ]
        else:
            name_sentences = [
                word_tokenize(self.preprocess_name(name))
                for name in df[name_col] if name
            ]

            description_sentences = [
                word_tokenize(self.preprocess_description(description))
                for description in df[description_col] if description
            ]

            skill_sentences = [
                skill 
                for skills in df[skills_col].apply(self.preprocess_skills) 
                for skill in skills
            ]

        # train Word2Vec models
        name_model = Word2Vec(
            sentences=name_sentences,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            workers=self.workers
        )

        description_model = Word2Vec(
            sentences=description_sentences,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            workers=self.workers
        )

        skill_model = Word2Vec(
            sentences=skill_sentences,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            workers=self.workers
        )

        # store embeddings
        self.name_embeddings = name_model.wv
        self.description_embeddings = description_model.wv
        self.skill_embeddings = skill_model.wv

    def find_similar_words(self, word, embedding_type='skill', top_n=5):
        """ Find similar words to a given word """
        try:
            if embedding_type == 'name':
                embeddings = self.name_embeddings
            elif embedding_type == 'description':
                embeddings = self.description_embeddings
            elif embedding_type == 'skill':
                embeddings = self.skill_embeddings
            else:
                raise ValueError("Invalid embedding type. Choose from 'name', 'description', or 'skill'")

            return embeddings.most_similar(word, topn=top_n)
        except KeyError:
            return []
    