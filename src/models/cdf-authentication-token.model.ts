/*
BASED ON IAuthenticationDataContract
from https://webapi.cdf.cloud/api/token/generate-token
 */
export class CdfAuthenticationTokenModel
{
	TokenType: string;
	AccessToken: string;
	RefreshToken: string;
	ExpiresIn: string;

	constructor(rawJson:any)
	{
		this.TokenType = (rawJson.token_type) ? rawJson.token_type : undefined;
		this.AccessToken = (rawJson.access_token) ? rawJson.access_token : undefined;
		this.RefreshToken = (rawJson.refresh_token) ? rawJson.refresh_token : undefined;
		this.ExpiresIn =  (rawJson.expires_in) ? rawJson.expires_in : undefined;
	}
}