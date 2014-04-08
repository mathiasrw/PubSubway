PubSubway 
=========

#### Plain pubsub module with a spice of logic to when subscribers get the message.

[![NPM version](https://badge.fury.io/js/pubsubway.svg)](http://badge.fury.io/js/pubsubway) 
[![Build Status](https://travis-ci.org/mathiasrw/PubSubway.svg?branch=master)](https://travis-ci.org/mathiasrw/PubSubway) 


Have you ever had 

1. Code you wanted to only **invoke once** - but with a message that repeats?
2. Code you wanted to  only **invoke when a range of messages have all been published** (in random order)?
3. Code you wanted to **pause invoking** at speciffic conditions?

Of cause you have... cause thats what real world code needs. 

And everytime you have dealt with it by making some good counters around your pubsub structure and build nicely structured features to take care of when to invoke and when not to. 

**PubSubway replaces the counters and the logic around your observer pattern with easy to read chuncks of code with a light footprint.**

    
Just take the subway instead of sitting in the trafic jam...


---- 

_PubSubway provides an underground system (of tunnels) helping you with real world callback hell. Think subway in a trafic jam._

----


```javascript
/*
  	
  	* Example * 
	***********/
	
  	var db = require('mysql');
  	var go = require('pubsubway');

	
	var mysql = createConnection(db);


  	go.whenAND(['/sql_a/done', '/sql_b/done'], function(){
  		console.log('Both SQL a and SQL b are done now');
  	});


	mysql.query('UPDATE product SET stock = 7 WHERE id = 423', function(){
		go.yell('/sql_a/done')
	});


	mysql.query('UPDATE product SET stock = 2 WHERE id = 332', function(){
		go.yell('/sql_b/done')
	});	

```


To use in regular browser just include file as normal (Yay!) 

```HTML
    <script src="pubsubway.js" type="text/javascript"></script>
```

In the browser you use the examples with `pubsubway.*` instead of the `go.*` - and ignore the 'require' line.


    


# The pubsub pattern

Please remember that the pubsub pattern is best suited to publish messages about what **has happened**.
Dont fall into the pifall of using it as regular functions. A good idea is to label your topics in past sense.



ToDo: Tests, documentation and better introduction


# Documentation

You include the module with a traditional `var go = require('pubsubway');` or any name you find suitable. In the documentation I chose `go` cause it short and sounds nice. 

Depending on the style of program you are developing I personally prefer either long and javaish style method names or short names that fit into the rest of the code more seamless. Thats why the API comes with a bunch of aliases  




## Publish a message

```javascript
    go.pub =
    go.yell =  
    go.publish = function(
                            topic /* string */ 
                            ,  
                            args /* array */
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

Loosely based on jQuery pub/sub plugin by Peter Higgins, expanded in scope. Rewritten blindly. 
  	
License: MIT

Pattern: Observer 
