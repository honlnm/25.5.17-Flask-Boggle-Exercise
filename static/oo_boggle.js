class BoggleGame {
    constructor() {
        $('#timer').text(60);
        $('#score').text(0);
        $('#high-score').text(0);
        $('#played').text(0);

        this.secs = $('#timer').text();

        $('input').attr('disabled', 'disabled');
        $('#guess_form').on("submit", this.handleGuess);
        $('#start').on("click", this.handleStartButton);
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
        --parseInt(this.secs);
        if (parseInt(this.secs) < 10) this.secs = "0" + this.secs;
        $('#timer').text(this.secs)
    }

    timerRundown() {
        let timesRun = 0;
        let timerStart = setInterval(async function () {
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
                    addMsg()
                    $('temp_msg').text(`New Record: ${$game_score}`)
                    rmvMsg()
                    $('#high-score').text($game_score)
                }
            }
            timer()
        }, 1000);
        timerStart
    }

    async handleGuess(evt) {
        evt.preventDefault();
        const $guess = $('#guess_input_box').val();
        const resp = await axios.get('/check-word', { params: { currentGuess: $guess } });
        if (resp.data.result === "not-on-board") {
            addMsg()
            $('#temp_msg').text(`The word '${$guess}' is not on the board`)
            rmvMsg()
        } else if (resp.data.result === "not-word") {
            addMsg()
            $('#temp_msg').text(`The word '${$guess}' does not exist`)
            rmvMsg()
        } else {
            addMsg()
            $('#temp_msg').text(`The word '${$guess}' has been found`)
            rmvMsg()
            let newScore = parseInt($("#score").text()) + $guess.length;
            $('#score').text(newScore)
        }
        $('#guess_input_box').val("")
    }

    async handleStartButton(evt) {
        evt.preventDefault();
        $('input').removeAttr('disabled');
        $('#start').attr('disabled', 'disabled');
        $('#score').text(0);
        this.secs = 60;
        this.timerRundown;
    }
}

new BoggleGame();