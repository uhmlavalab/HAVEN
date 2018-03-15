import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenHomeComponent } from './component/haven-home.component';

import { HavenMaterialModule } from '../haven-modules/haven-material.module';
import { HavenSidebarModule } from '../haven-sidebar/haven-sidebar.module';
import { HavenWindowModule } from '../haven-window/haven-window.module';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    HavenSidebarModule,
    HavenWindowModule
  ],
  declarations: [
    HavenHomeComponent,
  ],
  exports: [
    HavenHomeComponent,
  ],
})
export class HavenHomeModule { }
