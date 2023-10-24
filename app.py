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
    times_played = int(request.args['played']) +1
    score = request.args['score']
    high_score = session['high-score']
    if int(score) > int(high_score):
        session['high-score'] = int(score)
        return jsonify({'score': score, 'played': times_played})
    return jsonify({'score': session['high-score'], 'played': times_played})

@app.route('/new-game')
def new_game():
    session.pop('board', default=None)
    boggle_game = Boggle()
    new_board = boggle_game.make_board()
    session['board'] = new_board
    session.modified = True
    return render_template('index.html', board = new_board)




