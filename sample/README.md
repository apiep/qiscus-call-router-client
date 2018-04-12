# Qiscus Call Router Sample Application

This application contains a brief sample how to use Qiscus Call Router.

## Requirements
1. AppId
2. AppToken
3. AppSecret

Please contact us to get the credentials above.

## Running Sample Application
```
$ git clone https://github.com/qiscus/qiscus-call-router-client
$ cd sample
$ php -S localhost:7000
```

This sample application comes with sample credential so you can use it. Due to its limitation, we suggest that you use your own credetials.

Open your web browser, go to `http://localhost:7000`, login with any `UserId` and `Name`. To start a call, download our android call sdk sample application [here](https://www.dropbox.com/s/ha24p3jkfgd9n48/call-sample.apk?dl=0), and follow instructions below:
1. Install android application above.
2. Choose **Queue and Routing** on android application.
3. Click **Call Agent**.
4. If you get incoming call notification on call router demo page, accept it.
5. Call established.

### Flow
This sample application works based on following flow.
![Call Router Back-end Integration Flow](https://d1edrlpyc25xu0.cloudfront.net/kiwari-prod/image/upload/zsrHqwuCer/1523520896-call-router-back-end-integration-flow.png)

## Support
Contact us if you want to get further support.
