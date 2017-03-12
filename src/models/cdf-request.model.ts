import
{
	Headers,
	Request,
	ResponseContentType,
	RequestMethod,
	RequestOptions
} 									from '@angular/http';

export class CdfRequestModel
{
	ApplicationKey: string;
	CacheKey?: string;	
	RequestOptionsList: RequestOptions[] = []; 

	constructor(applicationKey: string)
	{
		this.ApplicationKey = applicationKey;
	}

	AddRequest(requestOptions: RequestOptions | RequestOptions[])
	{ 
		if (!this.RequestOptionsList)
		{ 
			this.RequestOptionsList = [];
		}

		//IF REQUEST OPTIONS IS AN ARRAY, THEN PUSH EACH ITEM INTO REQUEST LIST AS A REQUEST
		if (requestOptions instanceof Array)
		{ 
			requestOptions.map(function (item)
			{ 
				this.RequestOptionsList.push(item);
			});
		}
		
		//ELSE, REQUEST IS A SINGLE INSTANCE OF REQUEST OPTIONS
		else
		{
			this.RequestOptionsList.push(requestOptions);
		}		
	};

	static CreateGetRequest(url: string, body?: Object, authorization?: string): RequestOptions
	{ 
		return CdfRequestModel.CreateRequest(RequestMethod.Get, url, body, authorization);
	}

	static CreatePostRequest(url: string, body?: Object, authorization?: string): RequestOptions
	{ 
		return CdfRequestModel.CreateRequest(RequestMethod.Post, url, body, authorization);
	}

	static CreatePutRequest(url: string, body?: Object, authorization?: string): RequestOptions
	{ 
		return CdfRequestModel.CreateRequest(RequestMethod.Put, url, body, authorization);
	}

	static CreateDeleteRequest(url: string, body?: Object, authorization?: string): RequestOptions
	{ 
		return CdfRequestModel.CreateRequest(RequestMethod.Delete, url, body, authorization);
	}

	static CreateRequest(requestMethod: RequestMethod, url: string, body?: Object, authorization?: string): RequestOptions
	{ 
		let headers = new Headers(
			{
				'Content-Type': 'application/json',
			});

		//IF USER IS AUTHENTICATED...
		if (authorization)
		{
			headers[ 'Authorization' ] = authorization;
		}
		
		let requestOptions = new RequestOptions(
			{
				method: requestMethod,
				url: url,
				headers: headers,
				responseType: ResponseContentType.Json,
				body : body
			});

		return requestOptions;
	}

	static DoesRequestHaveAuthentication(requestOptions: RequestOptions)
	{ 
		return (requestOptions.headers && (requestOptions.headers['Authorization'] || requestOptions.headers['authorization']));
	}

	static GetAuthenticationValue(requestOptions: RequestOptions) : string
	{ 
		return (requestOptions.headers && (requestOptions.headers['Authorization'] || requestOptions.headers['authorization'])) ? requestOptions.headers['Authorization'] : '';
	}	
}