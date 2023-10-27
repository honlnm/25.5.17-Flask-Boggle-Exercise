class BoggleGame {
    constructor() {
        $('#timer').text(60);
        $('#score').text(0);
        $('#high-score').text(0);
        $('#played').text(0);

        this.secs = $('#timer').text();

        $('input').attr('disabled', 'disabled');
        $('#guess_form').on("submit", this.handleGuess.bind(this));
        $('#start').on("click", this.handleStartButton.bind(this));
    }

    addMsg() {
        const msg = $("<p id='temp_msg'></p>")
        $('#msg').append(msg)
    }

    rmvMsg() {
        setTimeout(function () {
            $('#temp_msg').remove()
        },
            3000
        )
    }

    async timer() {
        --this.secs;
        if (this.secs < 10) this.secs = "0" + this.secs;
        $('#timer').text(this.secs)
    }

    timerRundown() {
        let timesRun = 0;
        let timerStart = setInterval(async () => {
            timesRun += 1;
            if (timesRun === 60) {
                clearInterval(timerStart);
                $('#start').removeAttr('disabled');
                $('input').attr('disabled', 'disabled');
                const $game_score = $('#score').text()
                let $played = $('#played').text()
                const resp = await axios.get("/score", { params: { score: $game_score, played: $played } })
                $('#played').text(resp.data.played)
                if (parseInt(resp.data.score) <= parseInt($game_score)) {
                    this.addMsg()
                    $('temp_msg').text(`New Record: ${$game_score}`)
                    this.rmvMsg()
                    $('#high-score').text($game_score)
                }
            }
            this.timer()
        }, 1000);
        timerStart
    }

    async handleGuess(evt) {
        evt.preventDefault();
        const $guess = $('#guess_input_box').val();
        const resp = await axios.get('/check-word', { params: { currentGuess: $guess } });
        if (resp.data.result === "not-on-board") {
            this.ddMsg()
            $('#temp_msg').text(`The word '${$guess}' is not on the board`)
            this.rmvMsg()
        } else if (resp.data.result === "not-word") {
            this.addMsg()
            $('#temp_msg').text(`The word '${$guess}' does not exist`)
            this.rmvMsg()
        } else {
            let found = false
            $("#words-list li").each((id, elem) => {
                if (elem.innerText == $guess) {
                    found = true;
                }
            });
            if (found === true) {
                this.addMsg()
                $('#temp_msg').text(`The word '${$guess}' has already been found`)
                this.rmvMsg()
            } else {
                this.addMsg()
                $('#temp_msg').text(`The word '${$guess}' has been found`)
                this.rmvMsg()
                let newScore = parseInt($("#score").text()) + $guess.length;
                $('#score').text(newScore)
                $('<li>').appendTo('#words-list').text($guess)
            }
        }
        $('#guess_input_box').val("")
    }

    async handleStartButton(evt) {
        evt.preventDefault();
        $('#words-list').empty().text('Words Found:')
        const resp = await axios.get("/new-game")
        const board = resp.data.board
        console.log(board);
        $('table').empty()
        $('<tbody>').appendTo('table')
        for (let row in board) {
            $('<tr>').appendTo("table").attr("class", "row").attr("id", `row${row}`)
            let letters = board[row]
            console.log(letters)
            for (let i = 0; i < letters.length; i++) {
                let letter = letters[i]
                console.log(letter)
                $('<td>').appendTo(`#row${row}`).html(letter).attr("class", "column")
            }
        }
        $('input').removeAttr('disabled');
        $('#start').attr('disabled', 'disabled');
        $('#score').text(0);
        this.secs = 60;
        this.timerRundown();
    }
}

new BoggleGame();