import { Observable } 						from 'rxjs/Rx';

import { CdfAuthenticationTokenModel } 		from '../models/cdf-authentication-token.model';
import { CdfDomainService } 				from './cdf-domain.service';

export class CdfTokenService 
{
	static SaveToken(url: string, tokenType: string, accessToken: string) : Observable<any>
	{
		return Observable.create(observer => 
		{			
			let domainRootUrl = CdfDomainService.GetDomainRootFromUrl(url);

			let tokenModel = new CdfAuthenticationTokenModel(
				{
					token_type: tokenType,
					access_token: accessToken,
					refresh_token: undefined,
					expires_in: undefined
				}
			);

			localStorage.setItem(domainRootUrl, JSON.stringify(tokenModel));

			observer.next(tokenModel);
			observer.complete();
        });
	};	
}