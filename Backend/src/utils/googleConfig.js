import {google} from 'googleapis';
import config  from '../config/config.js'

const auth2client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    'postmessage'
)

export { auth2client };