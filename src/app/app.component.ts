import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from '../../api/server/collections';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { Chat } from 'api/server/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  chats;

  constructor() { }

  ngOnInit() {
    this.chats = Chats.find({})
      .mergeMap((chats: Chat[]) => Observable.combineLatest(...chats.map((chat: Chat) => Messages
        .find({ chatId: chat._id })
        .startWith(null)
        .map(messages => {
          if (messages) chat.lastMessage = messages[0];
          return chat;
        })))
      ).zone();
  }

  removeChat(chat: Chat): void {
    Chats.remove({_id: chat._id}).subscribe(() => {});
  }
}
