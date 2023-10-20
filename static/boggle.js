$('input').attr('disabled', 'disabled');

//starting values:
$('#timer').text(10)
$('#score').text(0)
$('#high-score').text(0)

//msg------------------
$('#guess_form').submit(function (evt) {
    const $guess = $('#guess_input_box').val();
    $.ajax({
        type: "GET",
        url: '/check-word',
        data: { currentGuess: $guess },
        success: getResponse()
    });
    $('#guess_input_box').val("")
    evt.preventDefault();
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

//show message based on server response
async function getResponse() {
    const $guess = $('#guess_input_box').val()
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
        if (timesRun === 10) {
            clearInterval(timerStart);
            $('#start').removeAttr('disabled');
            $('input').attr('disabled', 'disabled');
            //score-------------------
            debugger
            const game_score = $('#score').text()
            const resp = await axios.get("/score", { params: { score: game_score } })
            if (parseInt(resp.data.score) <= parseInt(game_score)) {
                addMsg()
                $('temp_msg').text(`New Record: ${game_score}`)
                $('#high-score').text(game_score)
            }
            // $.ajax({
            // type: "GET",
            // url: '/score',
            // data: { score: game_score },
            // success: resp
            // });
        }
        timer()
    }, 1000);
    timerStart
}

$('#start').on("click", function () {
    $('input').removeAttr('disabled');
    $('#start').attr('disabled', 'disabled');
    $('#score').text(0)
    totalSeconds = 10;
    timerRundown()
})