import { useEffect, useState } from "react";

interface ResponseData {
  url : string
}

interface IOAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  scopes: string;
}

const oauthparams: IOAuthParams = {
  clientId: "",
  clientSecret: "",
  redirectUrl: "",
  scopes: "",
};

function OAuthCal() {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [oauthParams, setOauthParams] = useState(oauthparams);

  const getOAuthParams = (): any => {
    const clientId = process.env.REACT_APP_CLIENT_ID || "";
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET || "";
    const redirectUrl = process.env.REACT_APP_REDIRECT_URL || "";
    const scopes = process.env.REACT_APP_SCOPES || "";
    debugger;
    setOauthParams({
      clientId,
      clientSecret,
      redirectUrl,
      scopes,
    });
  };

  const handleOAuthRedirect = (): string => {
    // Define query parameters as variables

    const { clientId, redirectUrl, scopes } = oauthParams;

    const responseType = "code";
    const redirectUri = redirectUrl;
    const responseMode = "query";
    const scope = scopes;
    const state = "getOAuthToken";

    // Construct the authorization URL
    const authorizationUrl =
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=${responseType}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_mode=${responseMode}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;
  
    return authorizationUrl;
  };

  useEffect(() => {
    getOAuthParams();
  }, []);

  const handleClick = () => {
    // Set loading to true to show a loading indicator
    setLoading(true);

    const authUrl: string = handleOAuthRedirect();
    debugger;
    // Make the GET request
    fetch("https://localhost:7088/api/OAuth/getauthurl", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data: ResponseData) => {
        // Update the state with the response data
        // setResponse(data);
        debugger;
        console.log(data);
        setLoading(false);
        window.location.href = data["url"];
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Click to Fetch Data"}
      </button>
      {response && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default OAuthCal;
