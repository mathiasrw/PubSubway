
/*

from http://chaijs.com/api/assert/

fail
ok
notOk
equal
notEqual
strictEqual
notStrictEqual
deepEqual
notDeepEqual
isTrue
isFalse
isNull
isNotNull
isUndefined
isDefined
isFunction
isNotFunction
isObject
isNotObject
isArray
isNotArray
isString
isNotString
isNumber
isNotNumber
isBoolean
isNotBoolean
typeOf
notTypeOf
instanceOf
notInstanceOf
include
notInclude
match
notMatch
property
notProperty
deepProperty
notDeepProperty
propertyVal
propertyNotVal
deepPropertyVal
deepPropertyNotVal
lengthOf
throws / throw / Throw
doesNotThrow
operator
closeTo
sameMembers
includeMembers

*/

var testing  	= require('utest');
var test 		= require('chai').assert
var go	 		= require('../js/pubsubway.min');


var a = 0;

go.when('/test/a', function(){ 
	a++;
})




testing('Basics (OR mode)', {

  'Simple string call': function () {
	a = 1;
	go.resetAll()
	
	go.when('/test/a', function(){ 
		a++;
	})
	
    go.yell('/test/a');
	
	test.equal(2, a);

  },
  
  'Verifying resetAll': function () {
	var a = 1;
	
	go.resetAll()
	
	go.when('/test/a', function(){ 
		a++;
	})
	
	go.resetAll()

	go.when('/test/a', function(){ 
		a--;
	})
	
    go.yell('/test/a');
	
	test.equal(0, a);

  },

  'More than one subscriber': function(){
  
	var a = 1;
	
	go.resetAll()
	
	go.when('/test/a', function(){ 
		a++;
	})

	go.when('/test/a', function(){ 
		a++;
	})
	
    go.yell('/test/a');
	
	test.equal(3, a);

  }


});







testing('Mode: ANDmodeRewind', {


  'stub': function(){
  
	test.ok(true);  
	
  }


});





testing('Mode: ANDmodeContinues', {


  'stub': function(){
  
	test.ok(true);  
	
  }


});





testing('Mode: ANDmodeOnce', {


  'stub': function(){
  
	test.ok(true);  
	
  }


});


testing('Mode: ORmodeButNotIfButResetWith', {


  'stub': function(){
  
	test.ok(true);  
	
  }


});







