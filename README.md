# Qiscus Call Router Client

This library contains functionalities needed to create a call queue and routing (eg. for call center).

## Installation
```javascript
<script src="https://rawgit.com/qiscus/qiscus-call-router-client/master/dist/qiscus-call-router.min.js"></script>
```

## Initialization
```javascript
var router = new QiscusCallRouter('your-agent-api-key');
```

To obtain API key for each call agent, you need to make a request to Qiscus Call Router Server from your back-end application. It can be done, for example, while your agent login to your existing application.

## Back-end Integration

### Registering agent into call router

```
[POST] https://rtc-api.qiscus.com/router/auth/login_or_register
```

Headers:
- Authorization: For authorization header, you need Qiscus Call AppSecret. Please contact us to get this credential.

Parameters:
- userId - String (required)
- userName - String (required)
- userAvatar - String (optional)

Response:
- success - boolean
- data - object(userId, userName, userAvatar, apiKey)

### Flow
![Call Router Back-end Integration Flow](https://d1edrlpyc25xu0.cloudfront.net/kiwari-prod/image/upload/zsrHqwuCer/1523520896-call-router-back-end-integration-flow.png)

## Call SDK Integration
Call Router Client is also comes with built-in Call SDK integration, so you can automatically can receive a call from your customer.

```javascript
router.setCallCredential('your-call-app-id', 'your-call-app-token');
```

Please contact us to get this AppId and AppToken.

## Methods and Events
### `var router = new QiscusCallRouter('your-api-key')`
Initialization method.

### `router.setCallCredential('your-call-app-id', 'your-call-app-token')`
Set Call SDK credential.

### `router.enableVideo(boolean)`
Enable video for agent.

### `router.enableRecording(boolean)`
Enable call recording.

### `router.on('connect', function(user) {})`
This events will be fired when agent successfully connected to call router. It gives user object that contains `userId`, `userName`, and `userAvatar`.

### `router.on('call', function(roomId, agent) {})`
This events will be fired when there is incoming call for agent. It gives `roomId` for call session and agent object that contains `agentId`, `agentName`, and `agentAvatar`.

### `router.on('callLocalStream', function(mediastream) {})`
This events will be fired when successfully get local media (audio / video) from webcam or microphone. It gives `mediastream` object.

### `router.on('callRemoteStream', function(remoteId, mediastream) {})`
This events will be fired when successfully get remote media (audio / video) from call participant. It gives `remoteId` as identifier and `mediastream` object.

### `router.on('callClosed', function(remoteId) {})`
This events will be fired when call ended. It gives `remoteId` as identifier.

### `router.on('disconnect', function() {})`
This events will be fired when agent successfully disconnected from call router.

## Sample Application
To see how call router works, you can try our sample application [here](https://github.com/qiscus/qiscus-call-router-client/tree/master/sample). It contains simple UI and back-end integration sample.

## Demo
You also can try call router demo [here](https://qiscus-call-router.herokuapp.com).

### Demo Instruction
1. Open call router demo page.
2. Login using with any id and name.
3. Download our android call sdk sample application [here](https://www.dropbox.com/s/ha24p3jkfgd9n48/call-sample.apk?dl=0).
4. Choose **Queue and Routing** on android application.
5. Click **Call Agent**.
6. If you get incoming call notification on call router demo page, accept it.
7. Call established.

## Support
Contact us if you want to get further support.
