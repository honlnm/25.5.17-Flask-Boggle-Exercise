from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS']=['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
        
    def test_home_page(self):
        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIn('high-score', session)

    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["C", "A", "T", "T", "T"],
                                    ["C", "A", "T", "T", "T"],
                                    ["C", "A", "T", "T", "T"],
                                    ["C", "A", "T", "T", "T"],
                                    ["C", "A", "T", "T", "T"]]
        response = self.client.get('/check-word?currentGuess=cat')
        self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        self.client.get('/')
        response = self.client.get('/check-word?currentGuess=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')    

    def test_nonsense_word(self):
        self.client.get('/')
        response = self.client.get('/check-word?currentGuess=skalgheaagofdg')
        self.assertEqual(response.json['result'], 'not-word')    
