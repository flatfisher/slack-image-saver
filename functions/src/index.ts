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

interface Token {
    access_token: string
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

async function getAccessToken(response: any): Promise<String> {
    const token: Token = <Token>JSON.parse(response)
    return token.access_token
}

exports.saveSlackPhotos = functions.pubsub.topic('slack-to-googlephotos').onPublish(async (_) => {
    // Environment Variables
    const SLACK_TOKEN = `${functions.config().slack.token}`
    const SLACK_CHANNEL = `${functions.config().slack.channel}`

    // Get slack files
    const getSlackOption = {
        url: `https://slack.com/api/files.list?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&count=5&pretty=1`,
        method: "GET",
    }
    const slackResponse = await doRequest(getSlackOption).catch(err => console.error(`slackResponse: ${err}`))
    const file: File = <File>await getFile(slackResponse).catch(err => console.error(`file: ${err}`))

    // Get a photo
    const getPhotoOption = {
        url: `${file.url_private}`,
        headers: {
            'Authorization': `Bearer ${SLACK_TOKEN}`
        },
        encoding: null
    }
    const photo = await doRequest(getPhotoOption).catch(err => console.error(`photo: ${err}`)) //Buffer

    // Get an Access Token to use Google Photos API
    const CLIENT_ID = `${functions.config().google.client_id}`
    const CLIENT_SECRET = `${functions.config().google.client_secret}`
    const REFRESH_TOKEN = `${functions.config().google.refresh_token}`
    const getAcessToken = {
        url: 'https://www.googleapis.com/oauth2/v4/token',
        method: 'POST',
        form: {
            "client_id": `${CLIENT_ID}`,
            "client_secret": `${CLIENT_SECRET}`,
            "grant_type": "refresh_token",
            "refresh_token": `${REFRESH_TOKEN}`,
        }
    }

    const tokenResponse = await doRequest(getAcessToken).catch(err => console.error(`tokenResponse: ${err}`))
    const token:string = <string> await getAccessToken(tokenResponse).catch(err => console.error(`token: ${err}`))

    // Upload a photo to Google Photos
    const uploadPhoto = {
        url: 'https://photoslibrary.googleapis.com/v1/uploads',
        method: 'POST',
        headers: {
            'content-type': 'application/octet-stream',
            'Authorization': `Bearer ${token}`,
            'X-Goog-Upload-File-Name': `${file.id}`,
            'X-Goog-Upload-Protocol': 'raw',
        },
        body: photo,
    }

    // Response body is UploadToken
    const uploadToken = await doRequest(uploadPhoto).catch(err => console.error(`uploadToken: ${err}`))
    const ALBUM_ID =  `${functions.config().photos.album_id}`
    const uploadToAlbum = {
        method: "POST",
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        json: {
            "albumId": `${ALBUM_ID}`,
            "newMediaItems": [
                {
                    "description": "Upload from API",
                    "simpleMediaItem": {
                        "uploadToken": uploadToken
                    }
                }
            ]
        }
    }

    await doRequest(uploadToAlbum).catch(err => console.error(`uploadToAlbum: ${err}`))
})