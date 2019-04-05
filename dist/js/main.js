let socket = io();

var vm = new Vue({
    el: '#app',
    data: {
        onlinenum: 0,
        username: '',
        message: '',
        message_queue: [],
        dialog: true,
        showalert: false
    },
    methods: {
        sendMessage() {
            let message_group = {
                sender: this.username,
                msg_content: this.message,
                date: new Date().toLocaleString()
            }
            this.message_queue.push(message_group)

            socket.emit('chat-message', message_group)

            this.message = ''

        },
        checkUsername() {
            if (this.username !== '') {
                this.dialog = false;
            }
        }
    },
    mounted: function () {
        socket.on('chat-message', (msg) => this.message_queue.push(msg))
        socket.on('onlinenum', (msg) => {
            if (msg.flag === 1) {
                this.showalert = true
            }
            this.onlinenum = msg.onlinenum
            setTimeout(() => {
                this.showalert = false;
            }, 1000)
        })
    },
    watch: {
        // 真的蠢逼
        message_queue: function () {
            setTimeout(function () {
                window.scrollBy(0 ,100);
            }, 1000/60)
        }
    }
})