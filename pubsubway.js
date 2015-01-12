/*  
  
    NodeJS pub/sub module by Mathias Rangel Wulff (github: mathiasrw)

    Loosely based on jQuery pub/sub plugin by Peter Higgins, expanded in scope. Rewritten blindly. 
    
    License: MIT

    Version: 0.19.2

    
    * Simple example * 
    ******************

    var go = require('./pubsubway');

    go.sub('foo', function(){
        console.log('bar')
    });

    go.pub('foo')

    ******************

    To use in regular browser just include file as normal - Yay...
    (just avoid the 'require' line and use pubsubway.* instead of the go.* in the example)


    
*/

var pubsubway = function() {
    var me = this;
    var proxy = {};
    var doLog = false;
    var voidAction = false;


    me.subways = []



    me.log = function(
        msg /* string */ ,
        level /* integer */
    ) {
        //  log events -  
        //  Please overwrite behavior with something like
        //  pubsubway.log = function(msg){alert(msg)} 

        if (doLog && level <= 100) {
            console.log('pub/sub: ' + msg);
        }
    };

    me.voidAction = function( /*bool*/ val) {
        voidAction = val ? true : false;
    };

    me.doLog = function( /*bool*/ val) {
        doLog = val ? true : false;
    };

    me.publish =
        me.yell =
        me.pub =
        function(
            topic /* string */ ,
            args /* mix */
    ) {

        //      pubsubway.publish("/some/topic", ["a","b","c"]); 

        //      todo: ? let args be any amount of parameter and not array...

        if ((topic instanceof Array)) {
            for (var i = 0; i < topic.length; i++) {
                me.publish(topic[i], args)
            };
        }

        if (voidAction) {
            return me.log('void: ' + topic, 99)
        }

        me.log(topic, 100)

        args = args || [];

        args = arrayWrap(args);


        return proxy[topic] && this.each(proxy[topic], function() {
            this.apply(me, args);
        }) ? true : false;
    };

    me.subscribeANDmodeRewind =
        me.whenREWIND =
        me.subREWIND =
        function(
            topic /* string || array */ ,
            callback /* Function */ ,
            subscribeFirst /* [bool] */
    ) {

        me.subscribe(topic, callback, subscribeFirst, 'ANDmodeRewind')
    };

    me.subscribeANDmodeContinues =
    me.whenAND =
        me.subAND = function(
            topic /* string || array */ ,
            callback /* Function */ ,
            subscribeFirst /* [bool] */
    ) {
        me.subscribe(topic, callback, subscribeFirst, 'ANDmodeContinues')
    };

    //tpdp: implement subscribeOnce (OR mode)  
    //me.when1 = 
    //me.sub1 =


    me.subscribeANDmodeOnce =
        me.whenAND1 =
        me.subAND1 =
        function(
            topic /* string || array */ ,
            callback /* Function */ ,
            subscribeFirst /* [bool] */
    ) {
        //ToDo:implement reset
        me.subscribe(topic, callback, subscribeFirst, 'ANDmodeOnce')
    };

    me.subscribeORmodeButNotIfButResetWith =
        me.whenORBUT =
        me.subORBUT =
        function(
            topic /* string || array */ ,
            butNotIf /* string || array */ ,
            resetWith /* string || array */ ,
            callback /* Function */ ,
            subscribeFirst /* [bool] */
    ) {

        topic = arrayWrap(topic);

        butNotIf = arrayWrap(butNotIf);

        resetWith = arrayWrap(resetWith);

        var settings = []
        settings[0] = topic
        settings[1] = butNotIf
        settings[2] = resetWith

        me.subscribe(settings, callback, subscribeFirst, 'ORmodeButNotIfButResetWith')
    };


    me.subscribe =
        me.whenOR =
        me.subOR =
        me.when =
        me.sub =
        function(
            topic /* string || array */ ,
            callback /* Function */ ,
            subscribeFirst /* [bool] */ ,
            mode /* [string = 'ANDmodeRewind' || 'ANDmodeContinues' || 'ANDmodeOnce' || 'ORmodeButNotIfButResetWith']*/
    ) {


        // example: 
        // pubsubway.subscribe("/data/loadet", function(arg1, arg2, ... ){ /* do stuf */ }); 
        // 
        // ToDo: make parameters like object notation args

        subscribeFirst = subscribeFirst || false

        mode = mode || null

        /* if mode is set topic must be array */
        if (null != mode && !(topic instanceof Array)) {
            topic = [topic]
        }


        /* Assign a specific topic to function for normal mode */
        if (!(topic instanceof Array)) {
            if (!proxy[topic]) {
                proxy[topic] = [];
            }

            if (subscribeFirst) {
                proxy[topic].unshift(callback);
            } else {
                proxy[topic].push(callback);
            }
            return [topic, callback];
        }

        /* IF just normal OR  */
        if (null == mode) {
            me.each(topic, function() {
                me.subscribe(this, callback, mode, subscribeFirst);
            });
            return [topic, callback];
        }


        // Init data for the subways 
        var uid = topic.join('#') + '#' + Math.random()
        me.subways[uid] = {}
        me.subways[uid].mux = []
        me.subways[uid].dontRun = false;
        me.subways[uid].handlers = []
        me.subways[uid].handlers.push(me.subscribe(uid, callback))


        for (var i in topic) {
            me.subways[uid].mux[topic[i]] = 1
        }

        switch (mode) {
            case 'ANDmodeRewind':
                me.each(topic, function(theme) {
                    var theme = this
                    var thisUid = uid
                    var handler = me.subscribe(theme, function() {
                        me.subways[thisUid].mux[theme] = 0;

                        var total = 0;
                        for (var ii in topic) {
                            total += me.subways[thisUid].mux[topic[ii]];
                        }

                        if (0 == total) {
                            me.publish(thisUid);
                            for (var ii in topic) {
                                me.subways[thisUid].mux[topic[ii]] = 1;
                            }
                        }
                    });
                    me.subways[thisUid].handlers.push(handler)
                });
                break;


            case 'ANDmodeContinues':
                me.each(topic, function(theme) {
                    var theme = this
                    var thisUid = uid
                    var handler = me.subscribe(theme, function() {
                        me.subways[thisUid].mux[theme] = 0;

                        var total = 0;
                        for (var ii in topic) {
                            total += me.subways[thisUid].mux[topic[ii]];
                        }

                        if (0 == total) {
                            me.publish(thisUid);

                        }
                    });
                    me.subways[thisUid].handlers.push(handler)
                });
                break;


            case 'ANDmodeOnce':
                me.each(topic, function(theme) {
                    var theme = this
                    var thisUid = uid
                    var handler = me.subscribe(theme, function() {

                        if (me.subways[thisUid].dontRun) {
                            return
                        }

                        me.subways[thisUid].mux[theme] = 0;

                        var total = 0;
                        for (var ii in topic) {
                            total += me.subways[thisUid].mux[topic[ii]];
                        }

                        if (0 == total) {
                            me.publish(thisUid);
                            me.subways[thisUid].dontRun = true
                        }

                        // ToDo ? 
                        /*for(var ii in me.subways[uid].handlers){ 
                                me.unsubscribe(me.subways[uid].handlers[ii]); 
                        }*/

                    });
                    me.subways[thisUid].handlers.push(handler)
                });
                break;


            case 'ORmodeButNotIfButResetWith':
                if (!(
                    (0 in topic) && (topic[0] instanceof Array) &&
                    (1 in topic) && (topic[1] instanceof Array) &&
                    (2 in topic) && (topic[2] instanceof Array)
                )) {
                    console.log('Wrong pubsub formatting of ORmodeButNotIfButResetWith')
                    return false;
                }

                var publish = topic[0]
                var butNotIf = topic[1]
                var resetWith = topic[2]

                me.each(resetWith, function(theme) {
                    var theme = this
                    var handler = me.subscribe(theme, function() {
                        me.subways[uid].dontRun = false;
                    });
                    me.subways[uid].handlers.push(handler)
                });

                me.each(butNotIf, function(theme) {
                    var theme = this
                    var handler = me.subscribe(theme, function() {
                        me.subways[uid].dontRun = true;
                    });
                    me.subways[uid].handlers.push(handler)
                });


                me.each(publish, function(theme) {
                    var theme = this
                    var handler = me.subscribe(theme, function() {
                        if (me.subways[uid].dontRun) {
                            return;
                        }
                        me.publish(uid);
                    });
                    me.subways[uid].handlers.push(handler)
                });




                break;
            default:
                me.log('Wrong mode setting in pubsubway: ' + mode, 1)
                return false;
        }

        return [uid, callback];

    };

    me.unsubscribe =
        me.unsub =
        function(
            handle /* array */
    ) {

        // var handle = pubsubway.subscribe("/foo", function(){}); 
        // pubsubway.unsubscribe(handle); 

        // ToDo: make it possible to resubscribe a handle
        // ToDo: implement me.subways[uid].handlers check 

        var t = handle[0];
        proxy[t] && me.each(proxy[t], function(idx) {
            if (this == handle[1]) {
                proxy[t].splice(idx, 1);
            }
        });
    };


    me.each = function(
        topics /* array */ ,
        callback /* function */
    ) {
        var i = -1
        var length = topics.length
        while (++i < length && callback.call(el = topics[i], i, el) !== false);
    }

    var arrayWrap = function(data) {
        if (!(data instanceof Array)) {
            return [data]
        }
        return data;
    }


    // Make it convinient to publish string instead of sending function as callback 
    // Use like:       
    // callback = pubsubway.pubsubBack(callback)
    // in our own function to be able to put a function to tall OR a string to publish as your own callback 
    me.pubsubBack = function(callback) {
        callback = callback || function() {};

        if (!(callback instanceof Function)) {
            var topic = callback // ToDo: make sure its not an object that only asign a ref
            callback = function() {
                me.publish(topic, arguments)
            }
        }
        return callback;
    }


    return me;
}()

module = module || {};
module.exports = pubsubway;
