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

	
	AddGetRequest(request: CdfRestModel | CdfRestModel[])
	{ 
		if (!this.GetList)
		{ 
			this.GetList = [];
		}	

		this.PopulateRestTypeArray(this.GetList, request);
	}

	
	AddPostRequest(request: CdfRestModel | CdfRestModel[])
	{ 
		if (!this.PostList)
		{ 
			this.PostList = [];
		}	

		this.PopulateRestTypeArray(this.PostList, request);
	}

	
	AddPutRequest(request: CdfRestModel | CdfRestModel[])
	{ 
		if (!this.PutList)
		{ 
			this.PutList = [];
		}	

		this.PopulateRestTypeArray(this.PutList, request);
	}

	
	AddDeleteRequest(request: CdfRestModel | CdfRestModel[])
	{ 
		if (!this.DeleteList)
		{ 
			this.DeleteList = [];
		}	

		this.PopulateRestTypeArray(this.DeleteList, request);
	}


	private PopulateRestTypeArray(restModelArray: CdfRestModel[], requestModel: CdfRestModel | CdfRestModel[])
	{ 
		//IF REQUEST IS AN ARRAY, THEN PUSH EACH REST MODEL
		if (requestModel instanceof Array)
		{ 
			requestModel.map(function (item)
			{ 
				restModelArray.push(item);
			});
		}
		
		//ELSE, REQUEST IS A SINGLE INSTANCE OF REST MODEL
		else
		{
			restModelArray.push(requestModel);
		}		
	}	
}