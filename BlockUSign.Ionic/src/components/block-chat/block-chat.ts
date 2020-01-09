import { Component, Input, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DocumentService } from './../../services/document.service';
import { Document, Log, Message } from './../../models/models';
import { Events } from 'ionic-angular';
import { BlockStackService } from '../../services/blockstack.service';
import * as moment from 'moment';
import { last } from 'rxjs/operator/last';
declare let $: any;
declare let jslinq: any;

/**
 * https://codepen.io/mehmetmert/pen/zbKpv
 */
@Component({
  selector: 'block-chat',
  templateUrl: 'block-chat.html',
})
export class BlockChatComponent implements OnDestroy, OnInit, AfterViewInit {

  public doc: Document;
  public message;
  public subscription;
  public chatSubscription;
  public chatPolling;
  public msgCount = 0;
  public msgCountNew = 0;
  public messages; 
  firstLoad = true;
  @ViewChild("liveChat")liveChat: ElementRef;
  
  constructor(
    public documentService: DocumentService,
    public events: Events,
    public blockstackService: BlockStackService
  ) {

  }

  ngOnInit() {
    this.firstLoad = true;
    this.doc = new Document();
  }

  ngAfterViewInit() {
    
    if (this.documentService.currentDoc) {
      this.doc = this.documentService.currentDoc;
      this.initChatPolling();
    }
    else {
      this.subscription = this.events.subscribe('documentService:setCurrentDoc', async (currentDoc) => {
        this.doc = currentDoc;
        this.initChatPolling();
      });
    }
  }


  registerEmojiEvent(){
    $(document).on("click", ".emoji-picker", function (e) {
      e.stopPropagation();
      $('.intercom-composer-emoji-popover').toggleClass("active");
    });
    $(document).click(function (e) {
      if ($(e.target).attr('class') != '.intercom-composer-emoji-popover' && $(e.target).parents(".intercom-composer-emoji-popover").length == 0) {
        $(".intercom-composer-emoji-popover").removeClass("active");
      }
    });
    $(document).on("click", ".intercom-emoji-picker-emoji", function (e) {
      if (e.target.className == "intercom-emoji-picker-emoji"){
        let existing = $(".emojiDiv").val();
        let emo =  $(this).html();
        $(".emojiDiv").val( existing + emo );
      }
    });
    $('.intercom-composer-popover-input').on('input', function () {
      var query = this.value;
      if (query != "") {
        $(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
      }
      else {
        $(".intercom-emoji-picker-emoji").show();
      }
    });
  }

  destroyEmojiEvents() {
    
    this.firstLoad = true;
    $(document).off("click", ".emoji-picker");
    $(document).off("click");
    $('.intercom-composer-popover-input').off('input');

  }

  initChatPolling() {

    if (this.documentService.currentDoc.isCompleted){
      console.log('This document is locked ' + this.documentService.currentDoc.guid);
    }

    if (this.documentService.chatInterval){
      clearInterval(this.documentService.chatInterval);
    }

    this.getLogData();
    this.documentService.chatInterval = setInterval(() => {
      setTimeout(() => { // hack?
        this.getLogData();
      }, 1000);
    }, 5000);

  }


  ngOnDestroy() {

    clearInterval(this.documentService.chatInterval);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }

  }

  ionViewWillLeave(){
    this.ngOnDestroy();
  }

  async getLogData() {

    $(document).ready(async () => {

      let logData: Log;
     
      logData = await this.documentService.getLog(this.doc.guid);
    

      //$('.chat-head').last().html(this.doc.fileName);

      let template = "";

      if (!logData) {
        $(".loadSpin").hide();
        return;
      }

      this.msgCountNew = logData.messages.length;

      if (this.msgCountNew > this.msgCount || $('.log-history').last().children().length == 0  ) {
        this.msgCount = this.msgCountNew;
        let orderedMessages = jslinq(logData.messages).orderBy((el) => el.updatedAt).toList();
        this.messages = orderedMessages;
        
        
        
        for (let item of orderedMessages) {
  
          let d = item.updatedAt;
          let formatDate = moment(d).calendar(null, {
            sameElse: 'MMMM Do,YYYY hh:mm a'
        });
  
          let uid = item.createdBy;
          try {
            uid = item.createdBy.replace('.id', '').replace('.', '-');
          }
          catch (e) { console.log('user does not have .id or a special char in name') };
  
          let uName = item.createdByName;
          let uidClass = 'block-pic-' + uid;
  
          this.blockstackService.getPicUrl(item.createdBy).then((picUrl) => {
            setTimeout(()=>{
              $('.' + uidClass).attr('src', picUrl);
            }, 250);            
          });
  
          template = template + `  
          <div class="chat-message clearfix">
          <img class="${uidClass}" src="./assets/gravatar.png" alt="" width="32" height="32">
          <div class="chat-message-content clearfix">
            <span class="chat-time">${formatDate}</span>
            <h5>${item.createdBy}</h5>
            <p>${item.message}</p>
          </div> 
          </div>
          <hr style='margin-top:5px' />
          `;
        }

        setTimeout( ()=> {
          $('.log-history').last().html(template);
          $('.chat-history').last().scrollTop($('.log-history').last().height());
        }, 250);
        
      }
      this.firstLoad = false;
      $(".loadSpin").hide();
    });


  }

  minimize() {
    $('.chat').slideToggle(300, 'swing');
    $('.chat-message-counter').fadeToggle(300, 'swing');
  }

  async addMessage() {
    

    setTimeout(async ()=>{
      $(".loadSpin").show();
      this.message = $(".emojiDiv").last().val();
      //$('.log-history').append(this.message);
      await this.documentService.addMessage(this.doc.guid, this.message);
      // this.events.publish('documentService:addedChat', this.message);
      this.message = null;
      this.firstLoad = true;
    
      $(".intercom-composer-emoji-popover").removeClass("active");
      // @todo optimize this with lazy load adding of new message
      await this.getLogData();
      
    }, 250);;
     
  }

  hasNoEvents(selector){
    if($._data($(selector)[0]).events == null){
      return true;
    }
    else{
      return false;
    }
  }

  scrollBottom (){

  }

}
