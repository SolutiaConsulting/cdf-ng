import { CdfDeleteModel }	from './cdf-delete.model';
import { CdfGetModel } 		from './cdf-get.model';
import { CdfPostModel } 	from './cdf-post.model';


export class CdfRequestModel
{
	ApplicationKey: string;
	CacheKey?: string;	
	GetList: CdfGetModel[] = []; 
	PostList: CdfPostModel[] = [];
	DeleteList: CdfDeleteModel[] = [];

	constructor()
	{
	}
}