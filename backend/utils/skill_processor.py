# Skills from the database is comma delimited
# Skills are very diverse, almost no common skills between courses
# There is a need to tokenize them, make them more meaningful
# Example result from tokenization -> 'programming' & 'coding' -> 'program'

import nltk
from collections import defaultdict
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize

# Download required NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer

class SkillProcessor:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.skill_embeddings = None
        self.skill_vectors = {}
        self.similar_skills_cache = defaultdict(list)
        
    def preprocess_skills(self, skills_string):
        """Preprocess a comma-separated skills string"""
        if not skills_string or pd.isna(skills_string):
            return []
            
        # Split and clean skills
        skills = [s.strip().lower() for s in skills_string.split(',')]
        
        # Lemmatize each skill (convert variations to base form)
        skills = [self._process_skill(skill) for skill in skills]
        
        return [s for s in skills if s]  # Remove empty strings
        
    def _process_skill(self, skill):
        """Process individual skill with lemmatization and cleanup"""
        # Tokenize multi-word skills
        tokens = word_tokenize(skill)
        
        # Lemmatize each token
        lemmatized = [self.lemmatizer.lemmatize(token) for token in tokens]
        
        # Rejoin multi-word skills
        return ' '.join(lemmatized)
        
    def train_skill_embeddings(self, all_skills_lists):
        """Train Word2Vec model on skill sequences"""
        # Prepare sentences for Word2Vec (each skill list is a sentence)
        sentences = [skills.split() for skills in all_skills_lists if skills]
        
        # Train Word2Vec model
        model = Word2Vec(sentences=sentences, 
                        vector_size=100,  # Embedding dimension
                        window=5,         # Context window
                        min_count=1,      # Keep all skills
                        workers=4)        # Number of threads
        
        self.skill_embeddings = model.wv
        
    def get_skill_vector(self, skill):
        """Get vector representation of a skill"""
        if skill in self.skill_vectors:
            return self.skill_vectors[skill]
            
        try:
            return self.skill_embeddings[skill]
        except KeyError:
            return None
            
    def find_similar_skills(self, skill, top_n=5):
        """Find similar skills using trained embeddings"""
        if skill in self.similar_skills_cache:
            return self.similar_skills_cache[skill]
            
        try:
            similar_skills = self.skill_embeddings.most_similar(skill, topn=top_n)
            self.similar_skills_cache[skill] = similar_skills
            return similar_skills
        except KeyError:
            return []