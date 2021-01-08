from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle



class FlaskTests(TestCase):

    def setUp(self):

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client:
            resp = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'Score:', resp.data)
            self.assertIn(b'Seconds Left:', resp.data)

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["T", "E", "S", "T", "T"], 
                                 ["T", "E", "S", "T", "T"], 
                                 ["T", "E", "S", "T", "T"], 
                                 ["T", "E", "S", "T", "T"], 
                                 ["T", "E", "S", "T", "T"]]
        response = self.client.get('/check-word?word=test')
        self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/')
        response = self.client.get('/check-word?word=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')

    def test_non_english_word(self):
        """Test if word is an english word"""

        self.client.get('/')
        resp = self.client.get('/check-word?word=fghvhvhvgvjvgvj')
        self.assertEqual(resp.json['result'], 'not-word')
