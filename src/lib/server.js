/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var log2out = require('log2out');

var Server = function(net, settings) {
    this.logger = log2out.getLogger('Server');
    this.settings = settings || require('./settings.js');
    this.net = net || require('net');
};

Server.prototype.start = function () {
    var self = this;
    this.server = this.net.createServer(this._getConnectListener());
    this.server.listen(this.settings.port, function (err) {
            if (err) {
                    self.logger.error("An error has occurred when trying to open port", this.settings.port, ":", err);
            } else {
                self.logger.debug("Listening on port", self.settings.port);
            }
    });
};

Server.prototype._getConnectListener = function () {
       var self = this;
       return function onConnectionListener (sock) {
           self.logger.debug('Connection from', sock.remoteAddress + ':' + sock.remotePort
               );
               sock.setNoDelay(true);
               var intervalId = setInterval(function periodicWriteToSocket () {
                       sock.write('1');
               }, self.settings.interval);
               self._setSocketListeners(sock, intervalId);
       };
};

Server.prototype._setSocketListeners = function (socket, intervalId) {
       var self = this;
       var client = socket.remoteAddress + ':' + socket.remotePort;
       socket.on('close', function socket_close_callback () {
               self.logger.debug('Client', client, 'closed');
               this.unref();
               clearInterval(intervalId);
       });
};

module.exports = Server;
