import { CdfRestModel } 	from './cdf-rest.model';

export class CdfRequestModel
{
	ApplicationKey: string;
	CacheKey?: string;	
	GetList: CdfRestModel[] = []; 
	PostList: CdfRestModel[] = [];
	PutList: CdfRestModel[] = [];
	DeleteList: CdfRestModel[] = [];

	constructor()
	{
	}
}