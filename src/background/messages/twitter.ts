import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getAppAccessToken } from "~api/twitter";


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { type } = req.body;
  if(type === 'ouath') {
    const response = await getAppAccessToken() as { data: string; status: number };

    if(response.status === 200) {
      const data = new URLSearchParams(response.data);
      if(data.get('oauth_callback_confirmed')) {
        res.send({
          oauth_token: data.get('oauth_token'),
          oauth_token_secret: data.get('oauth_token_secret')
        })
      }
    }
    res.send(null)
  } else {
    res.send('hellow')
  } 


  
}

export default handler
