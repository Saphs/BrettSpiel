import * as THREE from 'three';
import {ColyseusClientService} from '../../services/colyseus-client.service';
import {
  MessageType,
  PhysicsCommand,
  PhysicsCommandAddEntity,
  PhysicsCommandAngular,
  PhysicsCommandKinematic,
  PhysicsCommandPosition,
  PhysicsCommandQuat,
  PhysicsCommandRemove,
  PhysicsCommandType,
  PhysicsCommandVelocity,
  PhysicsEntity,
  PhysicsEntityVariation,
  WsData
} from '../../model/WsData';
import {GameState, PhysicsObjectState} from '../../model/GameState';
import {Room} from 'colyseus.js';
import {ObjectUserData} from './viewport.component';
import {ObjectLoaderService} from '../../services/object-loader.service';
import {BoardItemManagement} from './BoardItemManagement';
import {Object3D} from 'three';

export enum CollisionGroups {
  All = 15,
  Other = 1,
  Plane = 2,
  Figures = 4,
  Dice = 8
}
export class PhysicsCommands {
  scene: THREE.Scene;
  colyseus: ColyseusClientService;

  currentlyLoadingEntities: Map<number, boolean> = new Map<number, boolean>();
  constructor(colyseus: ColyseusClientService, private loader: ObjectLoaderService, private itemManagement: BoardItemManagement) {
    this.colyseus = colyseus;
    this.colyseus.getActiveRoom().subscribe((activeRoom: Room<GameState>) => {
      activeRoom.state.physicsState.objects.onChange = (item: PhysicsObjectState, key: string) => {
        const obj = PhysicsCommands.getObjectByPhysId(this.scene, item.objectIDPhysics);
        // console.log('query for physId', item.objectIDPhysics, obj);
        if (obj !== undefined) {
          obj.position.set(item.position.x, item.position.y, item.position.z);
          obj.quaternion.set(item.quaternion.x, item.quaternion.y, item.quaternion.z, item.quaternion.w);
          // console.log('new Position: ', key, item.position.x, item.position.y, item.position.z, item.position);
          // console.log("rotation is: ", item.quaternion.x, item.quaternion.y, item.quaternion.z, item.quaternion.w);
        } else {
          if (item.entity >= 0 && this.scene.children.length < 40) { // TODO balance
            if (this.currentlyLoadingEntities.get(item.objectIDPhysics)) {
              // is currently getting loaded
            } else {
              this.currentlyLoadingEntities.set(item.objectIDPhysics, true);
              this.generateEntity(item.entity, item.variant, item.objectIDPhysics,
                item.position.x, item.position.y, item.position.z, item.quaternion.x, item.quaternion.y, item.quaternion.z);
            }
          } else {
            console.error('cannot find/generate object', item.objectIDPhysics, item);
          }
        }
      };
    });
    this.colyseus.registerMessageCallback(MessageType.PHYSICS_MESSAGE, {
      filterSubType: PhysicsCommandType.addEntity,
      f: this.addEntity.bind(this)
    });
  }

  static getObjectByPhysId(toSearch: Object3D, physId: number): THREE.Object3D {
    if (toSearch.name !== undefined) {
      // console.log('searching for ' + physId + ' in: ', toSearch.name, toSearch.userData.physicsId, toSearch.userData.physicsId === physId);
    }
    if (toSearch.userData.physicsId === physId) {
      // console.warn('found', toSearch);
      return toSearch;
    } else {
      const result: Object3D = toSearch.children.find((obj: THREE.Object3D, index: number) => {
        const res = PhysicsCommands.getObjectByPhysId(obj, physId);
        if (res !== undefined) {
          // console.warn('found', res);
          return true;
        }
        return false;
      });
      return result;
    }
  }
  static getPhysId(obj: Object3D): number {
    return obj.userData.physicsId;
  }

  private generateEntity(entity: PhysicsEntity, variant: PhysicsEntityVariation, physicsId: number,
                         posX?: number, posY?: number, posZ?: number, rotX?: number, rotY?: number, rotZ?: number, rotW?: number) {

    this.loader.loadObject(entity, variant, (model: THREE.Object3D) => {
      model.quaternion.set(rotX, rotY, rotZ, rotW);
      model.position.set(posX, posY, posZ);
      const userData: ObjectUserData = {physicsId: physicsId, entityType: entity, variation: variant};
      model.userData = userData;
      console.warn('Adding', model.userData.physicsId, model, physicsId);
      this.scene.add(model);
      // set the various references in other classes
      switch (entity) {
        case PhysicsEntity.dice:
          if (this.itemManagement !== undefined) {
            this.itemManagement.dice = model;
          } else {
            // console.log('cannot set dice');
          }
          break;
      }
      this.currentlyLoadingEntities.set(physicsId, false);
    });
  }
  addEntity(data: WsData) {
    console.error('recieve Adding Call');
    if (data.type === MessageType.PHYSICS_MESSAGE && data.subType === PhysicsCommandType.addEntity) {
      if (data.variant === PhysicsEntityVariation.procedural) {
        // TODO enable procedural generation
      } else {
        this.generateEntity(data.entity, data.variant, data.physicsId,
          data.posX, data.posY, data.posZ, data.rotX, data.rotY, data.rotZ, data.rotW);
      }
    }
  }
  orderEntity(entity: PhysicsEntity, variation?: PhysicsEntityVariation, pos?: THREE.Vector3, quat?: THREE.Quaternion) {
    const data: PhysicsCommandAddEntity = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.addEntity,
      physicsId: undefined,
      entity: entity,
      variant: variation,
      posX: pos ? pos.x : undefined,
      posY: pos ? pos.y : undefined,
      posZ: pos ? pos.z : undefined,
      rotW: quat ? quat.x : undefined,
      rotX: quat ? quat.y : undefined,
      rotY: quat ? quat.z : undefined,
      rotZ: quat ? quat.w : undefined,
      color: 0,
    };
    this.colyseus.getActiveRoom().subscribe( room => {
      if (data !== undefined) {
        room.send(data);
      }
    });
  }
  setKinematic(physId: number, enabled: boolean) {
    console.log('setting kinematic ', physId, enabled);
    const msg: PhysicsCommandKinematic = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.kinematic,
      objectID: physId,
      kinematic: enabled
    };
    this.sendMessage(msg);
  }
  setPositionVec(physId: number, vec: THREE.Vector3) {
    this.setPosition(physId, vec.x, vec.y, vec.z);
  }
  setPosition(physId: number, x: number, y: number, z: number) {
    const msg: PhysicsCommandPosition = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.position,
      objectID: physId,
      positionX: x,
      positionY: y,
      positionZ: z
    };
    this.sendMessage(msg);
  }
  setRotationQuat(physId, quat: THREE.Quaternion) {
    this.setRotation(physId, quat.x, quat.y, quat.z, quat.w);
  }
  setRotation(physId: number, x: number, y: number, z: number, w: number) {
    const msg: PhysicsCommandQuat = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.quaternion,
      objectID: physId,
      quaternionX: x,
      quaternionY: y,
      quaternionZ: z,
      quaternionW: w
    };
    this.sendMessage(msg);
  }
  setVelocity(physId: number, x: number, y: number, z: number) {
    const msg: PhysicsCommandVelocity = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.velocity,
      objectID: physId,
      velX: x,
      velY: y,
      velZ: z
    };
    this.sendMessage(msg);
  }
  setAngularVelocity(physId: number, x: number, y: number, z: number) {
    const msg: PhysicsCommandAngular = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.angularVelocity,
      objectID: physId,
      angularX: x,
      angularY: y,
      angularZ: z,
    };
    this.sendMessage(msg);
  }
  removePhysics(physId: number) {
    const cmd: PhysicsCommandRemove = {
      type: MessageType.PHYSICS_MESSAGE,
      subType: PhysicsCommandType.remove,
      objectID: physId,
    };
  }
  private sendMessage(msg: PhysicsCommand) {
    this.colyseus.getActiveRoom().subscribe( room => {
      if (msg !== undefined) {
        room.send(msg);
      }
    });
  }
}
