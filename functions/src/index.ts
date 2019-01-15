import * as functions from 'firebase-functions';

exports.saveSlackPhotos = functions.pubsub.topic('slack-to-googlephotos').onPublish(async (_) => {
    console.log('PubSub!')
});