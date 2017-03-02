export class CdfAuthorizationModel
{
	TokenType: string = undefined;
	AuthorizationToken: string = undefined;
	HasAuthorizationToken: boolean = false;

	constructor(tokenType: string, authorizationToken: string)
	{
		if (tokenType && authorizationToken)
		{ 
			this.TokenType = (tokenType) ? tokenType : 'Bearer';
			this.AuthorizationToken = authorizationToken;
			this.HasAuthorizationToken = true;
		}	
	}

	GetAuthorization()
	{
		if (this.TokenType && this.AuthorizationToken)
		{
			return this.TokenType + ' ' + this.AuthorizationToken;
		}	
		
		return undefined;
	}
}