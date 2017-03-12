import { Observable } 			            from 'rxjs/Rx';
import
{
    Http,
    Request,
    RequestOptions
}                                           from '@angular/http';

import { CdfAuthenticationTokenModel } 		from '../index';

export interface BaseDomainInterface 
{
	DomainRootUrl: string;
	ApplicationKey: string;    
    InjectHttp() : Http;
    
    HasToken(): boolean;
    SetToken(tokenModel: CdfAuthenticationTokenModel): void 
    GetTokenValueFromStorage(): string;
    GetBearerToken(): string; 
    DeleteToken(): void;    
    
    HashUrlFragment(urlFragment : string) : number;

    AuthenticateObservable(url: string): Observable<any>;
    HttpRequest(requestOptions: RequestOptions): Observable<any>;
    CreateRequest(requestOptions: RequestOptions): Request;

    HandleError(err: any, url: string): Observable<any>;
}