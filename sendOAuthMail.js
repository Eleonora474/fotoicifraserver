
require('dotenv').config()
const nodemailer = require('nodemailer')
const htmlToText = require('nodemailer-html-to-text').htmlToText

const { google } = require('googleapis')

const CLIENT_ID = process.env.OAuth_CLIENT_ID

const CLIENT_SECRET = process.env.OAuth_CLIENT_SECRET

const REDIRECT_URI = process.env.OAuth_REDIRECT_URI

const REFRESH_TOKEN = process.env.OAuth_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


async function sendOAuthMail(user,options ) {

  try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    })
    // transporter.use('compile', htmlToText())
    const result = await transport.sendMail(options)
    transport.close()
    return result
  } catch (error) {
    return error
  }
}

module.exports = sendOAuthMail
