import { CdfAuthorizationModel } from './cdf-authorization.model';

export class CdfPostModel
{
	URL: string;
	Body: Object;
	AuthorizationModel: CdfAuthorizationModel = new CdfAuthorizationModel();

	constructor(url: string, body: Object)
	{
		this.URL = url;
		this.Body = body;
	}
}