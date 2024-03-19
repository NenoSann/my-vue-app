"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var events_1 = require("events");
var Socketio = /** @class */ (function () {
    function Socketio(url, name, _id, avatar) {
        var _this = this;
        this.socket = (0, socket_io_client_1.io)(url, {
            auth: {
                username: name,
                _id: _id,
                avatar: avatar
            },
            autoConnect: false
        });
        this.usermap = new Map();
        this.message = new Map();
        this.friends = [];
        this.eventEmitter = new events_1.EventEmitter();
        this.socket.on('users', function (data) {
            // when server sends new usermap, we replace it
            _this.usermap = new Map(JSON.parse(data));
            _this.eventEmitter.emit('users', _this.usermap);
        });
        this.socket.on('user_connected', function (data) {
            _this.usermap.set(data.userid, data.userInfo);
            _this.eventEmitter.emit('user_connected', data.userid, data.userInfo);
        });
        this.socket.on('user_disconnect', function (userid) {
            _this.usermap.delete(userid);
            _this.eventEmitter.emit('user_disconnect', userid);
        });
        this.socket.on('private_message', function (data) {
            var _a;
            if (!_this.message.has(data.senderid)) {
                _this.message.set(data.senderid, []);
            }
            (_a = _this.message.get(data.senderid)) === null || _a === void 0 ? void 0 : _a.push(data);
            _this.eventEmitter.emit('private_message', data);
        });
    }
    Socketio.getInstance = function (url, name, _id, avatar) {
        if (!Socketio.instance) {
            Socketio.instance = new Socketio(url, name, _id, avatar);
        }
        return Socketio.instance;
    };
    Socketio.prototype.getSocket = function () {
        return this.socket;
    };
    Socketio.prototype.subscribe = function (event, callback) {
        this.eventEmitter.on(event, callback);
    };
    Socketio.prototype.unsubscribe = function (event, callback) {
        this.eventEmitter.off(event, callback);
    };
    return Socketio;
}());
exports = Socketio;
