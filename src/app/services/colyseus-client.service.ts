import { Injectable } from '@angular/core';
import { Client, Room, RoomAvailable } from 'colyseus.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomMetaInfo } from '../model/RoomMetaInfo';
import { GameState } from '../model/state/GameState';
import { MessageType, WsData } from '../model/WsData';
import { DataChange } from '@colyseus/schema';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface MessageCallback {
  filterSubType: number; // -1/undefined for no filter, otherwise the subtype to filter for
  f: (data: WsData) => void;
}

export interface CreateRoomOpts {
  roomName: string;
  author: string;
  login: string;
  displayName: string;
  tileSetId: number;
  randomizeTiles: boolean;
  enableItems: boolean;
  enableMultipleItems: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ColyseusClientService {
  readonly backendWsTarget = environment.wsEndpoint;

  private client: Client = new Client(this.backendWsTarget);
  private activeRoom: BehaviorSubject<Room<GameState>>;
  private messageCallbacks: Map<MessageType, MessageCallback[]> = new Map<MessageType, MessageCallback[]>([]);
  private onChangeCallbacks: ((changes: DataChange<any>[]) => void)[] = [this.onDataChange.bind(this)];

  availableRooms: BehaviorSubject<RoomAvailable<RoomMetaInfo>[]>;
  myLoginName: string;

  constructor(private router: Router) {
    this.activeRoom = new BehaviorSubject<Room<GameState>>(undefined);
    this.availableRooms = new BehaviorSubject<RoomAvailable<RoomMetaInfo>[]>([]);
  }

  onDataChange(changes: DataChange<any>[]): void {
    changes.forEach((change) => {
      switch (change.field) {
        case 'action':
          break;
      }
    });
  }

  getClient(): Client {
    return this.client;
  }

  getActiveRoom(): Observable<Room<GameState>> {
    return this.activeRoom.asObservable();
  }

  setActiveRoom(newRoom?: Room): void {
    if (newRoom !== undefined) {
      this.updateRoomCallbacks(newRoom);
    }
    console.info('connected to new active Room', newRoom);
    this.activeRoom.next(newRoom);
  }

  createRoom(opts: CreateRoomOpts): void {
    if (opts.roomName !== undefined) {
      this.client.create('game', opts).then((suc) => {
        this.setActiveRoom(suc);
        this.updateAvailableRooms();
        this.myLoginName = opts.login;
        this.router.navigateByUrl('/game');
      });
    }
  }

  joinActiveRoom(roomAva: RoomAvailable<RoomMetaInfo>, loginName: string, displayName: string): void {
    const options = {
      name: undefined,
      author: undefined,
      login: loginName,
      displayName: displayName,
    };
    this.client.joinById(roomAva.roomId, options).then((myRoom: Room) => {
      this.setActiveRoom(myRoom);
      this.myLoginName = loginName;
    });
  }

  watchAvailableRooms(): Observable<RoomAvailable<RoomMetaInfo>[]> {
    return this.availableRooms.asObservable();
  }

  getAvailableRooms() {
    this.client.getAvailableRooms('game').then((rooms) => {
      this.availableRooms.next(rooms);
    });
  }

  updateAvailableRooms(): void {
    this.client.getAvailableRooms('game').then((rooms) => {
      this.availableRooms.next(rooms);
    });
  }

  registerMessageCallback(type: MessageType, cb: MessageCallback): void {
    this.getActiveRoom().subscribe((activeRoom) => {
      if (activeRoom !== undefined) {
        activeRoom.onMessage(type, cb.f);
        activeRoom.state.onChange = this.distributeOnChange.bind(this);
      }
    });
  }

  addOnChangeCallback(cb: (changes: DataChange<any>[]) => void): void {
    this.onChangeCallbacks.push(cb);
  }

  /**
   * Will distribute WsData to callbacks based on the WsData type.
   * @note: Excluded from directly being located inside the "updateRoomCallbacks()" to avoid function nesting.
   * @param data passed on to the callbacks based on its type value.
   */
  private gatherFunctionCalls(data: WsData): void {
    const type: MessageType = data.type;
    const list: MessageCallback[] = this.messageCallbacks.get(type);
    if (list !== undefined && list.length > 0) {
      list.forEach((value: MessageCallback, index: number) => {
        if (value.filterSubType >= 0) {
          if (data['subType'] === value.filterSubType || data['action'] === value.filterSubType) {
            value.f(data);
          }
        } else {
          value.f(data);
        }
      });
    } else {
      console.warn('A server message was not addressed. Call back was undefined', data.type, data);
    }
  }

  private distributeOnChange(changes: DataChange<any>[]) {
    this.onChangeCallbacks.map((f) => f(changes));
  }

  private updateRoomCallbacks(currentRoom?: Room<GameState>): void {
    const onMsg = this.gatherFunctionCalls.bind(this);
    if (currentRoom === undefined) {
      this.getActiveRoom().subscribe((activeRoom) => {
        if (activeRoom !== undefined) {
          // activeRoom.onMessage('', onMsg);
          activeRoom.state.onChange = this.distributeOnChange.bind(this);
        }
      });
    } else {
      // currentRoom.onMessage('', onMsg);
      currentRoom.state.onChange = this.distributeOnChange.bind(this);
    }
  }
}
