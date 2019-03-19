console.log("Listener Extension running");

window.browser = (function() {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

var cnv;
var commands = [];
var linkIndices = 1;
var scrollY = 0;
var newScroll = false;
var scrollY2 = 850;

function Commands(txt, command, link) {
    this.txt = txt;
    this.command = command;
    this.link = link;
    this.output = (this.txt !== this.command) ? this.command + " >> " + this.txt : this.txt;

    this.writeText = function(x, y) {
        text(this.output, x, y);
    }
}

function speechRecognition() {
    var speechRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;

    recognition.start();
    var index = 0;

    recognition.onresult = function() {
        //console.log(event.results[index][0].transcript);
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].command.includes(event.results[index][0].transcript)) {
                console.log('success');
                window.location.href = commands[i].link;
            }
        }
        index++;
    }
}

function setup() {
    cnv = createCanvas(400, 850);
    cnv.position(windowWidth - 420, 50);
    background('#8573bc');

    fill(255);
    textSize(22);

    var links = document.getElementsByTagName('a');

    for (linkElement of links) {
        let link = linkElement.href;
        let txt = linkElement.text;
        if (!/\S/.test(txt)) {continue;}
        let command = (txt.length > 20) ? "Link " + linkIndices++ : txt;
        let current = new Commands(txt, command, link);

        linkElement.style['background-color'] = '#9988cc';
        linkElement.style['color'] = 'white';
        //console.log(txt);

        commands.push(current);
    }

    speechRecognition();
    
    
}

function draw() {
    background('#8573bc');
    
    if (commands.length <= 21) {
        noLoop();
    }

    for (let i = 0; i < commands.length; i++) {
        let thisY = (i + 1) * 40 - scrollY;
        if (thisY > 0 && thisY <= 875) {
            commands[i].writeText(40, thisY);
        }

        if (i === commands.length - 1 && thisY === 850) {
            newScroll = true;
        }
        
        if (newScroll && i < 21) {
            thisY = (i + 1) * 40 + scrollY2;
            commands[i].writeText(40, thisY);
        }

    }

    if (newScroll) {
        scrollY2--;
        if (scrollY2 === 1) {
            newScroll = false;
            scrollY = 0;
            scrollY2 = 850;
        }
    }
    scrollY++;
}