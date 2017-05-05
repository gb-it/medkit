var bmi = require('../index').bmi;
var assert = require('assert');


describe('bmi', function() {
	it('(180,80).index should return 24.7', function() {
		assert.equal(bmi(180,80).calc().index, 24.7);
	});
	it('(180,80).message should return Healthy', function() {
		assert.equal(bmi(180,80).calc().message, 'Healthy');
	});
	it('(180,80).setGender("m").setAge(55).message should return Healthy', function() {
		assert.equal(bmi(180,80).setGender("m").setAge(55).calc().message, 'Healthy');
	});
	it('(180,80).setGender("m").setAge(16).message should return Overweight', function() {
		assert.equal(bmi(180,80).setGender('m').setAge(16).calc().message, 'Overweight');
	});
	it('Object.keys((180,80).getRangeTable())[5] should return Obese Class I', function() {
		assert.equal(Object.keys(bmi(180,80).getRangeTable())[5], 'Obese Class I');
	});
	it('(180,80,true).calc().index should return 1.7', function() {
		assert.equal(bmi(180,80,true).calc().index, 1.7);
	});
});