
import {Schema, ArraySchema, MapSchema, type} from '@colyseus/schema';
import {PhysicsEntity, PhysicsEntityVariation} from './WsData';

export class Player extends Schema {
  @type('string')
  displayName: string;
  @type('boolean')
  isCurrentHost: boolean;
  @type('boolean')
  isReady: boolean;
  @type('number')
  figureId: number;
  @type('number')
  figureColor: number;
  @type('number')
  currentTile: number;
}

export class Vector extends Schema {
  @type('number')
  x: number;
  @type('number')
  y: number;
  @type('number')
  z: number;
}
export class Quaternion extends Schema {
  @type('number')
  x: number;
  @type('number')
  y: number;
  @type('number')
  z: number;
  @type('number')
  w: number;
}
export class PhysicsObjectState extends Schema {
  @type('number')
  objectIDPhysics: number;
  @type(Vector)
  position: Vector = new Vector();
  @type(Quaternion)
  quaternion: Quaternion = new Quaternion();
  @type('number')
  entity: PhysicsEntity;
  @type('number')
  variant: PhysicsEntityVariation;
}
export class PhysicsState extends Schema {
  @type({ map: PhysicsObjectState})
  objects = new MapSchema<PhysicsObjectState>();
}
export class GameState extends Schema {
  @type('number')
  round = 1;

  @type('string')
  turn = '';

  @type('string')
  action = 'roll';

  @type({map: Player})
  playerList = new MapSchema<Player>();

  @type('string')
  hostSession = '';

  @type('boolean')
  hasStarted = false;

  @type(PhysicsState)
  physicsState = new PhysicsState();

  @type([ 'string' ])
  rules = new ArraySchema<string>();

  nextRound() {
    this.round += 1;
  }

  setRound( n: number ) {
    this.round = n;
  }

  private asArray<T>(map: MapSchema<T>): T[] {
    const tmpArray: T[] = [];
    for (const id in map) {
      tmpArray.push(map[id]);
    }
    return tmpArray;
  }
}
