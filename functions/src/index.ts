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

async function getFile(response: any): Promise<File> {
    const channel: Channel = <Channel>JSON.parse(response)
    const file: File = channel.files[0]
    return file
}

exports.saveSlackPhotos = functions.pubsub.topic('slack-to-googlephotos').onPublish(async (_) => {
    // Environment Variables
    const SLACK_TOKEN = `${functions.config().slack.token}`
    const SLACK_CHANNEL = `${functions.config().slack.channel}`

    //README: Get slack files
    const getSlackOption = {
        url: `https://slack.com/api/files.list?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&count=5&pretty=1`,
        method: "GET",
    }
    const slackResponse = await doRequest(getSlackOption).catch(err => console.error(err))
    const file: File =  <File> await getFile(slackResponse).catch(err => console.error(err))

    //README: Get a photo
    const getPhotoOption = {
        url: `${file.url_private}`,
        headers: {
            'Authorization': `Bearer ${SLACK_TOKEN}`
        },
        encoding: null
    }
    const photo = await doRequest(getPhotoOption).catch(err => console.error(err)) //Buffer
})