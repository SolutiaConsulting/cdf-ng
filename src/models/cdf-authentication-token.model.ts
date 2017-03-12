/*
BASED ON IAuthenticationDataContract
from https://webapi.cdf.cloud/api/token/generate-token
 */
export class CdfAuthenticationTokenModel
{
	token_type: string;
	access_token: string;
	refresh_token: string;
	expires_in: string;

	constructor(rawJson:any)
	{
		this.token_type = (rawJson.token_type) ? rawJson.token_type : '';
		this.access_token = (rawJson.access_token) ? rawJson.access_token : '';
		this.refresh_token = (rawJson.refresh_token) ? rawJson.refresh_token : '';
		this.expires_in =  (rawJson.expires_in) ? rawJson.expires_in : '';
	}
}