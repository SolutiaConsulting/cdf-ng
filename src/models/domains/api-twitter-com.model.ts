import { Injectable }           from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import 
{ 
	Http,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response
} 								from '@angular/http';

import
{
    CdfConfigService,
    CdfDomainService
}                               from '../../services/index'; 
import { CdfPostModel }			from '../index';
import { BaseDomainModel }      from './base-domain.model';

@Injectable()
export class ApiTwitterModel extends BaseDomainModel
{
    readonly TWITTER_API_URL = 'https://api.twitter.com/1.1/';    

    http: Http;

    constructor () 
    { 
        super();

        this.http = super.InjectHttp();       
    }     

	//PHYSICAL HTTP GET CALL TO DOMAIN FOR RESULT DATA...
	HttpGet(url: string): Observable<any>
	{
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });		
        let bearerToken = (super.HasToken()) ? super.GetTokenValueFromStorage() : 'TOKEN-NOT-KNOWN';
        let urlFragment = url.replace(this.TWITTER_API_URL,'');
        let urlFragmentHash = super.HashUrlFragment(urlFragment);
        let twitterUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + '/twitter/get/' + urlFragmentHash;

        // console.log('BEARER TOKEN:', bearerToken);   
        // console.log('TWITTER FRAGMENT:', urlFragment);
        // console.log('TWITTER FRAGMENT HASH:', urlFragmentHash);
        // console.log('TWITTER URL', twitterUrl);
        // console.log('--------------------------------------------------------------------------'); 

        //APPEND TO HEADER:
        options.headers.append('BearerToken', bearerToken);
        options.headers.append('UrlFragment', urlFragment);					
        options.body = '';
        
        return this.http.get(twitterUrl, options)
            .map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
            .catch((err) => super.HandleError(err, url))
			.finally(() =>
			{ 

			});
	};	    
    
	//PHYSICAL HTTP POST CALL TO DOMAIN FOR RESULT DATA...
	HttpPost(postModel: CdfPostModel): Observable<any>
	{ 
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });				
        let urlFragment = postModel.URL.replace(this.TWITTER_API_URL, '');
                                            
        //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

        let requestModel = 
        {
            "BearerToken" : super.GetTokenValueFromStorage(),
            "UrlFragment" : urlFragment,
            "PostBody" : postModel.Body
        };

        let postUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + '/twitter/post/request';

        return this.http.post(postUrl, JSON.stringify(requestModel), options)
           .map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
            .catch((err) => super.HandleError(err, postUrl))
			.finally(() =>
			{ 

			});
	};    
}