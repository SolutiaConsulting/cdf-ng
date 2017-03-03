import { ReflectiveInjector}    	from '@angular/core';
import { Observable } 				from 'rxjs/Rx';
import
{
	Http,
	HttpModule,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response,
	CookieXSRFStrategy,
	XHRBackend,
	BrowserXhr,
	BaseRequestOptions,
	ResponseOptions,
	BaseResponseOptions,
	XSRFStrategy
} 									from '@angular/http';

import { BaseDomainInterface } 		from './base-domain.interface';
import { CdfRestModel }				from '../cdf-rest.model';
import { CdfConfigService } 		from '../../services/index'; 
import { CdfAuthorizationModel }	from '../cdf-authorization.model';

export class BaseDomainModel implements BaseDomainInterface 
{
	AuthorizationModel: CdfAuthorizationModel;
	DomainRootUrl: string;
	ApplicationKey: string;
	http: Http;

    constructor () 
	{
		this.http = this.InjectHttp();  
    }

	InjectHttp() : Http
	{
        let injector = ReflectiveInjector.resolveAndCreate
        (
            [
				Http,
                HttpModule,
				{provide: Http, useFactory: BaseDomainModel.HttpFactory, deps: [XHRBackend, RequestOptions]},
				BrowserXhr,
				{provide: RequestOptions, useClass: BaseRequestOptions},
				{provide: ResponseOptions, useClass: BaseResponseOptions},
				XHRBackend,
				{provide: XSRFStrategy, useFactory: BaseDomainModel.CreateDefaultCookieXSRFStrategy}				
            ]
        );                

		return injector.get(Http);  		
	};

	SetAuthorizationModel(authorizationModel: CdfAuthorizationModel): void
	{ 
		this.AuthorizationModel = authorizationModel;
	};

    HasToken(): boolean
	{
		if (this.AuthorizationModel && this.AuthorizationModel.HasAuthorizationToken)
		{ 
			return true;
		}

		let authTokenValue = this.GetTokenValueFromStorage();	

		return (authTokenValue != undefined);
	};

	GetTokenValueFromStorage()
	{ 
		if (this.AuthorizationModel && this.AuthorizationModel.HasAuthorizationToken)
		{ 
			return this.AuthorizationModel.AuthorizationToken;
		}
		
		let authTokenStorage = (localStorage.getItem(this.DomainRootUrl)) ? JSON.parse(localStorage.getItem(this.DomainRootUrl)) : undefined;
		let authTokenValue = (authTokenStorage && authTokenStorage.access_token) ? authTokenStorage.access_token : undefined;
		
		return authTokenValue;
	};

    GetToken(): string
	{
		//console.log('GET TOKEN DOMAIN:', DomainRootUrl);

		if (this.AuthorizationModel && this.AuthorizationModel.HasAuthorizationToken)
		{ 
			return this.AuthorizationModel.GetAuthorization();
		}	

		let authTokenValue = this.GetTokenValueFromStorage();			
		
		return (authTokenValue) ? 'Bearer ' + authTokenValue : undefined;
	};

	SetToken(token: any): void
	{
		// console.log('SET TOKEN DOMAIN:', DomainRootUrl);
		// console.log('SET TOKEN:', token);

		localStorage.setItem(this.DomainRootUrl, JSON.stringify(token));
	};

	DeleteToken(): void
	{ 
		//console.log('DELETE TOKEN DOMAIN:', DomainRootUrl);

		if (localStorage.getItem(this.DomainRootUrl))
		{ 
			localStorage.removeItem(this.DomainRootUrl);
		}	
	};	

	HashUrlFragment(urlFragment : string) : number
	{
		let hash = 5381;

		for (let i = 0; i < urlFragment.length; i++) 
		{
			let char = urlFragment.charCodeAt(i);
			hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
		}

		return hash;		
	};

	AuthenticateObservable(url: string) : Observable<any>
	{
		//DELETE TOKEN
		this.DeleteToken();

		return Observable.create(observer => 
		{
			var authToken = (this.HasToken()) ? this.GetTokenValueFromStorage() : undefined;		
			
			if (authToken)
			{
				//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN
				observer.next(authToken);
				observer.complete();
			}
			else
			{
                let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
                let options = new RequestOptions({ headers: headers });		
                                            
                //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

                let requestModel = 
                {
					ApplicationKey: this.ApplicationKey,
					RequestUrl: url
                };						

                let postUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + '/token/generate-token';

                let newTokenSubscription = this.http.post(postUrl, JSON.stringify(requestModel), options)
                    .map(res => res.json())
                    .subscribe (
                        //SUCCESS
                        data =>
                        {
                            //console.log('STEP 1.  SUCCESS WE HAVE A NEW TOKEN:', data);

                            //SET TOKEN RECEIVED FROM API
                            this.SetToken(data);

                            //COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN 
                            observer.next(data);
                            observer.complete();
                        },

                        //ERROR
                        err =>
                        { 
                            //console.log('authenticateObservable error smalls:', err);
                        },

                        //COMPLETE
                        () =>
                        { 
                            if (newTokenSubscription)
                            { 
                                newTokenSubscription.unsubscribe();
                            }							
                        }
                    );
			}
        });
	};

	
	//HTTP GET CALL TO DOMAIN FOR RESULT DATA...
	HttpGet(url: string): Observable<any>
	{
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });				
        let bearerToken = (this.HasToken()) ? this.GetToken() : 'TOKEN-NOT-KNOWN';
                
        //APPEND TO HEADER:
        options.headers.append('Authorization', bearerToken);
        options.body = '';
        
        // console.log('BASE DOMAIN BEARER TOKEN:', bearerToken);   
        // console.log('BASE DOMAIN URL', url);
        // console.log('--------------------------------------------------------------------------'); 		

		return this.http.get(url, options)
			.map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
			.catch((err) => this.HandleError(err, url))
			.finally(() =>
			{ 

			});
	};	
    

	//HTTP POST CALL TO DOMAIN FOR RESULT DATA...
	HttpPost(postModel: CdfRestModel): Observable<any>
	{ 
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });	
		
        //APPEND TO HEADER: Authorization : Bearer [token]
        if (this.HasToken())
		{
			let bearerToken = this.GetToken();

            options.headers.append('Authorization', bearerToken);
            options.headers.append('Access-Control-Allow-Origin', '*');
        }
                        
        //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

		return this.http.post(postModel.URL, JSON.stringify(postModel.Body), options)
			.map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
			.catch((err) => this.HandleError(err, postModel.URL))
			.finally(() =>
			{ 

			});
	};	
    

	//HTTP PUT CALL TO DOMAIN FOR RESULT DATA...
	HttpPut(putModel: CdfRestModel): Observable<any>
	{ 
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });	
		
        //APPEND TO HEADER: Authorization : Bearer [token]
        if (this.HasToken())
		{
			let bearerToken = this.GetToken();

            options.headers.append('Authorization', bearerToken);
            options.headers.append('Access-Control-Allow-Origin', '*');
        }
                        
        //console.log('************* PUT BODY *************:', JSON.stringify(putModel.Body));

		return this.http.put(putModel.URL, JSON.stringify(putModel.Body), options)
			.map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
			.catch((err) => this.HandleError(err, putModel.URL))
			.finally(() =>
			{ 
			});
	};	
    

	//HTTP DELETE CALL TO DOMAIN FOR RESULT DATA...
	HttpDelete(deleteModel: CdfRestModel): Observable<any>
	{ 
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });	
		
        //APPEND TO HEADER: Authorization : Bearer [token]
        if (this.HasToken())
		{
			let bearerToken = this.GetToken();

            options.headers.append('Authorization', bearerToken);
            options.headers.append('Access-Control-Allow-Origin', '*');
        }
                        
        //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

		return this.http.delete(deleteModel.URL, new RequestOptions({
			headers: headers,
			body: deleteModel.Body
		})).map((res: Response) => (res['_body'] && res['_body'].length) ? res.json() : {})
			.catch((err) => this.HandleError(err, deleteModel.URL))
			.finally(() =>
			{ 

			});
	};


	//HANDLE ERRORS FROM HTTP CALLS...
	HandleError(err: any, url: string): Observable<any>
	{ 
		//HANDLE AUTHENTICATION ERRORS...
		if (err && err.status && err.status === 401)
		{
			return Observable.create(observer => 
			{			
				//RETRY AUTHENTICATE OBSERVABLE FOR A NEW TOKEN		
				let authenticateObservableSubscription = this.AuthenticateObservable(url)
					.subscribe(
						//SUCCESS
						newToken =>
						{
							//console.log('STEP 2.  SUCCESS HANDLED AUTH ERROR:', newToken);
							
							//THROW ERROR SO RETRY ATTEMPTS GETS INITIATED NOW THAT WE HAVE AN ACCESS TOKEN  
							//(SEE retryWhen IN cdf-data.service) 
							//AT THIS POINT, WE HAVE A SHINY NEW VALID TOKEN FROM WHICH TO GET DATA...
							observer.error(err);
						},
							
						//ON ERROR
						(autherror) =>
						{ 
							//console.log('STEP 2a.  AUTH ERROR HAPPENED:', autherror);
							observer.error(autherror);	
						},

						//ON COMPLETE
						() =>
						{
							if (authenticateObservableSubscription)
							{
								authenticateObservableSubscription.unsubscribe();
							}
							//console.log('AUTHENTICATE RETRY COMPELETED');
						}
					);
			});
		}

        let errorObject =
            {
                error: err,
                errorUrl: url,
				errorObject: (err[ '_body' ] && err[ '_body' ].length) ? err.json() : {},
                status: err.status
            }
		
		return Observable.throw(errorObject);
	}

	
	static CreateDefaultCookieXSRFStrategy() 
	{
		return new CookieXSRFStrategy();
	};

	static HttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http 
	{
		return new Http(xhrBackend, requestOptions);
	};	
}