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

		let that = this;

		//IF REQUEST OPTIONS IS AN ARRAY, THEN PUSH EACH ITEM INTO REQUEST LIST AS A REQUEST
		if (requestOptions instanceof Array)
		{ 
			requestOptions.map(function (item)
			{ 
				that.RequestOptionsList.push(item);
			});
		}
		
		//ELSE, REQUEST IS A SINGLE INSTANCE OF REQUEST OPTIONS
		else
		{
			this.RequestOptionsList.push(requestOptions);
		}		
	};	

	AddGetRequest(url: string, body?: Object): void
	{ 
		this.addRequest(this.createRequest(RequestMethod.Get, url, body));
	}

	AddPostRequest(url: string, body?: Object): void
	{ 
		this.addRequest(this.createRequest(RequestMethod.Post, url, body));
	}

	AddPutRequest(url: string, body?: Object): void
	{ 
		this.addRequest(this.createRequest(RequestMethod.Put, url, body));
	}

	AddDeleteRequest(url: string, body?: Object): void
	{ 
		this.addRequest(this.createRequest(RequestMethod.Delete, url, body));
	}

	private createRequest(requestMethod: RequestMethod, url: string, body?: Object): RequestOptions
	{ 
		let headers = new Headers(
			{
				'Content-Type': 'application/json',
			});
		
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

	private addRequest(requestOptions: RequestOptions | RequestOptions[]) : void
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
}