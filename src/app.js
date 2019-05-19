const botkit = require('botkit')
const fs = require('fs')
const Pub = require("./pub.js")
const Midi = require("./midi.js")

var configPath = "./config.json"

if (process.env.slack_midi_config_path) {
    configPath = process.env.slack_midi_config_path
}

var config = require(configPath)

var solace = require('solclientjs')
var controller = botkit.slackbot({ debug: true })
var midi = new Midi();

var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);
var pub = new Pub(solace, config);
pub.connect()

controller
    .spawn({ token: config.slackKey })
    .startRTM(function (err) {
        if (err) {
            throw new Error(err)
        }
    })

var shortDur = 200
var longDur = shortDur * 2

controller.hears(
    '.*', 'direct_message',
    async (bot, message) => {
        var channel = 0
        var topic = 'midi/0/' + channel
        //console.log('topic: ' + topic)

        try {
            for (char of message.text) {
                //console.log('char: ' + char)
                if (char >= '0' && char <= '9') {
                    topic = 'midi/0/' + char
                    //console.log('changed topic to ' + topic)
                    channel = parseInt(char)
                } else {
                    var note = midi.noteForChar(char)

                    if (!note) {
                        await sleep(shortDur)
                    } else {
                        var duration = midi.isUpper(char) ? longDur : shortDur
                        var midiString = midi.shortMessage(channel, midi.NOTE_ON, note, 100)
                        pub.publish(midiString, topic)
                        await sleep(duration)
                        midiString = midi.shortMessage(channel, midi.NOTE_OFF, note, 100)
                        pub.publish(midiString, topic)
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}



