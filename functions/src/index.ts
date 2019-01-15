import * as functions from 'firebase-functions'
import * as request from 'request'

interface File {
    id: string,
    url_private: string,
    filetype: string
}
interface Channel {
    files: Array<File>
}

function doRequest(options: any) {
    return new Promise((resolve, reject) => {
        request(options, ((error: any, res: request.Response, body: any) => {
            if (!error && res.statusCode === 200) {
                resolve(body)
            } else {
                reject(error)
            }
        }))
    })
}

exports.saveSlackPhotos = functions.pubsub.topic('slack-to-googlephotos').onPublish(async (_) => {
    // Environment Variables
    const SLACK_TOKEN = `${functions.config().slack.token}`
    const SLACK_CHANNEL = `${functions.config().slack.channel}`

    //README: Get slack files
    const getSlackPhotos = {
        url: `https://slack.com/api/files.list?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&count=5&pretty=1`,
        method: "GET",
    }
    const slackResponse = await doRequest(getSlackPhotos).catch(err => console.error(err))
    const channel: Channel = <Channel>JSON.parse(<any>slackResponse)
    const file: File = channel.files[0]
    console.log(slackResponse)
    console.log(file.id)
    console.log(file.url_private)
    console.log(file.filetype)
})