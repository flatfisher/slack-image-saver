# slack-image-saver
slack-image-saver saves media uploaded on Slack to Google Photos.

## Prerequirement
- [Slack API](https://api.slack.com)
    - api token
- [Google Photos API](https://developers.google.com/photos)
    - authorization_code
    - album_id
- [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/OAuth2)
    - client_id
    - client_secret
    - redirect_uri
    - scope
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
$ firebase functions:config:set slack.channel=""
$ firebase functions:config:set google.refresh_token=""
$ firebase functions:config:set google.client_id=""
$ firebase functions:config:set google.client_secret=""
$ firebase functions:config:set photos.album_id=""
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

### Creating and Configuring Cron Jobs

```
$ gcloud beta scheduler jobs create pubsub Saver --schedule "0 */3 * * *" --time-zone Asia/Tokyo --description "Upload photo to GooglePhotos" --topic slack-to-googlephotos --message-body "{"count":1}"
```

### Publish a pub/sub's topic

```
$ gcloud pubsub topics publish slack-to-googlephotos --message "{"count":1}"
```

### Delete Environment

```
$ firebase functions:config:unset $ENVIRONMENT_VARIABLE
```
