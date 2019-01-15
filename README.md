# slack-image-saver
slack-media-saver saves media uploaded on Slack to Google Photos.

## Prerequirement
- [Slack API](https://api.slack.com)
    - api token
- [Google Photos API](https://developers.google.com/photos)
- [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/OAuth2)
- [Google Cloud Scheduler](https://cloud.google.com/scheduler)
- [Google Cloud Pub/Sub](https://cloud.google.com/pubsub/docs/overview)
- [Firebase Functions](https://firebase.google.com/docs/functions/pubsub-events)
- [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)

## Installation

```
$ npm install --prefix functions/
```

## Lint

```
$ npm run lint --prefix functions/
```

## Set Environment

```
$ firebase functions:config:set slack.token=""
$ firebase deploy --only functions
$ firebase functions:config:get //Check current environment variables
```

## Build

```
$ npm run build --prefix functions/
```

## Deploy

```
$ npm run deploy
```

## Note

### Publish a pub/sub's topic

```
$ gcloud pubsub topics publish slack-to-googlephotos --message '{"count":1}'
```

### Delete Environment

```
$ firebase functions:config:unset $ENVIRONMENT_VARIABLE
```