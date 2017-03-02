import 
{ 
    Injectable,
    ReflectiveInjector 
} 		                        from '@angular/core';

import 
{ 
    BaseDomainModel,
    BaseDomainInterface
}	                            from '../models/index'; 

import 
{ 
    ApiTwitterModel
}	                            from '../models/domains/api-twitter-com.model'; 

import { CdfConfigService }     from '../services/index';

@Injectable()
export class CdfDomainService 
{	    
    static readonly CDF_DOMAIN_PROXY_LIST = 
    [
        {
            name : 'twitter',
            domain : 'api.twitter.com',
            provide: 'api.twitter.com',
            useClass: ApiTwitterModel
        }
    ];

	constructor()
	{ 
	}

    static GetDomainModelFromUrl(domainUrl: string, applicationKey: string) : BaseDomainInterface
    {
        let domainRootUrl = CdfDomainService.GetDomainRootFromUrl(domainUrl);

        return CdfDomainService.GetDomainModel(domainRootUrl, applicationKey);        
    };

    static GetDomainModel(domainRootUrl: string, applicationKey: string) : BaseDomainInterface
    {
        let isDomainKnown = CdfDomainService.CDF_DOMAIN_PROXY_LIST.some(function (providerItem) 
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
            let injector = ReflectiveInjector.resolveAndCreate(CdfDomainService.CDF_DOMAIN_PROXY_LIST);
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
        let cdfDomainIndex = domainRoot.indexOf(CdfConfigService.CDF_WEBAPI_BASE_URL);

        //IF URL IS ACTUALL CDF WEB API, THEN DIG DEEPER TO SEE IF URL CONTAINS
        //CLUES AS TO WHAT DOMAIN CDF WEB API IS ACTING UPON
        //LOOK TO PATH OF CDF WEB API FOR CLUES (TWITTER, GOOGLE, ETC)
        if(cdfDomainIndex > -1)
        {
            CdfDomainService.CDF_DOMAIN_PROXY_LIST.some
            (
                function(proxy) 
                {
                    let proxyIndex = url.indexOf(proxy.name);

                    if(proxyIndex > -1)
                    {
                        domainRoot = proxy.domain;
                        return true;
                    }                
                }
            );
        }
		
		return domainRoot;
	};    
}