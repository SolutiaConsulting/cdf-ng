import { Injectable } 			from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import
{
	Http,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	Response
} 								from '@angular/http';

import { CacheService }			from '../storage/cache.service';
import 
{ 
	CdfGetModel,
	CdfPostModel,
	CdfRequestModel 
}								from '../models/index';
import { CdfDomainService }		from './cdf-domain.service';

@Injectable()
export class CdfDataService
{
	constructor
	(
		private http: Http,
		private cacheService: CacheService
	)
	{ 
	}

	requestData(requestModel: CdfRequestModel, options?: RequestOptionsArgs): Observable<any> 
	{
		let cacheKey = (requestModel.CacheKey) ? requestModel.CacheKey : undefined;

		if (!requestModel.ApplicationKey || requestModel.ApplicationKey.length === 0)
		{ 
			Observable.throw('Application Key Not Provided in Request Model');
		}	

		// console.log('CDF SERVICE DATA ISLAND REQUEST...', requestModel);
		// console.log('CDF SERVICE DATA ISLAND cacheKey...', cacheKey);

		if (cacheKey && this.cacheService.exists(cacheKey))
		{ 
			var cahcedData = this.cacheService.get(cacheKey);			
			//console.log('cahcedData', cahcedData);

			return Observable.create(observer => 
			{
				observer.next(cahcedData);
				observer.complete();
			});
		}
		else
		{					
			return Observable.create(observer => 
			{
				//JOIN ALL REQUESTS TOGETHER INTO A BATCH TO BE FORKED....
				let observableBatch: Observable<any>[] = [];	

				//ADD OBSERVABLE FOR AN ARRAY OF GET REQUESTS				
				if (requestModel.GetList && requestModel.GetList.length > 0)
				{
					for (let urlIndex in requestModel.GetList) 
					{						
						let cdfGetModel = requestModel.GetList[ urlIndex ];
						let domainModel = CdfDomainService.GetDomainModelFromUrl(cdfGetModel.URL, requestModel.ApplicationKey);

						//SET AUTHORIZATION MODEL.  AUTHORIZATION MODEL MAY HAVE ACCESS TOKEN TO BE USED IN HTTP REQUESTS						
						if (cdfGetModel.AuthorizationModel && cdfGetModel.AuthorizationModel.HasAuthorizationToken)
						{ 
							domainModel.SetAuthorizationModel(cdfGetModel.AuthorizationModel);
						}	
						
						//console.log('*****************  DOMAIN MODEL:', domainModel);

						observableBatch.push(domainModel.HttpGet(cdfGetModel.URL));
					}
				}	
																
				//ADD OBSERVABLE FOR AN ARRAY OF POST REQUESTS
				if (requestModel.PostList && requestModel.PostList.length > 0)
				{
					for (let urlIndex in requestModel.PostList) 
					{
						let cdfPostModel = requestModel.PostList[ urlIndex ];
						let domainModel = CdfDomainService.GetDomainModelFromUrl(cdfPostModel.URL, requestModel.ApplicationKey);

						//SET AUTHORIZATION MODEL.  AUTHORIZATION MODEL MAY HAVE ACCESS TOKEN TO BE USED IN HTTP REQUESTS	
						if (cdfPostModel.AuthorizationModel && cdfPostModel.AuthorizationModel.HasAuthorizationToken)
						{ 
							domainModel.SetAuthorizationModel(cdfPostModel.AuthorizationModel);
						}	
						
						//console.log('*****************  DOMAIN MODEL:', domainModel);

						observableBatch.push(domainModel.HttpPost(cdfPostModel));
					}					
				}	
																
				//ADD OBSERVABLE FOR AN ARRAY OF DELETE REQUESTS
				if (requestModel.DeleteList && requestModel.DeleteList.length > 0)
				{
					for (let urlIndex in requestModel.DeleteList) 
					{
						let cdfDeleteModel = requestModel.DeleteList[ urlIndex ];
						let domainModel = CdfDomainService.GetDomainModelFromUrl(cdfDeleteModel.URL, requestModel.ApplicationKey);

						//SET AUTHORIZATION MODEL.  AUTHORIZATION MODEL MAY HAVE ACCESS TOKEN TO BE USED IN HTTP REQUESTS	
						if (cdfDeleteModel.AuthorizationModel && cdfDeleteModel.AuthorizationModel.HasAuthorizationToken)
						{ 
							domainModel.SetAuthorizationModel(cdfDeleteModel.AuthorizationModel);
						}	
						
						//console.log('*****************  DOMAIN MODEL:', domainModel);

						observableBatch.push(domainModel.HttpDelete(cdfDeleteModel));
					}					
				}	

				//console.log('**************** observableBatch:', observableBatch);
				
				/*
				FORK JOIN RETURNS AN ARRAY OF RESULT SETS (1 FOR EACH REQUEST IN FORK JOIN)
				THIS OBSERVABLE, IF SUCCESSFUL, RETURNS THE FOLLOWING:
				[1..N] - THE RAW JSON FROM CMS SERVICE
				*/
				let forkJoinSubscription = Observable.forkJoin(observableBatch)
					.subscribe (
						//SUCCESS, WE HAVE JSON RESPONSE FROM SERVICE
						data =>
						{						
							//console.log('FORK JOIN SUCCESS !!! - JSON FROM CMS SERVICE (cdf-data-service)', data);
							
							//CACHE RESULTS FOR 1 HOUR...		
							var cacheExpires = Date.now() + 1000 * 60 * 60;

							/*
							data is an array of result sets from forkJoin.
							each item in array is the JSON data results from service call
							*/
							if (data instanceof Array && data.length > 1)
							{
								let resultsArray = [];

								for (let dataIndex in data) 
								{
									if (data[dataIndex] instanceof Object)
									{ 
										resultsArray.push(data[ dataIndex ]);
									}	
								}

								//CACHE RESULTS FOR 1 HOUR...		
								if (cacheKey)
								{ 
									this.cacheService.set(cacheKey, resultsArray, {expires: cacheExpires});
								}								

								//THROW RESPONSE JSON INTO THE STREAM...
								observer.next(resultsArray);
								observer.complete();							
							}
							else
							{
								//CACHE RESULTS FOR 1 HOUR...			
								if (cacheKey)
								{
									this.cacheService.set(cacheKey, data[0], {expires: cacheExpires});
								}												
																
								//THROW RESPONSE JSON INTO THE STREAM...
								observer.next(data[0]);
								observer.complete();
							}
						},
					
						//ERROR
						err =>
						{
							//console.log('FORK JOIN ERROR...', err);
							observer.error(err);
						},

						//COMPLETE
						() =>
						{
							if (forkJoinSubscription)
							{ 
								forkJoinSubscription.unsubscribe();
							}							
							
							//console.log('FORK JOIN COMPELETED');
						}
				);			
			})
			//
			//	*********************************************************************************** 
			// 	** THIS WILL RETRY THE OBSERVABLE BATCH 3 TIMES BEFORE GIVING UP
			// 	***********************************************************************************
			//	
			//	An incrememntal back-off strategy for handling errors:
			//	https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/retrywhen.html	
			//				
			.retryWhen(attempts => attempts
				.zip(Observable.range(1, 4))
				.flatMap(
					([ error, i ]) => 
					{
						if (i > 3) 
						{
							return Observable.throw(error);
						}

						console.log('delay retry by ' + i + ' second(s)');

						return Observable.timer(i * 750);
					}
				)
			);
		}
	};
}