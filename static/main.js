$(function() {
    let socket = io();

    let username = null;
    let $inputname = $('#name');
    let $loginBtn = $('#loginButton');
    let $msg = $('#chatinput');

    let setUsername = function() {
        username = $inputname.val().trim();

        if(username) {
            socket.emit('login', { username })
        }
    }


    $loginBtn.on('click', function(event) {
        console.log('click')
        setUsername();
    })

    $inputname.on('keyup', function(event) {
        if(event.keyCode === 13) {
            setUsername();
        }
    })


    socket.on('loginSuccess', (data) => {
        if(data === username) {
            beginChat();
        } else {
            console.log('match error');
        }
    })

    socket.on('receiveMessage', (data) => {
        showMsg(data);
    })

    let showMsg = function(data) {
        // 判断这个消息是否为自己发出，为了显示不同的样式
        if(data.username === username) {
            $("#content").append(`<p style='background: lightskyblue'><span>${data.username} : </span> ${data.message}</p>`);  
        } else {
            $("#content").append(`<p style='background: lightpink'><span>${data.username} : </span> ${data.message}</p>`);  
        }
    }


    let beginChat = function() {
        $('#loginBox').hide();
        $inputname.off('keyup');
        $loginBtn.off('click');

        $(`<p>欢迎你${username}</p>`).insertBefore($("#content")); 

        $('#chatbox').show();
    }


    let sendMessage = function() {
        let _msg = $msg.val();

        if(_msg) {
            socket.emit('sendMessage', {
                username,
                message: _msg
            })
        }
    }

    $msg.on('keyup', function(e) {
        if(e.keyCode == 13) {
            sendMessage();
            $msg.val('');
        }
    })


})