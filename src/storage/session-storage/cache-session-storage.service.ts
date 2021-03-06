import {Injectable} from '@angular/core';

import {CacheStorageAbstract} 		from '../cache-storage-abstract.service';
import {CacheStoragesEnum} 			from '../cache-storages.enum';
import {StorageValueInterface} 		from '../storage-value.interface';

/**
 * Service for storing data in session storage
 */
@Injectable()
export class CacheSessionStorage extends CacheStorageAbstract
{
    public getItem(key: string)
	{
        let value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public setItem(key: string, value: StorageValueInterface)
	{
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    public removeItem(key: string)
	{
        sessionStorage.removeItem(key);
    }

    public clear()
	{
        sessionStorage.clear();
    }

    public type()
	{
        return CacheStoragesEnum.SESSION_STORAGE;
    }

    public isEnabled()
	{
        try
		{
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e)
		{
            return false;
        }
    }
}