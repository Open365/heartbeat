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

var Heartbeat = require('../lib/server'),
    net = require('net'),
    sinon = require('sinon'),
    settings = require('./utils/settings.js');

suite('Server', function () {
    var sut, fakeNet, fakeServer, sock;

    setup(function () {
        fakeNet = {
            createServer: function(callback) {}
        };
        fakeServer = {
            listen: function() {}
        };
        sock = new net.Socket();
        sut = new Heartbeat(fakeNet, settings);
    });


    suite('#start', function() {
        setup(function() {
            sinon.stub(fakeNet, 'createServer', function(connectListener) {
                connectListener(sock);
                return fakeServer;
            });

        });

        test('opens socket on the correct port', sinon.test(function () {
            var exp = sinon.mock(fakeServer)
                        .expects('listen')
                        .withExactArgs(settings.port, sinon.match.func);
            sut.start();
        }));

        test("server's connection listener calls setInterval", sinon.test(function () {
       		this.mock(global)
       			.expects('setInterval')
       			.once()
       			.withExactArgs(sinon.match.func, settings.interval);
       		sut.start();
       	}));

        test('setInterval callback calls socket.write', sinon.test(function () {
            this.stub(global, 'setInterval', function (callback, time) {
                callback();
            });
            this.mock(sock)
                .expects('write')
                .once()
                .withExactArgs('1');
            sut.start();
        }));

        test('clearInterval is called when the socket is closed', sinon.test(function () {
            var intervalId = 'fakeIntervalId';
            this.stub(global, 'setInterval', function () {
                return intervalId;
            });
            this.mock(global)
                .expects('clearInterval')
                .once()
                .withExactArgs(intervalId);
            sut.start();
            sock.emit('close', false);
        }));
    });
});
