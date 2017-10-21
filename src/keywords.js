const keyWords = ['speak', 'kill', 'reward', 'praise','fuck you'];

const responses = {
    'kill': [
        'I\'m afraid my master {user} won\'t let you do that',
        '..no you die! '
    ],
    'reward': [
        [
            '...thank you, buddy...',
            '...awesome....'
        ], [
            'Thank you.',
            'Whew.'
        ], [
            'Great!',
            'Right on!'
        ], [
            'I know, right?',
            'But of course!'
        ],
    ],
    'praise': [
        [
            '...thank you, m\'lord...',
            '...anytime....I am here to serve.'
        ], [
            'Thank you.',
            'Whew.'
        ], [
            'Great!',
            'Right on!'
        ], [
            'I know, right?',
            'But of course!'
        ]
    ],
    'hey': [
        'Heya {user}.',
        'Hi there {user}!',
        'Hello to you, {user}!'
    ],
    'hello': [
        'Heya {user}.',
        'Hi there {user}!',
        'Hello to you, {user}!',
    ],
    'fuck you': [
        'Hey f*** you too {user}!',
        'Go f*** yourself {user}!',
        'lol you don\'t scare me {user}'
    ]
};


module.exports = {
    keyWords,
    responses
};
