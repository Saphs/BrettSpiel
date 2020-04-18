import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ColyseusClientService} from '../../services/colyseus-client.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  constructor( private colyseus: ColyseusClientService) { }

  messageHistory: string[] = [];
  historyIndex = 0;

  currentMessage = '';
  chatContent = '';

  @Output() chatCommand = new EventEmitter<string[]>();

  @ViewChild('chat') chatRef: ElementRef;

  ngOnInit(): void {
    this.colyseus.registerCallBack('onChatMessage', data => {
      this.postChatMessage(data.content.message);
      this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
    });
  }

  submitMessage() {
    this.colyseus.getActiveRoom().subscribe( room => {
      if (this.currentMessage.length > 0) {
        this.messageHistory.unshift(this.currentMessage);
        this.historyIndex = 0;

        if (this.currentMessage[0] === '/') {
          this.executeChatCommand();
        } else {
          room.send({type: 'CHAT_MESSAGE', content: { message: this.currentMessage }});
          this.currentMessage = '';
        }
      }
    });
  }

  enter(keyEvent) {
    if (keyEvent.key === 'Enter') {
      this.submitMessage();

    } else if (keyEvent.key === 'ArrowUp') {

      console.log(this.messageHistory.length - 1, this.historyIndex);

      if (this.historyIndex <= this.messageHistory.length - 1) {
        console.log(this.currentMessage[this.historyIndex]);
        this.currentMessage = this.messageHistory[this.historyIndex] || '';
        this.historyIndex = this.historyIndex + 1;
      } else {
        this.historyIndex = 0;
      }

    }
  }

  postChatMessage( msg: string ) {
    this.chatContent =  this.chatContent + '\n' + msg.trim();
  }

  executeChatCommand() {
    const commandString: string = this.currentMessage;
    const args = commandString.split(' ');
    this.currentMessage = '';
    this.chatCommand.emit(args);
  }

}