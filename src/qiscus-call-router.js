"use strict";

require('socket.io-client');
require('webrtc-adapter');

/* Qiscus Call Signaling Hub
 */

function QiscusCallRouter(apiKey) {
  var router = this;

  router.apiKey = apiKey;
  router.socketio = null;
  router.myId = null;
  router.myName = null;
  router.myAvatar = null;
  router.callAppId = null;
  router.callAppToken = null;
  router.qiscuscall = null;

  connectToSocket();

  function connectToSocket() {
    router.socketio = io('https://rtc-api.qiscus.com/queue-agent', {
      forceNew: false,
      query: { apiKey: router.apiKey }
    });

    router.socketio.on('onconnect', function(message) {
      router.myId = message.data.userId;
      router.myName = message.data.userName;
      router.myAvatar = message.data.userAvatar;
      router.onConnect({
        userId: router.myId,
        userName: router.myName,
        userAvatar: router.myAvatar,
      });
    });

    router.socketio.on('call', function(text) {
      var obj = JSON.parse(text);
      router.onCall(obj.room, {
        callerId: obj.caller.callerId,
        callerName: obj.caller.callerName,
        callerAvatar: obj.caller.callerAvatar,
      });
    });

    router.socketio.on('disconnect', function() {
      router.onDisconnect();
    });
  }
}

QiscusCallRouter.prototype.setCallCredential = function(callAppId, callAppToken) {
  var router = this;

  router.callAppId = callAppId;
  router.callAppToken = callAppToken;
}

QiscusCallRouter.prototype.startCall = function(room) {
  var router = this;

  var rem_id;
  router.qiscuscall = new QiscusCall(router.callAppId, router.callAppToken);
  router.qiscuscall.initCall(router.myId, room, false, true);
  router.qiscuscall.onLocalStream = function(stream) {
    router.onCallLocalStream(stream);
  };
  router.qiscuscall.onRemoteStream = function(id, stream) {
    rem_id = id;
    router.onCallRemoteStream(id, stream);
  };
  router.qiscuscall.onPeerClosed = function(id) {
    if (id == rem_id) {
      router.onCallClosed(id);
    }
  };
};

QiscusCallRouter.prototype.onConnect = function(user) {};

QiscusCallRouter.prototype.onCall = function(room, user) {};

QiscusCallRouter.prototype.onCallLocalStream = function(stream) {};

QiscusCallRouter.prototype.onCallRemoteStream = function(id, stream) {};

QiscusCallRouter.prototype.onCallClosed = function(id) {};

QiscusCallRouter.prototype.onDisconnect = function() {};
