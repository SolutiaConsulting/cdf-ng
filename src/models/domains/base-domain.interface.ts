import { Observable } 			    from 'rxjs/Rx';
import { Http } 				    from '@angular/http';

import { CdfDeleteModel }	        from '../cdf-delete.model';
import { CdfPostModel }			    from '../cdf-post.model';
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
    HttpPost(postModel: CdfPostModel): Observable<any>;
    HttpDelete(deleteModel: CdfDeleteModel): Observable<any>;
    HandleError(err: any, url: string): Observable<any>;
}