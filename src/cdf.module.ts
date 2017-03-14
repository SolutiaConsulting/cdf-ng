import { NgModule, ModuleWithProviders }	from '@angular/core';
import { CommonModule }						from '@angular/common';

import { CacheService} 						from './storage/cache.service';
import { 
	CdfDataService,
	CdfTokenService
} 											from './services';

@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
	],
	exports:
	[
	],
	providers:
	[
		CacheService,
		CdfDataService,
		CdfTokenService
	]
})
export class CdfModule {}