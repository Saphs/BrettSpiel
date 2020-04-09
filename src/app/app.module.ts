import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameDisplayComponent } from './game-display/game-display.component';
import { LoginComponent } from './login/login.component';
import { RulesComponent } from './rules/rules.component';
import { GifViewerComponent } from './gif-viewer/gif-viewer.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageComponent } from './message/message.component';
import {MatSelectModule} from '@angular/material/select';
import { ProfileDisplayComponent } from './profile-display/profile-display.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'lobby', component: LobbyComponent},
  { path: 'game', component: GameComponent},
  { path: '', redirectTo: '/lobby', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    GameDisplayComponent,
    LoginComponent,
    RulesComponent,
    GifViewerComponent,
    LanguageSelectorComponent,
    MessageComponent,
    ProfileDisplayComponent,
    LobbyComponent,
    GameComponent,
    PageNotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
