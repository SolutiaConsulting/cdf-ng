# Content Delivery Framework for Angular (CDF-NG)
[![version][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

> CDF-NG is a tool for making REST requests.  CDF is a wrapper for Angular's HTTP implementation.  CDF allows you to easily make one or multiple REST requests against different APIs.  Multiple requests are treated as a single unit and results are returned in an array.  You can subscribe to popular APIs via our admin tool ( [CDF Admin Site][admin-url] ) where CDF will create and maintain access tokens on your behalf, or you can use your own APIs or APIs not available in our admin tool by simply supplying your access-token (you will be responsible for providing access-tokens).
> Happy Coding!

![](logo-535x141.png)

# Requirements
CDF requires the latest version of Angular (at the time of this writing: 2.4.7).
```sh
  //package.json
  
  "dependencies": {
    "@angular/common": "2.4.7",
    "@angular/compiler": "2.4.7",
    "@angular/core": "2.4.7",
    "@angular/forms": "2.4.7",
    "@angular/http": "2.4.7",
    "@angular/platform-browser": "2.4.7",
    "@angular/platform-browser-dynamic": "2.4.7",
    "@angular/router": "3.4.7"
	...
  }
```

# Installation

CDF requires creating an account at [CDF Admin Site][admin-url].  Once you create an account, you will be able to register your application(s) with CDF.  You will need a CDF Application Key (auto generated by CDF) in order to submit REST requests through CDF.  The Application Key is used to identify your application in order to generate access tokens on your behalf for the APIs you have connected to your application.  You still need an Application Key even if you do not connect your application to any APIs in CDF's API library.

## Installing CDF in your Angular application:
```sh
    npm install @cdf/cdf-ng --save


    // app.module.ts
    import { CdfModule } from '@cdf/cdf-ng/lib';
    
    @NgModule({
      declarations: [ ... ],
      imports: [
        ...
        CdfModule,
      ],
      providers: [ ... ],
      bootstrap: [ ... ]
    })
    export class AppModule { }
```


# Usage example

This example is making the following REST requests:

* GetCloudCMSRepositoryList is a single GET request to Cloud CMS API.  Cloud CMS is a CDF supported API.
* GetMultipleRequestsFromAPI contains 4 requests (3 GETS, 1 POST).  


```sh
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { CdfRequestModel, CdfDataService } from '@cdf/cdf-ng/lib';

@Injectable()
export class DataService 
{
	constructor(private cdfDataService : CdfDataService)
	{
	}

	GetCloudCMSRepositoryList(): Observable<any> 
	{
		let request: CdfRequestModel = new CdfRequestModel('[CDF APPLICATION KEY]');			
		requestModel.AddGetRequest('https://api.cloudcms.com/repositories/');		
		
		return Observable.create(observer => 
		{
			this.cdfDataService.requestData(request)
			.subscribe
			(
				//SUCCESS
				rawJson =>
				{				
					observer.next(rawJson);
					observer.complete();
				},

				//ERROR
				err => 
				{
					console.log('**** AN ERROR HAS HAPPENED:', err);
				},

				//ON COMPLETE
				() => 
				{
					console.log('**** REQUEST HAS COMPLETED:');
				}
			)
		});				
	}

	GetMultipleRequestsFromAPI(): Observable<any> 
	{
		let request: CdfRequestModel = new CdfRequestModel('[CDF APPLICATION KEY]');				
		request.AddGetRequest('https://api.cloudcms.com/repositories/');
		request.AddGetRequest('https://api.cloudcms.com/projects/');
		request.AddGetRequest('https://api.cloudcms.com/applications');		
		request.AddPostRequest('https://api.cloudcms.com/repositories/query?limit=3&metadata=true&full=true', {"enableAuditing":true});		
		
		return Observable.create(observer => 
		{
			this.cdfDataService.requestData(request)
			.subscribe
			(
				//SUCCESS
				rawJson =>
				{				
					//rawJson is an array with 4 items, 1 for each request in the same order added above
					observer.next(rawJson);
					observer.complete();
				},

				//ERROR
				err => 
				{
					console.log('**** AN ERROR HAS HAPPENED:', err);
				},

				//ON COMPLETE
				() => 
				{
					console.log('**** REQUEST HAS COMPLETED:');
				}
			)
		});				
	}	
}
```

## Using CDF with APIs not part of CDF API Library
If you want to access APIs not available through CDF, you simply have to call SaveToken static method found in CdfTokenService.  SaveToken accepts the following:

* URL (any URL to your API will do)
* Token Type (defaults to Bearer)
* Access Token

CdfTokenService uses the provided URL to your API to extract the API's host name.  The host name is used to save your access token to localStorage.  CDF uses API's URL host name for subsequent API requests to retrieve access token for each request.  Token type defaults to Bearer.  Access token is the value of the access token needed to access your API.  You are responsible for making the call to your API's authenticatin process which should result in an access token for the API.

```sh
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { CdfTokenService } from '@cdf/cdf-ng/lib';

@Injectable()
export class AuthService 
{
	constructor()
	{
	}

	AuthenticateUser(loginModel:any): Observable<any> 
	{
		//MAKE CALL TO AUTHENTICATE USER
		...
		
		let url: string = 'http://url-to-your-api.com';
		let authToken: string = [some value from your APIs authentication process]
		
		//SAVES AUTHTOKEN FOR YOUR API TO LOCAL STORAGE FOR SUBSEQUENT USE...
		CdfTokenService.SaveToken(url, 'Bearer', authToken)
			.subscribe
			(
				//SUCCESS
				tokenModel =>
				{
					//tokenModel is JSON object saved to localstorage
				},

				//ERROR
				err =>
				{ 
				},

				//COMPLETE
				() =>
				{ 
				}
			);
	}	
}
```

**_NOTE:_** you will need to call CdfTokenService.SaveToken whenever your API's access token is established.  If your access token expires, you will need to call CdfTokenService.SaveToken to re-establish your new access token with CDF.


# Helpful Links
* [CDF Admin Site][admin-url]
* [Angular](https://angular.io/)
* [Solutia Consulting](http://solutiaconsulting.com)


## Release History

* < 2.0.31
    * Rounds and rounds of trial and error...

# Meta

Tom Schreck – [@tschreck](https://twitter.com/tschreck) – tom_schreck@solutiaconsulting.com


Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/tomschreck](https://github.com/tomschreck)

# License

[MIT](https://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/@cdf/cdf-ng.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@cdf/cdf-ng
[downloads-image]: https://img.shields.io/npm/dm/@cdf/cdf-ng.svg?style=flat-square
[downloads-url]: https://npm-stat.com/charts.html?package=%40cdf%2Fcdf-ng&from=2017-03-01
[license-image]: https://img.shields.io/npm/l/@cdf/cdf-ng.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[admin-url]: https://admin.cdf.cloud/