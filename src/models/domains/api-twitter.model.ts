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
    TwitterRequestUrl: string;

    constructor () 
    { 
        super();

        this.http = super.InjectHttp();       
    }     

	//HTTP REQUEST	
	HttpRequest(requestOptions: RequestOptions): Observable<any>
    {
        this.TwitterRequestUrl = requestOptions.url;
        let urlFragment = requestOptions.url.replace(this.TWITTER_API_URL,'');
        let urlFragmentHash = super.HashUrlFragment(urlFragment);        
        let twitterProxyUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + '/twitter/get/' + urlFragmentHash;

        if (!requestOptions.headers.get('UrlFragment'))
        { 
            requestOptions.headers.append('UrlFragment', urlFragment);
        }         

        let request = super.CreateRequest(requestOptions);

        request.url = twitterProxyUrl;

		return this.http.request(request)
            .map((res: Response) =>  super.HandleResponseMapping(res, requestOptions))			
			.catch((err) => super.HandleError(err, this.TwitterRequestUrl))
			.finally(() =>
			{ 

			});
	};    
}