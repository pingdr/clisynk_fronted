import { Injectable, ElementRef } from '@angular/core';
import { connect, createLocalVideoTrack } from 'twilio-video';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TwilioService {

  localVideo: ElementRef;
  remoteVideo: ElementRef;
  previewing: boolean;
  roomObj: any;
  msgSubject = new BehaviorSubject("");
  microphone = true;
  roomParticipants;

  constructor() {

  }

  connectToRoom(accessToken: string, options): void {
    connect(accessToken, options).then(room => {
      console.log('success...', room)
      this.roomObj = room;
      this.roomParticipants = room.participants;

      //if participent already in room
      room.participants.forEach(participant => {
        console.log('already in room', participant)
        this.attachParticipantTracks(participant);
      });

      // when participent disconnect
      room.on('participantDisconnected', (participant) => {
        console.log('participent disconnected.............', participant)
        this.removeTrack();
      });

      // when participent connect
      room.once('participantConnected', participant => {
        console.log('participent connected ........', participant)
        this.attachParticipantTracks(participant);
      });

      // when participent join existing room
      room.on('participantConnected', participant => {
        console.log('participent connected ........', participant)
        this.attachParticipantTracks(participant);
      });

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', (track, participant) => {
        console.log("track added.......", participant);
        this.attachTracks([track]);
      });

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', (track, participant) => {
        console.log("track removed..........", participant);
        this.detachTracks([track]);
      });

      // when me left room
      room.on('disconnected', room => {
        console.log("me disconnect......", room)
        this.removeTrack();
      });
    });
  }

  removeTrack() {
    if (this.roomObj && this.roomObj !== null) {
      this.roomObj.disconnect();
      this.roomObj = null;
    }
    this.roomObj.localParticipant.tracks.forEach(function (track) {
      track.stop()
    });
  }

  attachParticipantTracks(participant): void {
    participant.tracks.forEach(part => {
      this.trackPublished(part);
    });
  }

  trackPublished(publication) {
    if (publication.isSubscribed)
      this.attachTracks(publication.track);

    if (!publication.isSubscribed)
      publication.on('subscribed', track => {
        this.attachTracks(track);
      });
  }

  mute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.disable();
    });
    this.microphone = false;
  }

  unmute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.enable();
    });
    this.microphone = true;
  }

  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  detachTracks(tracks): void {
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
  }

  // add remote track
  attachTracks(track) {
    this.remoteVideo.nativeElement.appendChild(track.attach());
  }
}