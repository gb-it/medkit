/**
 * ================================================================
 * It is licensed under the MIT License 
 * ================================================================
 * 
 * This Package calculates the correct BMI by given Values like Mass, 
 * Age and Gender. It references to a couple of different BMI-Tables 
 * for any given combination.
 *
 * @author Sören Sauerbrei - Charité Universitätsklinik Berlin
 * @copyright Copyright (c) 2017. All rights reserved.
 * @version 1.0
 * @description Resources: http://fddb.info/db/de/lexikon/bmi/index.html ; https://de.wikipedia.org/wiki/Body-Mass-Index
 * @static
 * @memberOf medkit
 * @alias 
 * @category bmi
 * @param {int} height The height of person in cm or in.
 * @param {int} mass The mass of person in kg or lbs.
 * @param {bool} usePounds Check this to true, if you are using inches and pounds!
 * @returns {Object} Returns `bmi`.
 * @example
 *
 * // standard call
 * bmi(176,78);
 * // => { 'index': '25.2', 'message': 'Overweight', 'gender': 'unknown', age: 0, height: 176, mass: 78, measurement: 'kilograms/metres' }
 *
 * // using more specification like gender and age
 * bmi(176,78).setGender('m').setAge(56);
 * // => { 'index': '25.2', 'message': 'Healthy', 'gender': 'male', age: 56, height: 176, mass: 78, measurement: 'kilograms/metres' }
 *
 * // you even are able to use pounds and inches
 * bmi(69.3,172).usePounds(true);
 * // => { 'index': '25.2', 'message': 'Overweight', 'gender': 'unknown', age: 0, height: 69.3, mass: 172, measurement: 'pounds/inches' }
 * 
 */

'use strict';

/**
 * ToDo: 
 *			Mocha Unit Tests
 *			Encapsulate The Calc Part
 *			Optional: do not calc Every Time
 *			Optional: better Performance
 *			Optional: better calc logic
 */

var _ = {};
_.each = require('lodash.foreach'),
_.assign = require('lodash.assign');

/**
 * 
 * @param {integer} height
 * @param {float} mass
 * @param {boolean} usePounds
 * @returns {BMI}
 */
function BMI(height , mass , usePounds) {
	
	this.index = 0;
	this.message = '';
	this.gender = 'unknown';
	this.age = 0;
	this.height = height;
	this.mass = mass;
	this.measurement = '';
	
	this.usePounds(usePounds);
	return this.calc();
};

/**
 * 
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.setHeight = function(height) {
	this.height = height;
	return this.calc();
};


/**
 * 
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.usePounds = function(usePounds) {
	this.measurement = (usePounds === true ? 'pounds/inches' : 'kilograms/metres');
	return this.calc();
};


/**
 * 
 * @param {integer} mass
 * @returns {BMI}
 */
BMI.prototype.setMass = function(mass) {
	this.mass = mass;
	return this.calc();
};


/**
 * 
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.setAge = function(age) {
	this.age = age;
	return this.calc();
};

/**
 * 
 * @param {String} gender
 * @returns {BMI}
 */
BMI.prototype.setGender = function(gender) {
	var mapGender = {
		male: ['m', 0, 'male', false],
		female: ['f', 'w', 1, 'female', true],
		unknown: ['u', null]
	};
	
	if (mapGender.male.indexOf(gender) > -1) {
		this.gender = 'male';
	} else if (mapGender.female.indexOf(gender) > -1) {
		this.gender = 'female';
	} else {
		this.gender = 'unknown';
	}
	
	return this.calc();
};
		
/**
 * 
 * @returns {BMI}
 */
BMI.prototype.calc = function() {
	this.index = (this.measurement === 'pounds/inches' ? 
					(this.mass / this.height / this.height) * 703 : 
					(this.mass / Math.pow(this.height/100,2))
	).toFixed(1);

	var defaultIndexes = {
		0: '16',
		1: '16-17',
		2: '17-18.5',
		3: '18.5-25',
		4: '25-30',
		5: '30-35',
		6: '35-40',
		7: '40'
	};
	
	var specificIndexes = {
		male: {
			age: {
				'16-16': {
					2: '17-18',
					3: '18-24',
					4: '24-28',
					5: '28-35'
				},
				'17-24': {
					2: '17-20',
					3: '20-25'
				},
				'25-34': {
					2: '17-21',
					3: '21-26',
					4: '26-30'
				},
				'35-44': {
					2: '17-22',
					3: '22-28',
					4: '28-31',
					5: '31-35'
				},
				'45-54': {
					2: '17-23',
					3: '23-29',
					4: '29-33',
					5: '33-35'
				},
				'55-64': {
					2: '17-24',
					3: '24-30',
					4: '30-34',
					5: '34-35'
				},
				'64-999': {
					2: '17-25',
					3: '25-30',
					4: '30-35',
					5: '35-37',
					6: '37-40'
				}
			},
			2: '17-20',
			3: '20-25'
		},
		
		female: {
			age: {
				'16-24': {
					2: '17-18',
					3: '18-24',
					4: '24-28',
					5: '28-35'
				},
				'25-34': {
					2: '17-19',
					3: '19-25',
					4: '25-30'
				},
				'35-44': {
					2: '17-20',
					3: '20-26',
					4: '26-31',
					5: '31-35'
				},
				'45-54': {
					2: '17-21',
					3: '21-27',
					4: '27-32',
					5: '32-35'
				},
				'55-64': {
					2: '17-22',
					3: '22-28',
					4: '28-33',
					5: '33-35'
				},
				'64-999': {
					2: '17-23',
					3: '23-29',
					4: '29-34',
					5: '34-37',
					6: '37-40'
				}
			},
			2: '17-19',
			3: '19-24',
			4: '24-30'
		}
	};
	
	
	// identify the specific indexes
	// if the gender is known
	var identifiedIndex = {};
	
	if (this.gender !== 'unknown') {
		if (this.age >= 16) {
			_.each(specificIndexes[this.gender].age, function(v,k) {
				var ageRange = k.split('-').map(function(val) { return parseInt(val); });
				if (this.age >= ageRange[0] && this.age <= ageRange[1]) {
					identifiedIndex = v;
				}
			}.bind(this));			
		} else {
			var copyMaleObj = specificIndexes[this.gender];
			delete copyMaleObj.age;
			identifiedIndex = copyMaleObj;
		}
	}
	
	// Now overwrite the default indexes with the specific ones
	_.assign(defaultIndexes, identifiedIndex);
	
	
	// generating the Error Messages
	var defaultMessages = {
		0: 'Very severely underweight',
		1: 'Severely underweight',
		2: 'Underweight',
		3: 'Healthy',
		4: 'Overweight',
		5: 'Obese Class I',
		6: 'Obese Class II',
		7: 'Obese Class III'
	};
	_.each(defaultIndexes, function(v,k) {
		var indexes = v.split('-').map(function(val) { return parseInt(val); });
		if (k === '0') {
			if (this.index < indexes[0]) {
				this.message = defaultMessages[k];
			}
		} else if (k === '7') {
			if (this.index >= indexes[0]) {
				this.message = defaultMessages[k];
			}
		} else {
			if (this.index >= indexes[0] && this.index < indexes[1]) {
				this.message = defaultMessages[k];
			}
		}
	}.bind(this));
	
	return this;	
};




/**
 * 
 * @param {integer} height
 * @param {float} mass
 * @returns {BMI}
 */
function constructor(height, mass) {
	return new BMI(height, mass);
}





module.exports = constructor;