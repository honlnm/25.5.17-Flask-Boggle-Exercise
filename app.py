from flask import Flask, render_template, redirect, request, session, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY']="safd1561Awa515a"
debug = DebugToolbarExtension(app)

@app.route("/")
def home_page():
    boggle_game = Boggle()
    new_board = boggle_game.make_board()
    session['board'] = new_board
    return render_template('index.html', board = new_board)

@app.route("/check-word", methods=["GET"])
def check_guess():
    guess = request.args['currentGuess']
    board = session['board']
    words = Boggle()
    result = words.check_valid_word(board, guess)
    return jsonify({'result': result})

@app.route("/score", methods=["GET"])
def store_score():
    score = request.args['score']
    

