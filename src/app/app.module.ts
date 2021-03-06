/* eslint-disable max-len */
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GameDisplayComponent } from './components/lobby/game-display/game-display.component';
import { LoginComponent } from './components/lobby/login/login.component';
import { RulesComponent } from './components/lobby/rules/rules.component';
import { GifViewerComponent } from './components/lobby/gif-viewer/gif-viewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterPopupComponent } from './components/lobby/dialogs/register-popup/register-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { ProfileDisplayComponent } from './components/lobby/profile-display/profile-display.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ViewportComponent } from './components/game/viewport/viewport.component';
import { OpenGamePopupComponent } from './components/lobby/dialogs/open-game-popup/open-game-popup.component';
import { JoinGameComponent } from './components/lobby/dialogs/join-game/join-game.component';
import { InterfaceComponent } from './components/game/interface/interface.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StateDisplayComponent } from './components/game/interface/state-display/state-display.component';
import { ConnectedPlayersComponent } from './components/game/interface/connected-players/connected-players.component';
import { PregameBannerComponent } from './components/game/interface/pregame-banner/pregame-banner.component';
import { DebugdummyComponent } from './components/debugdummy/debugdummy.component';
import { IngameRuleBookComponent } from './components/game/interface/menu-bar/ingame-rule-book/ingame-rule-book.component';
import { NextTurnButtonComponent } from './components/game/interface/next-turn-button/next-turn-button.component';
import { TurnOverlayComponent } from './components/game/interface/turn-overlay/turn-overlay.component';
import { TileOverlayComponent } from './components/game/interface/tile-overlay/tile-overlay.component';
import { LoadingScreenComponent } from './components/game/loading-screen/loading-screen.component';
import { VoteSystemComponent } from './components/game/interface/menu-bar/vote-system/vote-system.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ShowAttribComponent } from './components/game/show-attrib/show-attrib.component';
import { MenuBarComponent } from './components/game/interface/menu-bar/menu-bar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeRegisterComponent } from './components/game/interface/menu-bar/home-register/home-register.component';
import { TrinkBuddyDisplayComponent } from './components/game/interface/menu-bar/home-register/trink-buddy-display/trink-buddy-display.component';
import { ItemsInterfaceComponent } from './components/game/interface/state-display/items-interface/items-interface.component';
import { HistoricResultsDisplayComponent } from './components/game/interface/menu-bar/vote-system/historic-results-display/historic-results-display.component';
import { VoteCreatorComponent } from './components/game/interface/menu-bar/vote-system/vote-creator/vote-creator.component';
import { PlayerIconComponent } from './components/framework/player-icon/player-icon.component';
import { AuthInterceptor } from './AuthInterceptor';
import { HomeComponent } from './components/lobby/home/home.component';
import { FaqComponent } from './components/lobby/faq/faq.component';
import { NewsComponent } from './components/lobby/news/news.component';
import { UpdatesComponent } from './components/lobby/updates/updates.component';
import { ProfileComponent } from './components/lobby/profile/profile.component';
import { SettingsComponent } from './components/lobby/settings/settings.component';
import { CustomEditorComponent } from './components/lobby/custom-editor/custom-editor.component';
import { ChatCommandListComponent } from './components/game/interface/menu-bar/home-register/chat-command-list/chat-command-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { GameHistoryComponent } from './components/lobby/profile/gamehistory/gamehistory.component';
import { EditProfileComponent } from './components/lobby/profile/edit-profile/edit-profile.component';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MdContentComponent } from './components/lobby/md-content-list/md-content/md-content.component';
import { MdContentDirective } from './components/lobby/md-content-list/md-content.directive';
import { MdContentListComponent } from './components/lobby/md-content-list/md-content-list.component';
import { ResolveToHeadlinePipe } from './components/lobby/news/resolve-to-headline.pipe';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'news', pathMatch: 'full' },
      { path: 'news', component: NewsComponent },
      { path: 'lobby', component: LobbyComponent },
      { path: 'faq', component: FaqComponent },
      {
        path: 'profile/:userId',
        component: ProfileComponent,
        children: [
          {
            path: 'gamehistory',
            component: GameHistoryComponent,
          },
        ],
      },
      { path: 'updates', component: UpdatesComponent },
      { path: 'custom', component: CustomEditorComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: PageNotFoundComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'report', component: PageNotFoundComponent },
      { path: 'imprint', component: PageNotFoundComponent },
      { path: 'about', component: PageNotFoundComponent },
      { path: 'credits', component: PageNotFoundComponent },
      { path: '_debug', component: DebugdummyComponent },
    ],
  },
  { path: 'game', component: GameComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    GameDisplayComponent,
    LoginComponent,
    RulesComponent,
    GifViewerComponent,
    RegisterPopupComponent,
    ProfileDisplayComponent,
    LobbyComponent,
    GameComponent,
    PageNotFoundComponent,
    ViewportComponent,
    OpenGamePopupComponent,
    JoinGameComponent,
    InterfaceComponent,
    StateDisplayComponent,
    ConnectedPlayersComponent,
    PregameBannerComponent,
    DebugdummyComponent,
    IngameRuleBookComponent,
    NextTurnButtonComponent,
    TurnOverlayComponent,
    TileOverlayComponent,
    LoadingScreenComponent,
    VoteSystemComponent,
    ShowAttribComponent,
    MenuBarComponent,
    HomeRegisterComponent,
    TrinkBuddyDisplayComponent,
    ItemsInterfaceComponent,
    HistoricResultsDisplayComponent,
    VoteCreatorComponent,
    PlayerIconComponent,
    HomeComponent,
    FaqComponent,
    NewsComponent,
    UpdatesComponent,
    ProfileComponent,
    SettingsComponent,
    CustomEditorComponent,
    ChatCommandListComponent,
    GameHistoryComponent,
    EditProfileComponent,
    MdContentComponent,
    MdContentDirective,
    MdContentListComponent,
    ResolveToHeadlinePipe,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes, // ,{ enableTracing: true } // <-- debugging purposes only
      { relativeLinkResolution: 'legacy' }
    ),
    ReactiveFormsModule,
    DragDropModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatSlideToggleModule,
    CdkStepperModule,
    NgbCarouselModule,
    NgbPopoverModule,
    MarkdownToHtmlModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'de' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
