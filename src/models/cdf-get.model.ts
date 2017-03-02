import { CdfAuthorizationModel } from './cdf-authorization.model';

export class CdfGetModel
{
	URL: string;
	AuthorizationModel: CdfAuthorizationModel = new CdfAuthorizationModel();
	
	constructor(url: string)
	{
		this.URL = url;
	}
}