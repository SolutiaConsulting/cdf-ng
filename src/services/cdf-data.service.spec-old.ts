import
{
	TestBed,
	getTestBed,
	async,
	inject
} from '@angular/core/testing';
import
{
	Headers,
	BaseRequestOptions,
	ResponseContentType,
	Response,
	HttpModule,
	Http,
	XHRBackend,
	RequestOptions,
	RequestMethod
} from '@angular/http';

import { ResponseOptions } from '@angular/http';
import { CdfRequestModel } from '../models/cdf-request.model';
import { CdfDataService } from './cdf-data.service';
import { CacheService } from '../storage/cache.service';

describe('Data Service', () =>
{
	beforeEach(async(() =>
	{
		TestBed.configureTestingModule({
			providers: [
				CacheService,
				CdfDataService,
				BaseRequestOptions,
				{
					provide: Http,
					deps: [ XHRBackend, BaseRequestOptions ],
					useFactory:
					(backend: XHRBackend, defaultOptions: BaseRequestOptions) =>
					{
						return new Http(backend, defaultOptions);
					}
				}
			],
			imports: [
				HttpModule
			]
		});
	}));

	it('Should Be Defined', done =>
	{
		let dataService: CdfDataService;

		getTestBed().compileComponents().then(() =>
		{
			dataService = getTestBed().get(CdfDataService);
			expect(dataService).toBeDefined();
			done();
		});
	});


	it('Results Should Be Defined', done =>
	{
		let dataService: CdfDataService;

		getTestBed().compileComponents().then(() =>
		{
			dataService = getTestBed().get(CdfDataService);

			let headers = new Headers(
				{
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			);
			let requestOptions = new RequestOptions(
				{
					method: RequestMethod.Get,
					url: 'http://cdf-api-local.webapi.cdf.cloud/api/domain/list',
					headers: headers,
					responseType: ResponseContentType.Json,
					body: {}
				}
			);

			let requestModel: CdfRequestModel = new CdfRequestModel('42d28aaf-0cef-4433-bb9b-0981fd06375a');
			requestModel.AddRequest(requestOptions)

			dataService.requestData(requestModel)
				.subscribe
				(
					(results) =>
					{
						expect(results).toBeDefined();
						done();
					}
				);
		});
	});
});