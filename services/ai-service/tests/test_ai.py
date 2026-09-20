import unittest
from app.models.matcher import semantic_matcher
from app.routers.ai import (
    classify_challenge, ClassifyRequest, 
    calculate_priority_score, PriorityScoreRequest, 
    check_duplicate, DuplicateRequest
)

class TestAIService(unittest.TestCase):
    def test_semantic_matcher(self):
        sim = semantic_matcher.cosine_similarity(
            "broken water pipe and sewage leakage in streets",
            "severely broken water pipeline and contaminated drinking tap water"
        )
        self.assertGreater(sim, 0.3)

    def test_classify_challenge(self):
        res = classify_challenge(ClassifyRequest(description="A deep pothole is causing accidents on highway"))
        self.assertEqual(res.domain, "Urban Infrastructure")

    def test_priority_scoring(self):
        res = calculate_priority_score(PriorityScoreRequest(
            description="Dangerous electric wire hazard after flood near school",
            severity="high",
            people_affected=300
        ))
        self.assertEqual(res.priority, "high")
        self.assertGreaterEqual(res.score, 0.7)

if __name__ == "__main__":
    unittest.main()
