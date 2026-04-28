import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SOCKET_URL = 'http://192.168.10.35:5000';

class SocketService {
    socket = null;

    connect() {
        if (this.socket) return;
        
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    on(event, callback) {
        if (!this.socket) this.connect();
        this.socket.on(event, callback);
    }

    emit(event, data) {
        if (!this.socket) this.connect();
        this.socket.emit(event, data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;
