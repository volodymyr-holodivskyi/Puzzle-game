$(function () {
    let arr = $('.block').toArray()
    let check = true;
    let minutes;
    let seconds;
    let interval;
    let isStarted = false;
    let isLost = false;
    let positions = [
        '0px 0px',
        '480px 0px',
        '320px 0px',
        '160px 0px',
        '0px 480px',
        '480px 480px',
        '320px 480px',
        '160px 480px',
        '0px 320px',
        '480px 320px',
        '320px 320px',
        '160px 320px',
        '0px 160px',
        '480px 160px',
        '320px 160px',
        '160px 160px'
    ]
    shuffle(arr)
    for (let i = 0; i < arr.length; i++) {
        arr[i].style.backgroundPosition = `${positions[i]}`
    }
    $('.puzzle').sortable({
        connectWith: '.left, .right',
        containment: '.content',
        tolerance: 'touch',
        start: init
    })

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    function showModal(message, check) {
        $('.modal-container').css({
            backgroundColor: 'rgb(0 0 0 / 70%)',
            zIndex: 4
        })
        if (!check) {
            $('.checkModal').hide();
            $('.modalTimer').hide();
            $('.modal-text').css('width', '100%');
            $('.modal-btns').css('justify-content', 'center');
        } else {
            $('.checkModal').show();
            $('.modalTimer').show();
            $('.modal-text').css('width', '80%');
            $('.modal-btns').css('justify-content', 'space-between');
        }
        $('.modal').css({
            zIndex: 5,
            display: 'flex'
        })
        $('.modal-text').text(message)
    }
    function init() {
        if (!isStarted) {
            let time = new Date().getTime();
            let upTime = time + 1000 * 60 * 2;
            interval = setInterval(function () {
                currentTime = new Date();
                let dif = upTime - currentTime.getTime();
                minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((dif % (1000 * 60)) / 1000);
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                $('.timer').text(`${minutes}:${seconds}`);
                $('.modalTimer').text(`${minutes}:${seconds}`);
                if (dif < 1000) {
                    clearInterval(interval);
                    $('.timer').text(`00:00`);
                    showModal(`It's a pity, but you lost`, false);
                    $('.checkResult').prop('disabled', true)
                    return 0;
                }
            })

            $('.checkResult').prop('disabled', false)
            $('.start').prop('disabled', true)
            isStarted = true;
        }


    }
    $('.start').on('click', init)
    $('.checkResult').on('click', function () {
        showModal(`You still have time, you sure?`, true)
    })
    $('.newGame').on('click', function () {
        location.reload();
        isStarted = false;
        isLost = false;
        shuffle(arr)
        for (let i = 0; i < arr.length; i++) {
            arr[i].style.backgroundPosition = `${positions[i]}`
        }
        clearInterval(interval);
        $('.timer').text(`02:00`);
        $('.start').prop('disabled', false);
        $('.checkResult').prop('disabled', true)
    })
    $('.checkModal').on('click', function () {
        if ($('.right>.block').length == 0) {
            check = false;
        }
        for (let i = 0; i < $('.right>.block').length; i++) {
            if ($('.right>.block').eq(i).css('background-position') != positions[i]) {
                check = false;
                break;
            }
        }
        if (check) {
            showModal('Woohoo, well done, you did it!', false);
            $('.checkResult').prop('disabled', true);
            clearInterval(interval);
        }
        else {
            showModal(`It's a pity, but you lost`, false);
            $('.checkResult').prop('disabled', true);
            clearInterval(interval);
            isLost = true;
        }
    })
    $('.closeModal').on('click', function () {
        $('.modal-container').css({
            backgroundColor: '#fff',
            zIndex: -1
        })
        $('.modal').hide();
        if (isLost) {
            location.reload();
        }
    })
})