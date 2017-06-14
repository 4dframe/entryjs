/**
 * @fileoverview HW object class for connect arduino.
 */
'use strict';

Entry.mobileHW = function() {
    Entry.addEventListener('stop', this.setZero);
    this.hwInfo = Entry.Neobot;
    this.entryBM = window.EntryBM;
    this.sendQueue = {};
};

var p = Entry.mobileHW.prototype;


p.banHW = function() {
};

p.update = function() {
    if (!this.entryBM || this.entryBM.disconnected || !this.sendQueue) {
        return;
    }

    this.entryBM.send(this.sendQueue);
};

p.setDigitalPortValue = function(port, value) {
    this.sendQueue[port] = value;
    this.removePortReadable(port);
};

p.setPortReadable = function(port) {
    if (!this.sendQueue.readablePorts) {
        this.sendQueue.readablePorts = [];
    }

    var isPass = false;
    for(var i in this.sendQueue.readablePorts) {
        if(this.sendQueue.readablePorts[i] == port) {
            isPass = true;
            break;
        }
    }

    if(!isPass) {
        this.sendQueue.readablePorts.push(port);
    }
};

p.removePortReadable = function(port) {
    if (!this.sendQueue.readablePorts && !Array.isArray(this.sendQueue.readablePorts))
        return;
    var target;
    for(var i in this.sendQueue.readablePorts) {
        if(this.sendQueue.readablePorts[i] == port) {
            target = Number(i);
            break;
        }
    }

    if(target != undefined) {
        this.sendQueue.readablePorts = this.sendQueue.readablePorts.slice(0, target).concat(this.sendQueue.readablePorts.slice(target + 1, this.sendQueue.readablePorts.length));
    } else {
        this.sendQueue.readablePorts = [];
    }
}