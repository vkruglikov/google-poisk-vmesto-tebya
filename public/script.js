function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).catch(console.log);
}

function App() {
    this.dom = {
        input: document.getElementById('input'),
        form: document.getElementById('form'),
        buttonSubmit: document.getElementById('submit'),
        mouse: document.getElementById('mouse'),
        linkResult: document.getElementById('link-result'),
        linkResultCopy: document.getElementById('link-result-copy'),
    };
    this.isPlayMode = false;
    this.dom.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.onSubmit();
    })
    this.play(
        (new URLSearchParams(window.location.search)).get('q')
    );

    if (!this.isPlayMode) {
        this.dom.input.focus();

        this.dom.linkResultCopy.addEventListener('click', (e) => {
            e.preventDefault();
            copyTextToClipboard(e.target.getAttribute('href'));
        });
    }
}
App.prototype = {
    onSubmit() {
        if (this.isPlayMode) return;

        const value = (this.dom.input.value || '').trim();
        if (!value) return;
        this.dom.linkResult.classList.remove('hidden');

        for (let link of this.dom.linkResult.querySelectorAll('a')) {
            link.setAttribute('href', encodeURI("https://google-poisk-vmesto-tebya.ru/?q=" + this.dom.input.value));
        }
    },
    play(str) {
        if (!str) return;
        this.isPlayMode = true;

        document.body.classList.add('play-mode');

        this.dom.input.setAttribute('disabled', 'disabled');
        this.dom.input.value = '';

        this.playFocusToInput(() => {
            this.delay(() => {
                this.playInputText(
                    str,
                    () => {
                        this.delay(() =>
                            this.playSubmit(() => {
                                this.delay(() => {
                                    window.location.href = encodeURI("https://google.ru/search?q=" + str);
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
        }, 1000);
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
        }, 150);
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
        setTimeout(() => callback(), time || 500);
    }
}

window.GoogleApp = new App();