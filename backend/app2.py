# Python
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('pingEvent')
def handle_ping_event(json):
    print('received ping: ' + str(json))
    emit('pongEvent', {'data': 'Got it: ' + json['data']})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)