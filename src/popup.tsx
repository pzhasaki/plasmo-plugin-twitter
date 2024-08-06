import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useState } from "react"
import { userAuthorizeUrl } from "~api/twitter";

function IndexPopup() {
  const [oauthConfig, setOauthConfig] = useState<{
    oauth_token?: string;
    oauth_token_secret?: string;
  }>({});

  const getAppOauth = async () => {
    const res = await sendToBackground({
      name: "twitter" as unknown as never,
      body: {
        type: 'ouath'
      }
    })
    // 更新 oauth
    if (res) {
      setOauthConfig(res);
    }
  }

  const xLogin = () => {
    const redirectUri = chrome.identity.getRedirectURL('callback');
    const authUrl = `${userAuthorizeUrl}?oauth_token=${oauthConfig.oauth_token}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      (redirectUrl) => {
        console.log('@redirectUrl', redirectUrl);
        if (chrome.runtime.lastError) {
          console.log('@error', chrome.runtime.lastError)
          return;
        }
        // 处理重定向 URL
        const params = new URL(redirectUrl).searchParams;
        
      }
    );
  }

  // 获取 app oauth 
  useEffect(() => {
    getAppOauth();
  }, []);

  return (
    <div
      style={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>
        oauth_token: {oauthConfig.oauth_token}
      </h1>
      <h1>
        oauth_token_secret: {oauthConfig.oauth_token_secret}
      </h1>
      <button onClick={xLogin}>login</button>
    </div>
  )
}

export default IndexPopup
