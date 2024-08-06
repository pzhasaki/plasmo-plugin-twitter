import axios from 'axios';
import { apiKey, apiSecret, pluginUrl } from "~config/secret";
import crypto from 'crypto';
import OAuth from "oauth-1.0a";

export const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
export const userAuthorizeUrl = 'https://api.twitter.com/oauth/authorize';
// 对于插件用客户端 call_back url 即可
const oauth_callback = 'oob';

const oauth = new OAuth({
  consumer: {
    key: apiKey,
    secret: apiSecret
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

const authHeader = oauth.toHeader(oauth.authorize({
  url: requestTokenUrl,
  method: 'POST',
  data: {
    oauth_callback
  }
}));

export const getAppAccessToken = async () => {
   return await axios.post(requestTokenUrl, null, {
    headers: {
      ...authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      oauth_callback
    }
  });
}
