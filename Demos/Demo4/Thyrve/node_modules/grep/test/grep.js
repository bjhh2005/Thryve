Object = require('../grep.js');

exports['Grep'] = {

  setUp: function( done ) {

    TestObject = function(){

      this.number = 1;
      this.name = "This is a name";
    };
    TestObject.prototype.Test = true;

    this.testObject = new TestObject();

    done();
  },

  instances: function( test ) {
    test.expect(2);

    var out = this.testObject.Grep( 'name' );
    test.equal( out.name , "This is a name" );

    //make sure we haven't just copied the object
    test.notEqual( out, this.testObject );

    test.done();
  },

  // for now we will skip the prototype test until 
  // support for prototypes is added

  tearDown: function( done ) {
    done();
  }
};