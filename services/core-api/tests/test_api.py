import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestCoreAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "online")

    def test_login_and_challenges(self):
        # Login with seeded user
        login_res = self.client.post("/auth/login", json={
            "email": "citizen@gmail.com",
            "password": "citizen123"
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["access_token"]
        self.assertTrue(token)

        # Fetch challenges
        ch_res = self.client.get("/challenges")
        self.assertEqual(ch_res.status_code, 200)
        challenges = ch_res.json()
        self.assertGreaterEqual(len(challenges), 1)

    def test_analytics_dashboard(self):
        res = self.client.get("/analytics/dashboard")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total", data)
        self.assertIn("resolution_rate", data)

if __name__ == "__main__":
    unittest.main()
