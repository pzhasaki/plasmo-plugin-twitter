import { useEffect, useState } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import "./style.css"
import { userAuthorizeUrl } from "~api/twitter";

function IndexNewtab() {
  const [oauthConfig, setOauthConfig] = useState<{
    oauth_token?: string;
    oauth_token_secret?: string;
  }>({});
  const [data, setData] = useState("");

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
    window.location.href = `${userAuthorizeUrl}?oauth_token=${oauthConfig.oauth_token}`;
    return;
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.log('@error', chrome.runtime.lastError)
          return;
        }
        const params = new URL(redirectUrl).searchParams;
        console.log('@redirectUrl', redirectUrl);
      }
    );
  }

  // 获取 app oauth 
  useEffect(() => {
    getAppOauth();
  }, []);

  return (
    <div
      className="new-tab"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column"
      }}>
      <h1>
        oauth_token: {oauthConfig.oauth_token}
        oauth_token_secret: {oauthConfig.oauth_token_secret}
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <button onClick={xLogin}>login</button>
    </div>
  )
}

export default IndexNewtab
