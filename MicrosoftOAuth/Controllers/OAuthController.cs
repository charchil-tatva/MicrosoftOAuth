using Microsoft.AspNetCore.Mvc;
using MicrosoftOAuth.Constants;
using RestSharp;

namespace MicrosoftOAuth.Controllers;
[Route("api/[controller]")]
[ApiController]
public class OAuthController : ControllerBase
{
    [HttpGet("getauthurl")]
    public ActionResult GetAuthUrl()
    {
        return Ok(new {
            url = $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${OAuthConstant.CLIENT_ID}&response_type=code&redirect_uri=${OAuthConstant.REDIRECT_URL}&response_mode=query&scope=openid%20offline_access&state=12345"
        }) ;
    }


    [HttpGet("callback")]
    public async Task<ActionResult> Callback(string code, string state, string session_state)
    {
        if (!String.IsNullOrWhiteSpace(code))
        {
            RestClient restClient = new RestClient();
            RestRequest restRequest = new RestRequest("https://login.microsoftonline.com/common/oauth2/v2.0/token", Method.Post);

            restRequest.AddHeader("Content-Type", "application/x-www-form-urlencoded");

            restRequest.AddParameter("code", code);
            restRequest.AddParameter("grant_type", "authorization_code");
            restRequest.AddParameter("client_id", OAuthConstant.CLIENT_ID);
            restRequest.AddParameter("client_secret", OAuthConstant.CLIENT_SECRET);
            restRequest.AddParameter("scope", OAuthConstant.SCOPES);
            restRequest.AddParameter("redirect_uri", OAuthConstant.REDIRECT_URL);
            //restRequest.AddParameter("code_verifier", OAuthConstant.CODE_VERIFIER); // Include the code verifier
            //restRequest.AddParameter("code_challenge", OAuthConstant.CODE_CHALLENGE); // Include the code challenge
            //restRequest.AddParameter("code_challenge_method", "S256");

            RestResponse response = await restClient.ExecuteAsync(restRequest);

            Console.WriteLine(response.Content);

            return Redirect("http://localhost:3000");
        }
        else
        {
            return BadRequest("bad request");
        }
    }
}
