import * as functions from 'firebase-functions';

exports.updateWeather = functions.pubsub.topic('slack-to-googlephotos').onPublish(async (_) => {
    console.log('PubSub!')
});