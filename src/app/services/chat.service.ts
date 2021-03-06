import { Injectable } from '@angular/core';
import { ColyseusNotifyable } from './game-initialisation.service';
import { MessageType, WsData } from '../model/WsData';
import { GameStateService } from './game-state.service';
import { ChatMessage } from '../components/game/interface/menu-bar/home-register/helpers/ChatMessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements ColyseusNotifyable {
  messageCallback: () => void;
  private gameState: GameStateService;
  private chatMessages: ChatMessage[] = [];

  attachColyseusStateCallbacks(gameState: GameStateService): void {
    return;
  }

  attachColyseusMessageCallbacks(gameState: GameStateService): void {
    this.gameState = gameState;

    gameState.registerMessageCallback(MessageType.CHAT_MESSAGE, {
      filterSubType: -1,
      f: (data: WsData) => {
        if (data.type === MessageType.CHAT_MESSAGE) {
          const dn = this.gameState.getDisplayName(data.authorLoginName);
          this.onChatMessageReceived(data.message, dn || data.authorLoginName);
        }
      },
    });

    gameState.registerMessageCallback(MessageType.JOIN_MESSAGE, {
      filterSubType: -1,
      f: (data: WsData) => {
        if (data.type === MessageType.JOIN_MESSAGE) {
          this.onChatMessageReceived(data.message, 'SERVER');
        }
      },
    });

    gameState.registerMessageCallback(MessageType.LEFT_MESSAGE, {
      filterSubType: -1,
      f: (data: WsData) => {
        if (data.type === MessageType.LEFT_MESSAGE) {
          this.onChatMessageReceived(data.message, 'SERVER');
        }
      },
    });

    gameState.registerMessageCallback(MessageType.SERVER_MESSAGE, {
      filterSubType: -1,
      f: (data: WsData) => {
        if (data.type === MessageType.SERVER_MESSAGE) {
          this.onChatMessageReceived(data.message, data.origin);
        }
      },
    });
  }

  sendMessage(currentMessage: string) {
    if (this.gameState !== undefined) {
      this.gameState.sendMessage(MessageType.CHAT_MESSAGE, { type: MessageType.CHAT_MESSAGE, message: currentMessage });
    }
  }

  addLocalMessage(msg: string, sender: string): void {
    this.chatMessages.push(new ChatMessage(msg, sender));
    if (this.messageCallback) {
      this.messageCallback();
    }
  }

  getChatMessages(): ChatMessage[] {
    return this.chatMessages;
  }

  setMessageCallback(cb: () => void): void {
    this.messageCallback = cb;
  }

  onChatMessageReceived(msg: string, sender: string): void {
    this.chatMessages.push(new ChatMessage(msg, sender));
    console.log('New Chatmessage: "' + msg + '"', this.chatMessages);
    if (this.messageCallback) {
      this.messageCallback();
    }
  }
}
