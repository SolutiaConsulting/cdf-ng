import { ReflectiveInjector}    			from '@angular/core';
import { Observable } 						from 'rxjs/Rx';
import
{
	BrowserXhr,
	BaseRequestOptions,
	BaseResponseOptions,
	CookieXSRFStrategy,
	Headers,
	Http,
	HttpModule,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	RequestMethod,
	ResponseContentType,
	Response,
	ResponseOptions,
	XHRBackend,
	XSRFStrategy
} 											from '@angular/http';

import { BaseDomainInterface } 				from './base-domain.interface';
import { CdfAuthenticationTokenModel } 		from '../index';
import { CdfConfigService } 				from '../../services/index'; 

export class BaseDomainModel implements BaseDomainInterface 
{
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


    HasToken(): boolean
	{
		let tokenModel:CdfAuthenticationTokenModel = this.GetTokenModelFromStorage();	
		
		return (tokenModel && tokenModel.AccessToken != undefined);
	};

	
	/*
	the token set here is of type IAuthenticationDataContract from https://webapi.cdf.cloud/api/token/generate-token
	*/
	SetToken(tokenModel: CdfAuthenticationTokenModel): void
	{
		// console.log('SET TOKEN DOMAIN:', DomainRootUrl);
		// console.log('SET TOKEN:', token);
		localStorage.setItem(this.DomainRootUrl, JSON.stringify(tokenModel));
	};


	DeleteToken(): void
	{ 
		if (localStorage.getItem(this.DomainRootUrl))
		{ 
			localStorage.removeItem(this.DomainRootUrl);
		}		
	};	


	GetTokenModelFromStorage(): CdfAuthenticationTokenModel
	{ 
		let tokenModel = (localStorage.getItem(this.DomainRootUrl)) ? localStorage.getItem(this.DomainRootUrl) : undefined;

		if(tokenModel)		
		{
			return JSON.parse(tokenModel);
		}

		return undefined;
	};


    GetAuthorizationToken(): string
	{
		if (this.HasToken())
		{		
			let tokenModel = this.GetTokenModelFromStorage();			
					
			return (tokenModel.TokenType && tokenModel.AccessToken) ? tokenModel.TokenType + ' ' + tokenModel.AccessToken : undefined;
		}
	};

	
	AuthenticateObservable(url: string) : Observable<any>
	{
		return Observable.create(observer => 
		{			
			let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
			let options = new RequestOptions({ headers: headers });		
										
			let requestModel = 
			{
				ApplicationKey: this.ApplicationKey,
				RequestUrl: url
			};						

			let postUrl = CdfConfigService.CDF_WEBAPI_BASE_URL + 'token/generate-token';

			let newTokenSubscription = this.http.post(postUrl, requestModel, options)
				.map(res => res.json())
				.subscribe (
					//SUCCESS
					data =>
					{
						//console.log('STEP 1.  SUCCESS WE HAVE A NEW TOKEN:', data);

						//SET TOKEN RECEIVED FROM API
						let tokenModel = new CdfAuthenticationTokenModel(data);
						this.SetToken(tokenModel);

						//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN 
						observer.next(data);
						observer.complete();
					},

					//ERROR
					err =>
					{ 
						//console.log('authenticateObservable error:', err);
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
        });
	};


	HttpRequest(requestOptions: RequestOptions): Observable<any>
	{
		let request = this.CreateRequest(requestOptions);

		return this.http.request(request)
			.map((res: Response) =>  this.HandleResponseMapping(res, requestOptions))
			.catch((err) => this.HandleError(err, request.url))
			.finally(() =>
			{ 

			});
	};	


	CreateRequest(requestOptions: RequestOptions): Request
	{ 
		//IF NO METHOD IS SET, THEN DEFAULT TO GET
		if (!this.hasMethod(requestOptions))
		{ 
			requestOptions.method = RequestMethod.Get;
		}	

		//IF TOKEN EXISTS IN LOCAL STORAGE FOR THIS DOMAIN URL, THEN USE IT AS AUTHORIZATION
		if (this.HasToken())
		{ 
			let bearerToken = this.GetAuthorizationToken();

			if (!requestOptions.headers.get('Authorization'))
			{ 
				requestOptions.headers.append('Authorization', bearerToken);
			} 

			if (!requestOptions.headers.get('Access-Control-Allow-Origin'))
			{ 
				requestOptions.headers.append('Access-Control-Allow-Origin', '*');
			} 
		}

		//console.log('CDF REQUEST OPTIONS', requestOptions);

		return new Request(requestOptions);
	};


	//HANDLE MAPPING RESULTS
	HandleResponseMapping(response: Response, requestOptions: RequestOptions): any
	{ 
		switch(requestOptions.responseType)		
			{
				case ResponseContentType.ArrayBuffer:
					{
						return response.arrayBuffer();
					};

				case ResponseContentType.Blob:
					{
						return response.blob();
					};
				case ResponseContentType.Text:
					{
						return response.text();
					};
				default:
					{
						return response.json();
					};
			}
	};


	//HANDLE ERRORS FROM HTTP CALLS...
	HandleError(err: any, url: string): Observable<any>
	{ 
		//HANDLE AUTHENTICATION ERRORS...
		if (err && err.status && (err.status === 401 || err.status === 403))
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
				errorObject: err.json(),
                status: err.status
            }
		
		return Observable.throw(errorObject);
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


	private hasMethod(requestOptions : RequestOptions): boolean
	{ 
		return (requestOptions.method && requestOptions.method !== undefined);
	};
	
	private hasAuthorization(requestOptions : RequestOptions): boolean
	{ 
		let authorization = requestOptions.headers.get('Authorization');
		return (authorization && authorization.length > 0);
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