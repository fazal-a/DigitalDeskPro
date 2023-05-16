import { Subject } from 'rxjs';

class MessageCountService {
  constructor() {
    this.activeTabChat = false;
    this.messageCount = 0;

    this.messageCountSource = new Subject();
    this.messageCount$ = this.messageCountSource.asObservable();

    this.activeTabChatSource = new Subject();
    this.activeTabChat$ = this.activeTabChatSource.asObservable();
  }

  setMessageCount(value) {
    this.messageCount = value;
    this.messageCountSource.next(value);
  }

  getMessageCount() {
    return this.messageCount;
  }

  setActiveTabChat(value) {
    this.activeTabChat = value;
    this.activeTabChatSource.next(value);
  }
}

export default MessageCountService;
