[![npm install pubsubway](https://img.shields.io/npm/dm/pubsubway.svg?style=flat)](http://browsenpm.org/package/pubsubway)
[![MIT](https://img.shields.io/npm/l/pubsubway.svg?style=flat)](http://browsenpm.org/package/pubsubway)
[![Build Status](https://travis-ci.org/mathiasrw/PubSubway.svg?branch=master)](https://travis-ci.org/mathiasrw/PubSubway) 


PubSubway 
=========

#### Plain pubsub module with a spice of logic to when subscribers get the message.

Have you ever had 

- Code you wanted to only **invoke once** - but with a message that repeats?
- Code you wanted to  only **invoke when a range of messages have all been published** (in random order)?
- Code you wanted to **pause invoking** at speciffic conditions?

Of cause you have... cause thats what real world code needs. 

And everytime you have dealt with it by making some good counters around your pubsub structure and build nicely structured features to take care of when to invoke and when not to. 

**PubSubway replaces the counters and the logic around your observer pattern with easy to read chuncks of code with a light footprint.**
    
Just take the subway instead of sitting in the trafic jam...


----
Example:

```js
var db = require('mysql');

var go = require('pubsubway');

var mysql = createConnection(db);

mysql.query('UPDATE product SET stock = 7 WHERE id = 423', function() {
	go.yell('/sql_a/done')
});

mysql.query('UPDATE product SET stock = 2 WHERE id = 332', function() {
	go.yell('/sql_b/done')
});

go.whenAND(['/sql_a/done', '/sql_b/done'], function() {
	console.log('Both SQL a and SQL b are done now');
});
```


To use in regular browser instead of Node please include via unpkg 

```HTML
    <script src="https://unpkg.com/pubsubway"></script>
```

The global scope will be ~poluted~ populated with the object `pubsubway` - please note that all examples on this site uses `go` to illustrate the PubSubWay object.


# Involvement

_**Any involvement in the project is very welcome, and encouraged.**_    


# The pubsub pattern

Please remember that the pubsub style of programing (observer pattern) is best suited to publish messages about what **has happened**.
Dont fall into the pifall of using it as regular functions. A good idea is to label your topics in past sense.


# Documentation

You include the module with a traditional `var go = require('pubsubway');` (or any name you find suitable). In the documentation I chose `go` cause it short and sounds nice. 


## Publish a message

```javascript
go.pub = 
go.yell = 
go.publish = function(
						topic, 	/* string */ 
						args 	/* array */ 
					)
```


## Subscribe to a message

To listen to a single message and invoke code is trivial - but when you want to listen to several messages you are suddenly left with a lot of choises recarding how to handle the logic around it. 



### Subscribe to any of these messages (OR mode)

```javascript
 	go.sub =
   	go.when =
   	go.subOR =
   	go.whenOR =
    go.subscribe = function(		topic			/* string || array */
									, 
									callback 		/* Function */
									, 
									subscribeFirst 	/* [bool] */
									,
									mode			/* string */
									) 
 ```     

**Example** 
   
```javascript
	go.subscribe("/foo/bar", function(a, b, c){ 
		... 
	}); 
        
```          

### Subscribe to any of these messages (OR mode) and invoke only once

```javascript
 	go.sub1 =
   	go.when1 =
   	go.subOR1 =
   	go.whenOR1 =
    go.subscribeOnce = function(	topic			/* string || array */
									, 
									callback 		/* Function */
									, 
									subscribeFirst 	/* [bool] */
									,
									mode			/* string */
									) 
 ```     
	

## Subscribe to all these messages = only start invoking when all of them have been published (AND mode)
   
```javascript  
  	go.subAND =
  	go.whenAND =
  	go.subscribeAND =
    go.subscribeANDmodeContinues = function(
                                                topic /* string || array */
                                                , 
                                                callback /* Function */
                                                , 
                                                subscribeFirst /* [bool] */ 
											)
```

  	me.subAND1 =
  	me.whenAND1 = 
    me.subscribeANDmodeOnce = function(
                                                topic           /* string || array */
                                                , 
                                                callback        /* Function */
                                                , 
                                                subscribeFirst  /* [bool] */ 
                                            ){ 
        //ToDo:implement reset
        me.subscribe(topic, callback, subscribeFirst, 'ANDmodeOnce') 
    }; 

# Subscribe to messages but only start invoking each time all of them have been published again. 
   
       
 ```javascript 
  	go.subREWIND =
	go.whenREWIND =
	go.subscribeREWIND =
    go.subscribeANDmodeRewind = function(
    										topic             /* string || array */ 
    										, 
    										callback          /* Function */
    										, 
    										subscribeFirst    /* [bool] */ 
    									) 
```

# Subscribe to messages but pause and restart with 
  
											
```javascript  
  	go.whenORBUT = 
  	go.subORBUT = 
    go.subscribeORmodeButNotIfButResetWith = function(
                                                        topic /* string || array */ 
                                                        ,
                                                        butNotIf /* string || array */
                                                        ,
                                                        resetWith /* string || array */
                                                        , 
                                                        callback /* Function */
                                                        , 
                                                        subscribeFirst /* [bool] */
                                                    ) 
```          
    
# Unsubscribe a subscription
	
```javascript  
    go.unsub =
    go.unsubscribe = function(handle /* Array */){ 
	       
        //    var handle = pubsubway.subscribe("/foo", function(){}); 
        //    pubsubway.unsubscribe(handle); 
  		
  		// ToDo: make it possible to resubscribe a handle
		// ToDo: implement go.subways[uid].handlers check 
```	
	
	

# Log the publications	
	
	


 ```javascript
    go.log = function(/* string */ msg, /* integer */ level){ 
        //  log events -  
        //  Please overwrite behavior with something like
        //  $.log = function(msg){alert(msg)} 
          
        if(doLog && level<=100){ 
            console.log('pub/sub: ' + msg); 
        } 
    }; 
```	


# Start/stop logging

```javascript      
	go.doLog = function(/*bool*/ val)
```    

# Stop all publications

_The big handbrake_

```javascript      
    go.voidAction = function(/*bool*/ val){ 
```


# Wrap topics

Wrab topics to act like traditional callback function to handle strings as callbacks

```javascript
	// Make it convinient to publish string instead of sending function as callback 
    // Use in your own funktion like:       
    // 		callback_function = go.pubsubBack(topic /* sting */)
    // to be able to put a function or a string to publish as your own callback 
	
	go.pubsubBack(topic /* sting */)

```


----

# ToDo 

- **Tests**: 
The module is used and enchanged in production - so it works, but better get those tests up and running...

- **pubAlert**:
optional Log warning when something is published that nothing is subscribed to. Good fro development. 

- **pubBuffer**:
Setting to buffer all publications untill released. Good for when you publish things in your sync flow, but want to message something that will be observing a little later caused by async waiting. Is it bad structure of the code? well, if it is used in the main flow it is, but during the initial load of code it is not. 

- **Mode strings to mode vars**
To make the minifyed version smaller all the hardcoded strings for mode should be a variable returned by a function. 


--------------------------------------------


# tl;dr
  	
License: MIT

Pattern: Observer 

Inspiration: Loosely based on jQuery pub/sub plugin by Peter Higgins, expanded in scope. Rewritten blindly. 


--------------------------------------------
