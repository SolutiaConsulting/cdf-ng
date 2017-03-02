import { Observable } 			    from 'rxjs/Rx';
import { Http } 				    from '@angular/http';

import { CdfRestModel }			    from '../cdf-rest.model';
import { CdfAuthorizationModel }    from '../cdf-authorization.model';

export interface BaseDomainInterface 
{
    AuthorizationModel: CdfAuthorizationModel;
	DomainRootUrl: string;
	ApplicationKey: string;    
    InjectHttp() : Http;
    
    SetAuthorizationModel(authorizationModel: CdfAuthorizationModel): void;

    HasToken(): boolean;
    GetTokenValueFromStorage(): string;
    GetToken(): string; 
    SetToken(token: any): void;   
    DeleteToken(): void;    
    
    HashUrlFragment(urlFragment : string) : number;

    AuthenticateObservable(url: string) : Observable<any>;
    HttpGet(url: string): Observable<any>;
    HttpPost(postModel: CdfRestModel): Observable<any>;
    HttpPut(postModel: CdfRestModel): Observable<any>;
    HttpDelete(deleteModel: CdfRestModel): Observable<any>;
    HandleError(err: any, url: string): Observable<any>;
}