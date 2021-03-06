import { Component, Input } from '@angular/core';
import { GameActionType, MessageType } from '../../../../model/WsData';
import { Player } from '../../../../model/state/Player';
import { GameStateService } from '../../../../services/game-state.service';

@Component({
  selector: 'app-pregame-banner',
  templateUrl: './pregame-banner.component.html',
  styleUrls: ['./pregame-banner.component.css'],
})
export class PregameBannerComponent {
  isReady = false;

  @Input()
  players: Player[];

  constructor(private gameState: GameStateService) {}

  readyEvent(): void {
    this.isReady = !this.isReady;
    this.gameState.sendMessage(MessageType.GAME_MESSAGE, {
      type: MessageType.GAME_MESSAGE,
      action: GameActionType.readyPropertyChange,
      isReady: this.isReady,
    });
  }

  countReadyPlayers(): number {
    return this.players.filter((p) => p.isReady).length;
  }
}
