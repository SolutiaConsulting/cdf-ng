import { Observable } 			            from 'rxjs/Rx';
import
{
    Http,
    Request,
    RequestOptions,
    Response
}                                           from '@angular/http';

import { CdfAuthenticationTokenModel } 		from '../index';

export interface BaseDomainInterface 
{
	DomainRootUrl: string;
	ApplicationKey: string;    
    InjectHttp() : Http;
    
    HasToken(): boolean;
    SetToken(tokenModel: CdfAuthenticationTokenModel): void 
    DeleteToken(): void;    

    GetTokenModelFromStorage(): CdfAuthenticationTokenModel;
    GetAuthorizationToken(): string; 
    
    AuthenticateObservable(url: string): Observable<any>;
    HttpRequest(requestOptions: RequestOptions): Observable<any>;
    CreateRequest(requestOptions: RequestOptions): Request;

    HandleResponseMapping(response: Response, requestOptions: RequestOptions): any
    HandleError(err: any, url: string): Observable<any>;

    HashUrlFragment(urlFragment : string) : number;
}