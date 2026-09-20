from typing import List, Dict, Tuple
import math
import re

# Fallback robust Cosine Similarity Vectorizer using TF-IDF when running in lightweight environments
class SemanticMatcher:
    def __init__(self):
        pass

    def tokenize(self, text: str) -> List[str]:
        return re.findall(r'\w+', text.lower())

    def get_term_frequencies(self, text: str) -> Dict[str, float]:
        tokens = self.tokenize(text)
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1.0
        total = len(tokens) or 1
        for k in tf:
            tf[k] /= total
        return tf

    def cosine_similarity(self, text1: str, text2: str) -> float:
        tf1 = self.get_term_frequencies(text1)
        tf2 = self.get_term_frequencies(text2)
        
        all_words = set(tf1.keys()).union(set(tf2.keys()))
        if not all_words:
            return 0.0
            
        dot = sum(tf1.get(w, 0.0) * tf2.get(w, 0.0) for w in all_words)
        norm1 = math.sqrt(sum(v * v for v in tf1.values()))
        norm2 = math.sqrt(sum(v * v for v in tf2.values()))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

semantic_matcher = SemanticMatcher()
