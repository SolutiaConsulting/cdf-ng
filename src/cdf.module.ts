import { NgModule, ModuleWithProviders }	from '@angular/core';
import { CommonModule }						from '@angular/common';

import { CacheService} 						from './storage/cache.service';
import { CdfDataService} 					from './services';

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
		CdfDataService
	]
})
export class CdfModule {}