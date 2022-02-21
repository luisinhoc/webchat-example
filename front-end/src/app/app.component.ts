import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chat', { static: false })
  chat!: ElementRef;

  title = 'webchat';
  answer: any;
  chatClosed = true;
  waiting = false;
  chatBotName = 'zaguilheu';
  messages: any[] = [];
  message: string = '';

  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('user logged socket');
      this.socket.emit('events', 'helloo');
    });

    this.socket.on('new-message', (message: any) => {
      this.waiting = true;
      setTimeout(() => {
        this.waiting = false;
        this.messages.push(message);
        this.scrollToBottom();
      }, 2000);
    });
  }
  ngOnInit(): void {}

  public getMessages() {}

  public chatAction() {
    this.chatClosed = !this.chatClosed;
  }

  public sendMessage() {
    const newMessage = {
      from_user: 'user',
      message: this.message,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    this.socket.emit('new-message', newMessage);
  }

  public scrollToBottom() {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
