import 
{ 
    ReflectiveInjector 
} 		                        from '@angular/core';
import
{
    Request,
    RequestOptions
}                               from '@angular/http';

import 
{ 
    ApiTwitterModel,
    BaseDomainModel,
    BaseDomainInterface
}	                            from '../models/index'; 


export class CdfDomainService 
{	    
    static GetDomainProxyList()
    { 
        let proxyList =
            [
                {
                    name: 'twitter',
                    domain: 'api.twitter.com',
                    provide: 'api.twitter.com',
                    useClass: ApiTwitterModel
                }
            ];
        
        return proxyList;
    }

    static GetDomainModelFromUrl(request: RequestOptions, applicationKey: string) : BaseDomainInterface
    {
        let domainRootUrl = CdfDomainService.GetDomainRootFromUrl(request.url);

        return CdfDomainService.GetDomainModel(domainRootUrl, applicationKey);        
    };

    static GetDomainModel(domainRootUrl: string, applicationKey: string) : BaseDomainInterface
    {
        let proxyList = CdfDomainService.GetDomainProxyList();

        let isDomainKnown = proxyList.some(function (providerItem) 
        {
            let providerIndex = domainRootUrl.indexOf(providerItem.domain);

            // console.log('**************** providerItem:', providerItem);
            // console.log('**************** providerIndex:', providerIndex);
        
            return (providerIndex > -1);
        }); 

        // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  DOMAIN:', domainRootUrl); 
        // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  IS DOMAIN KNOWN:', isDomainKnown);        

        if (isDomainKnown)
        {
            let injector = ReflectiveInjector.resolveAndCreate(proxyList);
            let domainModel:BaseDomainInterface = injector.get(domainRootUrl);
            domainModel.ApplicationKey = applicationKey;
            domainModel.DomainRootUrl = domainRootUrl;

            return domainModel;                        
        }
        else
        { 
            let domainModel:BaseDomainInterface = new BaseDomainModel();
            domainModel.ApplicationKey = applicationKey;
            domainModel.DomainRootUrl = domainRootUrl;

            return domainModel;
        }
    };

    static GetDomainRootFromUrl(url:string) : string
	{
		let matches = url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
		let domainRoot: string = matches && matches[ 1 ];
		
		return domainRoot;
	};    
}