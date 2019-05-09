const Midi = require("./midi.js")
const fs = require("fs")
const Pub = require("./pub.js")

var midi = new Midi();

function testMidi() {
    var s = "The time has come";

    for (c of s) {
        var i = midi.isUpper(c);
        var l = c.toLowerCase();
        var n = midi.noteForChar(l)
        if (!n) {
            n = 'rest'
        }
        console.log('note ' + c + ' ' + i + ' ' + n);
    }
}

function testSolace() {
    //var configData = fs.readFileSync("slack-midi/src/config.json")
    var configData = fs.readFileSync("config.json")
    var config = JSON.parse(configData)
    console.log("user " + config.username)
//    var solace = require('solclientjs').debug; // logging supported
    var solace = require('solclientjs')

    // Initialize factory with the most recent API defaults
    var factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);

    // enable logging to JavaScript console at WARN level
    // NOTICE: works only with ('solclientjs').debug
    solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

    // create the publisher, specifying the name of the subscription topic
    var pub = new Pub(solace, config);

    // publish message to Solace message router
    pub.connect()

    pub.session.on(solace.SessionEventCode.UP_NOTICE, async function (sessionEvent) {
        console.log('Solace is up.');

        //var msg = midi.shortMessage(2, midi.NOTE_ON, 60, 100)
        //var m = msg.toString()
        //pub.publish(msg, 'midi/1/2')
        //await sleep(500)
        //msg = midi.shortMessage(2, midi.NOTE_OFF, 60, 100)
        //pub.publish(msg, 'midi/1/2')

        testWords(pub);
        // pub.publish('foo bar baz', 'midi/1/2')
        // await sleep(5000)
        // pub.publish('sommerr', 'midi/1/1')
        // pub.publish('fooz', 'midi/1/2')

        // var midiString = midi.midiMessage('a', 1, 100, midi.NOTE_ON)
        // pub.publish(midiString, 'midi/1/2')
        // await sleep(500)
        // midiString = midi.midiMessage('a', 1, 100, midi.NOTE_OFF)
        // pub.publish(midiString, 'midi/1/2')
        // pub.exit()
        //process.exit(1)
    });
}

function testMap() {
    var map = {}

    for ( a of midi.charMap) {
        //console.log(a)
        let b = a[1]
        //console.log(b)
        let c = map[b]
        if (undefined === c) {
            //console.log('new ' + b)
            map[b] = 1
        } else {
            c++
            console.log(b + ': already seen it ' + c + ' times')
            map[b] = c
        }
    }

    map['a'] = 'b'
    var val = map['a']
    console.log(val)
    val = map['c']
    if (undefined === val) {
        console.log("yes, undefined.")
    }
}

async function testWords(pub) {
    var shortDur = 250
    var longDur = shortDur * 2
    var s = "using 4 has 5 speCiAl 9 chaRacters, 3 you need to";
    console.log("test words " + s)
    var channel = 0;
    var topic = 'midi/0/' + channel
    console.log('topic: ' + topic)

    try {
        for (char of s) {
            console.log('char: ' + char)
            if (char >= '0' && char <= '9') {
                topic = 'midi/0/' + char
                channel = parseInt(char)
                console.log('changed topic to ' + topic)
            } else {
                var note = midi.noteForChar(char)

                if (!note) {
                    console.log("rest.")
                    await sleep(longDur)
                } else {
                    var duration = midi.isUpper(char) ? longDur : shortDur
                    console.log('duration: ' + duration)
                    var midiString = midi.shortMessage(channel, midi.NOTE_ON, note, 100)
                    pub.publish(midiString, topic)
                    await sleep(duration)
                    midiString = midi.shortMessage(channel, midi.NOTE_OFF, note, 100)
                    pub.publish(midiString, topic)
                }
            }
        }
        console.log("test is done.")
    } catch (e) {
        console.log(e)
    }
}


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function testNum() {
    var s = "9 a";
    console.log(process.cwd())
    console.log("test words " + s)
    var channel = '0';
    var topic = 'midi/0/' + channel
    console.log('topic: ' + topic)

    for (char of s) {
        console.log('char: ' + char)
        if (char >= '0' && char <= '9') {
            topic = 'midi/0/' + char
            console.log('changed topic to ' + topic)
        } else {
            var note = midi.noteForChar(char)

            if (!note) {
                console.log("rest!")
                await sleep(1000)
            } else {
                var duration = midi.isUpper(char) ? 1000 : 500
                console.log('duration: ' + duration)
                var midiString = midi.midiMessage(channel, midi.NOTE_ON, note, 100)
                await sleep(duration)
                midiString = midi.midiMessage(channel, midi.NOTE_OFF, note, 100)
            }
        }
    }
    console.log("test is done.")
}
//testMidi()
testMap()
//testSolace()
//testNum()
