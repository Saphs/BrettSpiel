import {Component, Input, OnInit} from '@angular/core';
import {TranslationService} from '../services/translation.service';
import {User} from '../model/User';
import {GameLobby} from '../model/GameLobby';
import {Translation} from '../model/Translation';
import {Login} from '../model/Login';
import * as hash from '../../../node_modules/object-hash';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OpenGamePopupComponent} from '../open-game-popup/open-game-popup.component';
import {ColyseusClientService} from '../services/colyseus-client.service';
import {Client} from 'colyseus.js';
import {MariaService} from '../services/maria.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  currentUser: User;
  activeGames: GameLobby[] = [];
  translation: Translation;
  gameClient: Client;

  constructor(private dialog: MatDialog, private colyseus: ColyseusClientService) {
    this.gameClient = colyseus.getClient();
    console.log('Received client: ', this.gameClient);
  }

  ngOnInit() {
    this.translation = TranslationService.getTranslations('en');
  }

  create() { // TODO: CLEAN THIS UP !
    const dialogRef: MatDialogRef<OpenGamePopupComponent, string> = this.dialog.open(OpenGamePopupComponent,{
      width: '80%',
      maxWidth: '500px',
      height: '30%',
      maxHeight: '250px',
      data: { user: this.currentUser},
      panelClass: 'modalbox-base'
    });

    dialogRef.afterClosed().subscribe(s => {
      if (s !== undefined) {
        this.gameClient.create('game', { name: s, author: this.currentUser.display_name}).then(suc => {
          // if successfull;
          this.loadAvailableGames();
        }, err => {
            console.log('Could not retrieve info from backend. Is it running?', err);
          });
      } else {
        console.log('Failed to create game dialog output was: ', s);
      }
    });
  }

  onDelete(g: GameLobby) {
    const index = this.activeGames.indexOf(g, 0);
    if (index > -1) {
      this.activeGames.splice(index, 1);
    }
  }

  changeLanguage(lang: string) {
    this.translation = TranslationService.getTranslations(lang);
  }

  login(user) {
    this.currentUser = user;
    this.loadAvailableGames();
  }

  loadAvailableGames() {
    this.gameClient.getAvailableRooms('game').then( suc => {
      this.activeGames = suc.map(room => {
        // TODO: STRONGLY TYPE THIS RETURN VALUE !!
        const g = new GameLobby(
          room.metadata['lobbyName'],
          room.metadata['author'],
          new Date(room['createdAt']),
          room.roomId,
          room.clients
        );
        console.log(g);
        return g;
      });
    }, err => {
      console.log('Could not retrieve data from backend. Is it running?', err);
    });
  }

}
