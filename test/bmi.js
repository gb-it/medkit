var bmi = require('../index').bmi;
var assert = require('assert');


describe('bmi', function() {
	it('(180,80).index should return 24.7', function() {
		assert.equal(bmi(180,80).index, 24.7);
	});
	it('(180,80).setGender("m").setAge(55).message should return Healthy', function() {
		assert.equal(bmi(180,80).setGender("m").setAge(55).message, 'Healthy');
	});
	it('(180,90).setGender("m").message should return Overweight', function() {
		assert.equal(bmi(180,90).setGender("m").message, 'Overweight');
	});
});