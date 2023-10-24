$('input').attr('disabled', 'disabled');

//starting values:
$('#timer').text(60)
$('#score').text(0)
$('#high-score').text(0)
$('#played').text(0)


//msg------------------
$('#guess_form').submit(async function (evt) {
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
        //Score----------------
        let newScore = parseInt($("#score").text()) + $guess.length;
        $('#score').text(newScore)
    }
    $('#guess_input_box').val("")
});

function addMsg() {
    const msg = $("<p id='temp_msg'></p>")
    $('#msg').append(msg)
}

function rmvMsg() {
    setTimeout(function () {
        $('#temp_msg').remove()
    },
        3000
    )
}

//Timer----------------

function timer() {
    --totalSeconds
    if (totalSeconds < 10) totalSeconds = "0" + totalSeconds;
    $('#timer').text(totalSeconds)
}

function timerRundown() {
    timesRun = 0;
    let timerStart = setInterval(async function () {
        timesRun += 1;
        if (timesRun === 60) {
            clearInterval(timerStart);
            $('#start').removeAttr('disabled');
            $('input').attr('disabled', 'disabled');
            //score-------------------
            const $game_score = $('#score').text()
            let $played = $('#played').text()
            const resp = await axios.get("/score", { params: { score: $game_score, played: $played } })
            $('#played').text(resp.data.played)
            if (parseInt(resp.data.score) <= parseInt($game_score)) {
                addMsg()
                $('temp_msg').text(`New Record: ${$game_score}`)
                $('#high-score').text($game_score)
            }
        }
        timer()
    }, 1000);
    timerStart
}

$('#start').on("click", async function () {
    await fetch('/new-game');
    $('input').removeAttr('disabled');
    $('#start').attr('disabled', 'disabled');
    $('#score').text(0)
    totalSeconds = 60;
    timerRundown()
})