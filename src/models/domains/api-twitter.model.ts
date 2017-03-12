import { Observable } 			from 'rxjs/Rx';
import 
{ 
	Http,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response
} 								from '@angular/http';

import { CdfConfigService }     from '../../services/index'; 
import { BaseDomainModel }      from './base-domain.model';


export class ApiTwitterModel extends BaseDomainModel
{
    readonly TWITTER_API_URL = 'https://api.twitter.com/1.1/';    

    http: Http;

    constructor () 
    { 
        super();

        this.http = super.InjectHttp();       
    }     

	//HTTP REQUEST	
	HttpRequest(requestOptions: RequestOptions): Observable<any>
    {
        let authorizationToken = (super.HasToken()) ? super.GetBearerToken() : 'TOKEN-NOT-KNOWN';
        let urlFragment = requestOptions.url.replace(this.TWITTER_API_URL,'');
        let urlFragmentHash = super.HashUrlFragment(urlFragment);        
        let twitterUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + '/twitter/get/' + urlFragmentHash;

        requestOptions.url = twitterUrl;
        requestOptions.headers.append('Authorization', authorizationToken);
        requestOptions.headers.append('UrlFragment', urlFragment);

        let request = super.CreateRequest(requestOptions);

		return this.http.request(request)
			.map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
			.catch((err) => this.HandleError(err, request.url))
			.finally(() =>
			{ 

			});
	};  
}