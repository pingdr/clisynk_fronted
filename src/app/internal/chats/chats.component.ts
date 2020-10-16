import { Component, OnInit , TemplateRef, AfterViewInit , ViewChildren,QueryList , ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { BsModalRef , BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from '../../services/http.service';
import { ApiUrl } from '../../services/apiUrls';
import { FormControl, FormGroup , FormBuilder } from '@angular/forms';
import { TableModel } from '../../shared/models/table.common.model';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {Subject} from 'rxjs';
import {DeleteContactComponent} from '../../shared/modals/delete-contact/delete-contact.component';
import { MatSidenav } from '@angular/material/sidenav';
import { PushNotificationsService} from 'ng-push';
// import { connect, ConnectOptions, LocalTrack, Room, createLocalTracks, TwilioError } from 'twilio-video';
import { TwilioService } from '../../services/twilio.service';
import { environment } from '../../../environments/environment';

// var FileSaver = require('file-saver');
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  @ViewChild('localVideo' , {static : true}) localVideo: ElementRef;
  @ViewChild('remoteVideo' , {static : true}) remoteVideo: ElementRef;

  mode = new FormControl('over');
  form :FormGroup;
  tab = 'chats';
  tab1 = '';
  chatModel;
  loader = true;
  allSelect = new FormControl();   
  searchName = new FormControl();

  // selected name var
  showSelected = false;
  selectedIndex: number;
  selected: any;
  selectedContactCount = 0;

  groupData = [];
  activeChatList = [];
  massageArray = [];
  message: string = '';
  replayFlag = false;
  replayData;
  forwardData;
  selectedChat: any;
  forwardModalFlag = false;
  forwardMsgContact = [];
  toggled: boolean = false;

  // uplaod media array
  imageArray = [];
  docArray = [];
  videoArray = [];

  //chat search var 
  searchIndex = 0;
  searchArray = [];
  searchFlag = false;

  loading = false;
  forwardArray = [];

  // profile var
  profileImageArray = [];
  profileLinkMsgArray = [];
  openMediaFlag = false;
  openPinMsgFlag = false;
  profilePinArray = [];
  profileMediaArray = [];
  allBlockUsers = [];
  unBlockFlag = false;
  defaultScreenFlag = true;
  toggleProfileOpen = true;
  
  msgTotal : '';
  isLoading = false;
  typingFlag = false;
  mediaFlag = false;
  selectedChatIndex = '';
  searchTotalCount = 0;
  videoSrc = '';

  // call var
  videoCallToken = '';
  room : '';
  videoFlag = false;
  callStatus = "";
  callerName = '';
  callId = "";
  outgoingFlag = false;
  muteFlag = false;
  videoManage = false;
  callChatroomId = '';
  voiceFlag = false;
  voiceCallToken = "";
  outgoingVoiceFlag = false;

  outgoingData = "";
  incomingData = '';


  @ViewChild('scrollMe', { static: false }) scrollDiv;
  modalRef: BsModalRef;
  pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  videoThumbnail = 'assets/images/video-thumbnail.gif'

  // socket var
  socket;
  private url = environment.apiBaseUrl;

  // localstorage data
  accessToken = localStorage.getItem('accessToken');
  adminData = JSON.parse(localStorage.getItem('loginData'));
  adminId: string;
  
  constructor(public http: HttpService, private modalService: BsModalService,private _pushNotifications: PushNotificationsService, 
    private _sanitizer: DomSanitizer , private twilioService: TwilioService) {
    this._pushNotifications.requestPermission();

    this.twilioService.msgSubject.subscribe(r => {
      this.message = r;
    });

    this.adminId = this.adminData && this.adminData._id;
    this.chatModel = new TableModel();
    this.chatModel.contactsType = '';

    this.form = this.http.fb.group({
      contactId : ['']
    })

    let token = this.accessToken;
    this.socket = io(this.url, {
      query: { token },
      transports: ["websocket"],
      reconnection: true,             // whether to reconnect automatically
      reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
      reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
      reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts
    })

    // socket auth event
    this.socket.on('auth', data => {
      if (data) {
        console.log('socket connected', data)
      }
    })

    // socket error event
    this.socket.on('connect_error', data => {
      if (data) {
        this.socket.on('disconnect', () => {
          console.log('socket disconnect error')
        });
      }
    })

  }

  ngOnInit(): void {

    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;

    this.getAllActiveChat(null);
    this.getNewMassages();
    this.getAcknowledgement();
    this.typingMsg();
    window.scrollTo(0,0)
    // this.msgView();
    this.msgReceived();
    this.getVideoCallEvent();
    this.getVoiceCallEvent();
  }

  getVideoCallEvent(){
    this.socket.on('video-call', (data) => {
      if(data.type == 'join'){
        this.videoCallToken = data.accessToken;
        this.room = data.room;
        this.callerName = data.from.name;
        this.callId = data.callId;
        this.callChatroomId = data.chatRoomId;
        if(data.from._id !== this.adminId){
          // this.incomingData = data;
          this.videoFlag = true;
          this.videoManage = true;
          this.outgoingFlag = false;
        }
       else{
          // this.outgoingData = data;
          this.outgoingFlag = true;
          this.videoFlag = false;
          this.outgoingVoiceFlag = false;
          // this.videoCall();
          this.twilioService.startLocalVideo();
        }
      }
      if(data.type == "rejected" || data.type == "ended"){
        this.videoManage = false;
        this.videoFlag = false;
        this.outgoingFlag = false;
        this.twilioService.removeTrack();
      }
      if(data.type == "accepted"){
        this.outgoingFlag = true;
        this.videoManage = true;
        this.videoFlag = false;
        this.videoCall();
        // this.twilioService.startLocalVideo();
      }
      if(data.type == 'userStatus'){
        if(this.selectedChat){
          if(data.onlineUsers && data.onlineUsers.includes(this.callChatroomId)){
            this.callStatus = "Ringing.....";
          }else{
            this.callStatus = "Connecting....";
          }
        }
      }
    }); 
  }

  getVoiceCallEvent(){
    this.socket.on('audio-call', (data) => {
      if(data.type == 'join'){
        this.voiceCallToken = data.accessToken;
        this.room = data.room;
        this.callerName = data.from.name;
        this.callId = data.callId;
        this.callChatroomId = data.chatRoomId;
        if(data.from._id !== this.adminId){
          // this.incomingData = data;
          this.voiceFlag = true;
          this.videoManage = true;
          this.outgoingVoiceFlag = false;
        }
       else{
          // this.outgoingData = data;
          this.outgoingVoiceFlag = true;
          this.voiceFlag = false;
          // this.videoCall();
          // this.twilioService.startLocalVideo();
        }
      }
      if(data.type == "rejected" || data.type == "ended"){
        this.videoManage = false;
        this.voiceFlag = false;
        this.outgoingVoiceFlag = false;
        this.twilioService.removeTrack();
      }
      if(data.type == "accepted"){
        this.outgoingVoiceFlag = true;
        this.videoManage = true;
        this.voiceFlag = false;
        this.voiceCall();
        // this.twilioService.startLocalVideo();
      }
      if(data.type == 'userStatus'){
        if(this.selectedChat){
          if(data.onlineUsers && data.onlineUsers.includes(this.callChatroomId)){
            this.callStatus = "Ringing.....";
          }else{
            this.callStatus = "Connecting....";
          }
        }
      }
    }); 
  }

  acceptVideoCall(){
    this.socket.emit('video-call', {
      chatRoomId: this.callChatroomId,
      type : 'accepted',
      room : this.room ,
      callId : this.callId
    });
    this.outgoingFlag = true;
    this.videoManage = true;
    this.videoFlag = false;
    this.videoCall();
    this.twilioService.startLocalVideo();
  }

  acceptVoiceCall(){
    this.socket.emit('audio-call', {
      chatRoomId: this.callChatroomId,
      type : 'accepted',
      room : this.room ,
      callId : this.callId
    });
    this.outgoingVoiceFlag = true;
    this.videoManage = true;
    this.voiceFlag = false;
    this.voiceCall();
  }

  declineVideoCall(){
    this.socket.emit('video-call', {
      chatRoomId: this.callChatroomId ,
      type : 'rejected',
      room : this.room ,
      callId : this.callId
    });
    this.videoManage = false;
    this.videoFlag = false;
    this.outgoingFlag = false;
  }

  declineVoiceCall(){
    this.socket.emit('audio-call', {
      chatRoomId: this.callChatroomId ,
      type : 'rejected',
      room : this.room ,
      callId : this.callId
    });
    this.videoManage = false;
    this.voiceFlag = false;
    this.outgoingVoiceFlag = false;
  }

  muteCall(){
    this.muteFlag = true;
    this.twilioService.mute();
  }

  unMuteCall(){
    this.muteFlag = false;
    this.twilioService.unmute();
  }

  deleteVideoCall(){
    this.socket.emit('video-call', {
      chatRoomId: this.selectedChat._id ,
      type : 'ended',
      room : this.room ,
      callId : this.callId
    });
    this.videoManage = false;
    this.videoFlag = false;
    this.outgoingFlag = false;
    this.twilioService.removeTrack();
  }

  deleteVoiceCall(){
    this.socket.emit('audio-call', {
      chatRoomId: this.selectedChat._id ,
      type : 'ended',
      room : this.room ,
      callId : this.callId
    });
    this.videoManage = false;
    this.voiceFlag = false;
    this.outgoingVoiceFlag = false;
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    }
  }

  videoCall(){
    this.twilioService.connectToRoom(this.videoCallToken, { name: this.room, audio: true, video: { width: 100 , height : 100 , frameRate : 12  } })
  }

  voiceCall(){
    this.twilioService.connectToRoom(this.voiceCallToken, { name: this.room, audio: true })
  }

  // video call function
  handleVideo(){
    this.videoManage = true;

    this.socket.emit('video-call', {
      chatRoomId: this.selectedChat._id ,
      type : 'new-call'
    });
  }

  // audio call function
  handleAudio(){
    this.videoManage = true;
     // this.outgoingVoiceFlag = true;

    this.socket.emit('audio-call', {
      chatRoomId: this.selectedChat._id ,
      type : 'new-call'
    });

  }

  // group tab
  redirectToGroup(){
    this.tab = 'groups';
    this.getAllGroupData(null);
  }

  // contact tab
  redirectToContact(){
    this.tab = 'allContact';
    this.getAllContact(null);
  }

  // chat search display or not
  displaySearch(){
    this.searchFlag = true;
  }

  // profile media tab
  openMedia(){
    this.tab1 = 'mediaTab';
    this.openMediaFlag = true;
    this.getProfileImages();
  }

  // default open profile
  openMediaProfile(){
    window.scrollTo(0,0);

    this.getProfileImages();
  }

  // profile pin msgs
  openPinMsg(){
    this.openPinMsgFlag = true;
    let payload = {
      chatRoomId : this.selectedChat._id
    }
    this.http.getData(ApiUrl.PROFILE_PIN_MSG, payload).subscribe(async res => {
      if(res.data && res.data[0].messages){
        this.profilePinArray = res.data[0].messages.reverse();
      }
    })
  }

  // modal open for clear chat confirmation
  clearChatModal(openClearChatModal: TemplateRef<any>){
    this.modalRef = this.modalService.show(
      openClearChatModal,
      Object.assign({}, { class: 'gray modal-xs' })
    );
  }

  // clear chat
  clearChat(){
    let payload = {
      chatRoomId : this.selectedChat._id
    }
    this.http.postData(ApiUrl.CLEAR_CHAT, payload).subscribe(async res => {
      if(res){
        this.massageArray = [];
      }
    })
  }

  // close profile
  closeProfile(){
    this.openMediaFlag = false;
    this.openPinMsgFlag = false;
  }

  // back arrow from profile pages
  clickProfileBack(){
    this.toggleProfileOpen = true;
    this.openMediaFlag = false;
    this.openPinMsgFlag = false;
    this.profileLinkMsgArray = [];
    this.profileMediaArray = [];
    this.tab1 = '';
  }

  // block contact
  blockContact(){
    let payload = {
      userId : this.selectedChat.temp._id
    }
    this.http.postData(ApiUrl.BLOCK_USER, payload).subscribe(async res => {
      if(res){
        this.allBlockUsers.push(this.selectedChat.temp._id)
      }
    })
  }

  // get profile images
  getProfileImages(){
    let payload = {
      chatRoomId : this.selectedChat._id,
      type : 'MEDIA'
    }
    this.profileImageArray = [];
    this.http.getData(ApiUrl.CHAT_MSG, payload).subscribe(async res => {
      this.profileMediaArray = res.data.data;
      res.data && res.data.data.map((img) => {
        if(img.file.type === 'IMAGE'){
          this.profileImageArray.push(img);
        }
      })
    })

  }

  // get profile links
  getProfileLink(){
    const obj = {
      chatRoomId: this.selectedChat._id
    };
    this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res =>  {
      if(res.data.data){
        this.profileLinkMsgArray = await (res.data.data).reverse();
      }
    })
  }

  // close chat search
  closeSearchChat(){
    // this.searchArray = [];
    this.searchFlag = false;
  }

  // chat serach handle
  handleSearch(value) {
    this.searchFlag = true;
    if (value !== '') {
      let payload = {
        chatRoomId: this.selectedChat._id,
        search: value
      }
      this.http.getData(ApiUrl.MSG_SEARCH, payload).subscribe(async res => {
        if (res.data.data.length > 0) {
          this.searchArray = [];
          this.searchIndex = 0;
          this.searchTotalCount = res.data.totalCount
         await res.data.data.map((msg) => {
            this.searchArray.push(msg._id)
          });
          let msgId = await this.searchArray[0];
          document.getElementById(msgId).scrollIntoView({ behavior : 'smooth' , block :'start' , inline : 'center'});
        }
      })
    }
    else{
      this.searchArray = [];
      this.searchIndex = 0;
      this.searchFlag = false;
      this.searchTotalCount = 0;
    }
  }

  // scroll to bottom button
  scrollToBottom(){
    let temp = this.massageArray.length;
    let index = this.massageArray[temp - 1]._id;
    document.getElementById(index).scrollIntoView({ behavior : 'smooth' , block :'end' })
  }

  // chat , gorup , contacts search
  generalSearch(event){
    this.searchName = event.target.value;
      if(this.tab === 'chats'){
        this.getAllActiveChat(event.target.value);
      }
      else if(this.tab === 'groups'){
        this.getAllGroupData(event.target.value);
      }
      else{
        this.getAllContact(event.target.value);
      }
   
  }

  //forward modal search
  forwardSearch(event){
    let value = event.target.value;
    this.loader = true;
    this.forwardArray = [];
    let payload = {
      search : value ? value : ''
    }
    this.http.getData(ApiUrl.CHAT_ROOM, payload, false).subscribe(async res => {
      if (res && res.data) {
        this.loader = false;
        let array = [];
        const promise = res.data.map(async element => {
          array = [...element.users , ...element.admins] 
          array.filter((admin) => {
              if(admin._id !== this.adminId){
                element.temp = admin;
              }
            })
            return element
        });
        const results = await Promise.all(promise);
        this.forwardArray = results;
      }
    })
  }

  // chat serach scroll up
  handleSearchScrollUp(){
    this.searchIndex = this.searchIndex + 1;
    let msgId =  this.searchArray[this.searchIndex];
    document.getElementById(msgId).scrollIntoView({ behavior : 'smooth' , block :'start' , inline : 'center'});  
  }

  // chat search scroll down
   handleSearchScrollDown(){
    this.searchIndex = this.searchIndex - 1;
    let msgId =  this.searchArray[this.searchIndex];
    document.getElementById(msgId).scrollIntoView({ behavior : 'smooth', block :'start' , inline : 'center'});
    
  }

  // select emoji
  handleSelection(event) {
    this.message += event.char;
  }

  // select all chat for delete
  selectAllContact() {
    if (this.allSelect.value) {
        this.showSelected = !this.showSelected;
        this.activeChatList.forEach((val) => {
            val.isSelected = true;
        });
        this.getSelectedCount();
    } else {
        this.activeChatList.forEach((val) => {
            val.isSelected = false;
        });
        this.selectedContactCount = 0;
    }
}

// get selected delete count
getSelectedCount() {
  let tempCount = 0;
  this.activeChatList.forEach((val) => {
      if (val.isSelected) {
          tempCount++;
      }
  });
  this.selectedContactCount = tempCount;
}

// delete chatroom
deleteChatroom(){
  const modalRef = this.http.showModal(DeleteContactComponent, 'xs', this.activeChatList);
  modalRef.content.onClose = new Subject<boolean>();
  modalRef.content.onClose.subscribe(() => {
      this.selectedChat = {};
      this.selectedContactCount = 0;
      this.http.openSnackBar('Contact have been deleted');
      this.getAllActiveChat(null);
      this.http.contactUpdatedChat();
      this.allSelect.patchValue('');
      this.defaultScreenFlag = true;
  });
}

// new msg get from socket
  getNewMassages() {
    this.socket.on('new-message', (data) => {
      this.handlePushNotification(data);
      this.massageArray = [...this.massageArray, data];
    });
  }

  // push notification function
  handlePushNotification(data) {
    if (data.chatRoomId !== (this.selectedChat && this.selectedChat._id)) {      

      let options = { 
        body: data.content,
        icon: "assets/images/chat-notify-img.png" 
      }
      let userName;
      this.activeChatList.map((user) => {
        if ((user.temp && user.temp._id) == (data.from && data.from.user)) {
          userName = user.temp.name;
          user.unreadCount = (user.unreadCount ? user.unreadCount : 0) + 1;
          user.lastMessage.content = data.content; 
        }
      });

      this._pushNotifications.create(userName, options).subscribe( 
        res => console.log(res),
        err => console.log(err)
      );
    }
  }


  // socket ack. event
getAcknowledgement() {
    this.socket.on('ack', (data) => {
      this.replayFlag = false;
      this.replayData = false;
      this.message = '';
      this.forwardMsgContact = [];
      this.forwardData = '';
      if(data.message.chatRoomId == this.selectedChat._id){
        this.massageArray = [...this.massageArray, data.message]; 
        this.manageScroll();
      }
      this.activeChatList.map((user) => {
        if (user._id == data.message.chatRoomId) {
          user.lastMessage.content = data.message.content; 
        }
      });
    });
  }

  // get socket typing events
  typingMsg(){
    this.socket.on('typing', (data) => {
      if (data.chatRoomId == (this.selectedChat && this.selectedChat._id)) {
        this.typingFlag = true;
      }
    });
    this.socket.on('not-typing', (data) => {
      if (data.chatRoomId == (this.selectedChat && this.selectedChat._id)) {
        this.typingFlag = false;
      }
    });
  }

  // scroll to msgs and default scroll to bottom
  manageScroll() {
      let len = this.massageArray.length - 1;
      let msgId = this.massageArray[len];
      setTimeout(() => {
        document.getElementById(msgId._id).scrollIntoView({ block: 'end' })
      }, 50);
  }

  // forward msg contact select - unselect
  onContactSelect(item) {
    var temp = this.forwardMsgContact.findIndex(o => o._id == item._id);
    if (temp === -1) {
      this.forwardMsgContact.push(item);
    }
    else {
      this.forwardMsgContact.map((data, index) => {
        if (data._id === item._id) {
          this.forwardMsgContact.splice(index, 1)
        }
      })
    }
  }

  // forward msg socket event
  sendForwardMsg(){
    this.forwardMsgContact.map((chatRoomId) => {
      this.socket.emit('forward', {
        chatRoomId: chatRoomId,
        messageIds: [this.forwardData._id]
      });
    });
  }

  // manage unread count using socket emit view event
  msgView() {
    let array = this.massageArray;
    if ((array.length > 0 ) && (array[array.length - 1].isViewed === false) && (array[array.length - 1].from.user !== this.adminId)) {
      this.socket.emit('viewed', {
        chatRoomId: this.selectedChat._id,
        messageId: this.massageArray[0]._id
      });
      this.activeChatList[this.selectedChatIndex].unreadCount = 0;
    }
  }

  // msg viewed socket event get
  msgReceived() {
    this.socket.on('viewed', (data) => {
      this.massageArray.map((msg) => {
        if(msg._id == data.messageId){
          msg.isViewed = true;
        }
      })
    });
  }

  // chat send msg
  sendMessage(value) {
      if (value !== '') {
        let timestamp = new Date().valueOf().toString();
        this.message = value;
        if (this.replayFlag === false) {
          this.socket.emit('new-message', {
            chatRoomId: this.selectedChat._id,
            message: { content: this.message, ref: null },
            code: timestamp
          });
        }
        else {
          this.socket.emit('new-message', {
            chatRoomId: this.selectedChat._id,
            message: { content: this.message, ref: this.replayData._id }
          });
        }
      }
  }

  // chat uplaod img
  uploadImage(){
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'IMAGE',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from : {
        user : this.adminId
      },
      loading : true,
      pinnedBy : [],
    }
    var length = this.imageArray.length;
    for(var i=1;i<=length; i++){
      temp.push({...obj , _id : `1${i+1}` })
    }
 
    this.massageArray = [...this.massageArray , ...temp];
    this.manageScroll();
    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);

     this.imageArray.map(singleImage  => {
      formData.append('file', singleImage.file)
    });

    if(this.replayFlag === true){
      formData.append('ref', this.replayData._id)
    }
    this.imageArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
      this.massageArray = _.without(this.massageArray , ...temp);
      this.massageArray = [...this.massageArray , ...res.data];
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
    })
  }

  // update msg in sidebar when get new msg
  sidebarUpdateMsg(data){
    this.activeChatList.map((user) => {
      if ((user._id) == data[0].chatRoomId) {
        user.lastMessage.content = data[0].file && data[0].file.type; 
      }
    });
  }

  // chat uplaod doc
  uploadDoc(){
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'OTHER',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from : {
        user : this.adminId
      },
      loading : true ,
      pinnedBy : [],
    }
    var length = this.docArray.length;
    for(var i=1;i<=length; i++){
      temp.push({...obj ,_id : `1${i+1}` })
    }
    this.massageArray = [...this.massageArray , ...temp];
    this.manageScroll();
    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);
     this.docArray.map(singleDoc  => {
      formData.append('file', singleDoc.file)
    });
    if(this.replayFlag === true){
      formData.append('ref', this.replayData._id)
    }

    this.docArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
      this.massageArray = _.without(this.massageArray , ...temp);
      this.massageArray = [...this.massageArray , ...res.data];
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
      this.loading = false;
    })
  }

  // chat uplaod video
  uploadVideo(){
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'VIDEO',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from : {
        user : this.adminId
      },
      loading : true,
      pinnedBy : [],
    }
    var length = this.videoArray.length;
    for(var i=1;i<=length; i++){
      temp.push({...obj , _id : `1${i+1}`})
    }
    this.massageArray = [...this.massageArray , ...temp];
    this.manageScroll();

    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);
  
     this.videoArray.map(singleVideo  => {
      formData.append('file', singleVideo.file)
    });

    if(this.replayFlag === true){
      formData.append('ref', this.replayData._id)
    }

    this.videoArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
      this.massageArray = _.without(this.massageArray , ...temp)
      this.massageArray = [...this.massageArray , ...res.data];
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
    })
  }

  // delete msg socket event
  deleteMsg(chat) {
    this.socket.emit('deleted', {
      messageId: chat._id,
      chatRoomId: this.selectedChat._id
    });
    this.massageArray.filter((data,index) => {
      if(data._id === chat._id){
        this.massageArray.splice(index , 1)
      }
    })
  }

  // replay msg 
  replayMsg(chat){
    this.replayFlag = true;
    this.replayData = chat;
  }

  // remove replay msg
  closeReplayMsg(){
    this.replayFlag = false;
    this.replayData = '';
  }

  // forward msg modal
  forwardMsg(openForwardModal: TemplateRef<any>,chat) {
    this.forwardData = chat;
    this.forwardModalFlag = true;
    this.forwardArray = this.activeChatList;
    this.modalRef = this.modalService.show(
      openForwardModal,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  // pin msg
  pinMsg(chat){
    let payload = {
      messageId : chat._id
    }
    this.http.postData(ApiUrl.PIN_MSG, payload).subscribe(res => {
        this.massageArray.map((msg , index) => {
          if(chat._id == msg._id){
              this.massageArray[index].pinnedBy = this.adminId 
          }
        })
    })
  }

  // unpin msg
  unpinMsg(chat){
    let payload = {
      messageId : chat._id
    }
    this.http.postData(ApiUrl.UNPIN_MSG, payload).subscribe(res => {
      this.massageArray.map((msg , index) => {
        if(chat._id == msg._id){
            this.massageArray[index].pinnedBy = [] 
        }
      })
    })
  }

  // unpin msg from profile
  unPinFromProfile(chat){
    let payload = {
      messageId : chat._id
    }
    this.http.postData(ApiUrl.UNPIN_MSG, payload).subscribe(res => {
      this.profilePinArray.map((msg , index) => {
        if(chat._id == msg._id){
            this.profilePinArray.splice(index , 1)
        }
      });
      this.massageArray.map((msg , index) => {
        if(chat._id == msg._id){
            this.massageArray[index].pinnedBy = [] 
        }
      })
    })
  }

  // get all conatct data
  getAllContact(value) {
    this.defaultScreenFlag = true;
    let payload = {
      search : value ? value : ''
    }
    this.loader = true; 
    this.http.getData(ApiUrl.CHAT_CONTACT_DATA, payload).subscribe(res => {
      this.loader = false;
      this.chatModel.contacts = res.data.data;
      this.chatModel.allData = res.data;
      this.chatModel.totalItems = res.data.totalCount;
    })
  }

  // get all group data
  getAllGroupData(value) {
    this.defaultScreenFlag = true;
    let payload = {
      search : value ? value : ''
    }
    this.loader = true;
    this.http.getData(ApiUrl.CHAT_GROUP_DATA, payload).subscribe(res => {
      if (res) {
        this.loader = false;
        this.groupData = res.data;
      }
    })
  }

  // get active chatroom list
  getAllActiveChat(value) {
    this.loader = true;
    this.activeChatList = [];
    let payload = {
      search : value ? value : ''
    }
    this.http.getData(ApiUrl.CHAT_ROOM, payload, false).subscribe(async res => {
      if (res && res.data) {
        this.loader = false;
        this.massageArray = [];
        let array = [];
        const promise = res.data.map(async element => {
          array = [...element.users , ...element.admins] 
          array.filter((admin) => {
              if(admin._id !== this.adminId){
                element.temp = admin;
              }
            })
            return element
        });
        const results = await Promise.all(promise);
        this.activeChatList = results;
      }
    })
  }

  // get msg for perticular chat
  clickChat(data , index) {
    this.sidenav.close();
    this.defaultScreenFlag = false;
    this.selectedChat = data;
    this.selectedChatIndex = index;
    this.getOldChat();
    this.fetchAllBlockUsers();
  }

  // fetch all block users
  fetchAllBlockUsers(){
    this.http.getData(ApiUrl.FETCH_BLOCK_USERS, {}).subscribe(async res =>  {
      res.data && res.data.map((user) => {
        this.allBlockUsers.push(user._id)
      });
    })
  }

  // unblock user modal
  unBlockUser(openUnBlockModal: TemplateRef<any>){
    this.openPinMsgFlag = false;
    this.unBlockFlag = true;
    this.modalRef = this.modalService.show(
      openUnBlockModal,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  // block user modal
  blockUser(openUnBlockModal: TemplateRef<any>){
    this.openPinMsgFlag = false;
    this.unBlockFlag = false;
    this.modalRef = this.modalService.show(
      openUnBlockModal,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  // unblock user
  unblock(){
    let payload = {
      userId : this.selectedChat.temp._id
    }
    this.http.postData(ApiUrl.UNBLOCK_USER, payload).subscribe(async res =>  {
      if(res){
        let position = this.allBlockUsers.indexOf(payload.userId);
        this.allBlockUsers.splice(position, 1);
      }
    })
  }

  // image select with prerview in chat
  choosePhoto(event){
    if (event.target.files && event.target.files[0]) {
      this.mediaFlag = true;
      var temp = Object.values(event.target.files);
      temp.map((file : any, index) => {
        if (file.type === 'video/mp4') {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.videoArray.push({ file, url: event.target.result });
          }
          reader.readAsDataURL(event.target.files[index]);
        }
        else{
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageArray.push({ file, url: event.target.result });
          }
          reader.readAsDataURL(event.target.files[index]);
        }
      })

    }
  }

  // doc select with preview
  chooseDoc(event){
    if (event.target.files && event.target.files[0]) {
      this.mediaFlag = true;

      var temp = Object.values(event.target.files);
      temp.map((file, index) => {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.docArray.push({ file, url: event.target.result });
        }
        reader.readAsDataURL(event.target.files[index]);
      })
    }
  }

  // delete img from preview imgs before uplaod
  deleteImage(url , index){
    this.imageArray.splice(index , 1)
  }

   // delete video from preview video before uplaod
  deleteVideo(url , index){
    this.videoArray.splice(index , 1)
  }

  // delete doc from preview doc before uplaod
  deleteDoc(url , index){
    this.docArray.splice(index , 1)
  }

  // get chat old data
  getOldChat() {
    const obj = {
      chatRoomId: this.selectedChat._id,
      limit : 50,
      skip : 0
    };
    this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res =>  {
      this.massageArray = await (res.data.data).reverse();
      this.msgTotal = res.data.totalCount;
      this.manageScroll();
      this.msgView()
    })
  }

  // manage socket typing event
  textChange(event: any){
    if(event.target.value.length > 0){
      this.socket.emit('typing', { chatRoomId: this.selectedChat._id });

      setTimeout(() => {
        this.socket.emit('not-typing', { chatRoomId: this.selectedChat._id });
      }, 2000);
    }
  }

  // call api on scroll up
  onScroll(event){
  
    const startingScrollHeight = event.target.scrollHeight;
    if (event.target.scrollTop < 100) {
      if ((this.massageArray.length < Number(this.msgTotal)) && !this.isLoading) {
        const obj = {
          chatRoomId: this.selectedChat._id,
          limit : 50,
          skip : this.massageArray.length
        };
        this.isLoading = true;
        this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res =>  {
          const data = await (res.data.data);
          this.massageArray = [...data, ...this.massageArray];
          this.isLoading = false;

          setTimeout(() => {
            const newScrollHeight = this.scrollDiv.nativeElement.scrollHeight;
            // set the scroll height from the difference of the new and starting scroll height
            this.scrollDiv.nativeElement.scrollTo(0, newScrollHeight - startingScrollHeight);
          });
        })
      }
    }
  }

  // create chatroom from conatct
  createChatRoom(data) {
    let payload = {
      chatType: 'PRIVATE',
      dataId: data._id
    }
    this.defaultScreenFlag = false;
    this.selectedChat = data;
    this.http.postData(ApiUrl.CREATE_CHATROOM, payload).subscribe(async res => {
      if (res && res.data) {
        let array = [];
          array = [...res.data.users , ...res.data.admins] 
          array.filter((admin) => {
              if(admin._id !== this.adminId){
                res.data.temp = admin;
              }
          })
        this.selectedChat = res.data;
        this.getOldChat();
      }
    })
  }

  // create chatrrom from group
  createChatRoomGroup(data){
    let payload = {
      chatType: 'GROUP',
      dataId: data._id,
      groupDetails: {
        name : data.name
      }
    }

    this.defaultScreenFlag = false;
    this.selectedChat = data;
    this.http.postChatImage(ApiUrl.CREATE_CHATROOM, payload).subscribe(async res => {
      if (res && res.data) {
        let array = [];
          array = [...res.data.users , ...res.data.admins] 
          array.filter((admin) => {
              if(admin._id !== this.adminId){
                res.data.temp = admin;
              }
          })
        this.selectedChat = res.data;
        this.getOldChat();
      }
    })
  }

  // preview image
  previewImage(url){
    this.http.openLightBox(url)
  }

  // preview file
  previewFile(url , name){
    FileSaver.saveAs(url, name);
  }

  playVideo(src) {
    this.videoSrc = src;
    $('#myModal').on('show', function (e) {
      
    });
    $('#myModal').on('hide.bs.modal', function (e) {
      // a poor man's stop video
      $("#video").attr('src', src);
    })
  }

  videoURL(){
    if(this.videoSrc){
      return this._sanitizer.bypassSecurityTrustResourceUrl(this.videoSrc)
    }
  }

}
