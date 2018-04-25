import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule, List, NavController } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChartsModule } from 'ng2-charts';

import { MyApp } from './app.component';
import { OptionsPopoverPage } from './options.popover.page';
import { HomeModule } from '../pages/home/home.module';
import { ListModule } from '../pages/list/list.module';
import { SignPageModule } from '../pages/sign/sign.module';

import { CoinService } from '../services/coin.service';
import { GlobalService } from '../services/global.service'
import { CryptoCompareService } from '../services/cryptocompare.service';
import { SlackService } from '../services/slack.service';
import { DocumentService } from '../services/document.service';

@NgModule({
  declarations: [
    MyApp,
    OptionsPopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
    HttpModule,
    JsonpModule,
    HomeModule,
    ListModule,
    SignPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OptionsPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CoinService,
    CryptoCompareService,
    SlackService,
    GlobalService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DocumentService
  ]
})
export class AppModule {}
