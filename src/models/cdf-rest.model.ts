import { CdfAuthorizationModel } from './cdf-authorization.model';

export class CdfRestModel
{
	URL: string;
	Body: Object;
	AuthorizationModel: CdfAuthorizationModel = new CdfAuthorizationModel();

	constructor(url: string, body?: Object)
	{
		this.URL = url;

		if (body)
		{ 
			this.Body = body;
		}			
	}
}