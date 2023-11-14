function App() {
    this.dom = {
        input: document.getElementById('input'),
        form: document.getElementById('form'),
        buttonSubmit: document.getElementById('submit'),
        mouse: document.getElementById('mouse'),
    };
    this.searchQuery = (new URLSearchParams(window.location.search)).get('q');

    this.dom.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.onSubmit();
    })

    this.play(this.searchQuery);
}
App.prototype = {
    onSubmit() {
        console.log('Отправлено')
    },
    play(str) {
        if (!str) return;
        this.dom.input.value = '';

        this.playFocusToInput(() => {
            this.delay(() => {
                this.playInputText(
                    str,
                    () => {
                        this.delay(() =>
                            this.playSubmit(() => {
                                this.delay(() => {
                                    window.location.href = 'https://google.com/search?q=' + this.searchQuery;
                                })
                            })
                        );
                    }
                );
            }, 1000)
        });
    },
    playFocusToInput(callback) {
        const position = this.dom.input.getBoundingClientRect();
        const offset = {
            left: 5,
            top: 15
        };

        this.dom.mouse.style.transform = 'translate(' + (position.left  + offset.left)+ 'px, ' + (position.top + offset.top) + 'px)';
        setTimeout(() => {
            callback();
        }, 2000);
    },
    playInputText(string, callback) {
        const letters = string.trim().split('');
        const intervalId = setInterval(() => {
            if (!letters.length) {
                clearInterval(intervalId);
                callback();
                return;
            }
            this.dom.input.value += letters.shift();
        }, 250);
    },
    playSubmit(callback) {
        const position = this.dom.buttonSubmit.getBoundingClientRect();
        const offset = {
            left: 20,
            top: 15
        };

        this.dom.mouse.style.transform = 'translate(' + (position.left  + offset.left)+ 'px, ' + (position.top + offset.top) + 'px)';
        setTimeout(() => {
            callback();
        }, 2000);
    },
    delay(callback, time) {
        setTimeout(() => callback(), time || 1000);
    }
}

window.GoogleApp = new App();