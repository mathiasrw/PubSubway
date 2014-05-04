	var test   = require('utest');
	var is 		= require('assert');
	var go    	= require('../pubsubway');
	var should = require('should');


var a = 0;


go.when('/a/ready', functino(){
        a++;
})


test('Just a stub - sorry...', {

  'TEST': function () {
    a = 1;
    go.yell('/a/ready');
	is.strictEqual(2, a);
  },

  


});

