import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameActionType, GameShowTile, MessageType } from '../../../../model/WsData';
import { BoardTilesService } from '../../../../services/board-tiles.service';
import { GameStateService } from '../../../../services/game-state.service';
import { ColyseusNotifyable } from '../../../../services/game-initialisation.service';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-tile-overlay',
  templateUrl: './tile-overlay.component.html',
  styleUrls: ['./tile-overlay.component.css'],
})
export class TileOverlayComponent implements ColyseusNotifyable {
  @Input() playerName: string;

  constructor(
    private gameState: GameStateService,
    private boardTiles: BoardTilesService,
    private chatService: ChatService
  ) {}

  attachColyseusStateCallbacks(gameState: GameStateService): void {
    return;
  }

  attachColyseusMessageCallbacks(gameState: GameStateService): void {
    gameState.registerMessageCallback(MessageType.GAME_MESSAGE, {
      filterSubType: GameActionType.showTile,
      f: (data: GameShowTile) => {
        if (data.action === GameActionType.showTile) {
          const header = `${this.playerName} ist auf Feld ${data.tile} gelandet:`;
          const title = `${this.titleOf(data.tile).toUpperCase()}`;
          const desc = `${this.descriptionOf(data.tile)}`;
          const msg = `${header}\n${title}\n\n${desc}`;
          console.log(`[EVENT]: ${msg}`);
          this.print(msg, 'Tiles');
        }
      },
    });
  }

  titleOf(index: number): string {
    const tile = this.boardTiles.getTile(index);
    return tile === undefined ? 'ERROR!' : tile.title;
  }

  descriptionOf(index: number): string {
    const tile = this.boardTiles.getTile(index);
    return tile === undefined ? 'ERROR!' : tile.description;
  }

  private print(msg: string, senderCmd: string) {
    this.chatService.addLocalMessage(msg, 'Console: ' + senderCmd);
  }
}
