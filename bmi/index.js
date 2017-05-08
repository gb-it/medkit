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
 * @returns {BMI} Returns `bmi`.
 * @example
 *
 * // standard call
 * bmi(176,78).calc();
 * // => { 'index': '25.2', 'message': 'Overweight', 'gender': 'unknown', age: 0, height: 176, mass: 78, measurement: 'centimeters/kilograms' }
 *
 * // using more specification like gender and age
 * bmi(176,78).setGender('m').setAge(56).calc();
 * // => { 'index': '25.2', 'message': 'Healthy', 'gender': 'male', age: 56, height: 176, mass: 78, measurement: 'centimeters/kilograms' }
 *
 * // you even are able to use pounds and inches
 * bmi(69.3,172).usePounds(true).calc();
 * // => { 'index': '25.2', 'message': 'Overweight', 'gender': 'unknown', age: 0, height: 69.3, mass: 172, measurement: 'inches/pounds' }
 * 
 * // it is possible to receive the used personalized RangeTable as well
 * bmi(69.3,172).setGender('m').getRangeTable();
 * // => { 'Very severely underweight': '16', 'Severely Underweight': '16-17', 
 * //      'Underweight': '17-18-18.5', 'Healthy': '18.5-25', 'Overweight': '25-30', 
 * //      'Obese Class I': '30-35', 'Obese Class II': '35-40', 'Obese Class III': 40 }
 * 
 */

'use strict';

/**
 * ToDo: 
 *			Optional: do not calc Every Time
 *			Optional: better Performance
 *			Optional: better calc logic
 */

var _ = {};
_.each = require('lodash.foreach'),
_.assign = require('lodash.assign');

var defaultRange = {
	0: '16',
	1: '16-17',
	2: '17-18.5',
	3: '18.5-25',
	4: '25-30',
	5: '30-35',
	6: '35-40',
	7: '40'
};

var specificRanges = {
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


/**
 * Constructor for the BMI-Object. Height and Mass
 * are mandatory, but may be set via Setters too.
 * UsePounds is an optional Parameter
 * @see usePounds
 * @param {integer} height
 * @param {float} mass
 * @param {boolean} usePounds
 * @returns {BMI}
 */
function BMI(height , mass , usePounds) {
	
	this.index = null;
	this.message = null;
	this.gender = 'unknown';
	this.age = null;
	this.height = height;
	this.mass = mass;
	this.measurement = null;
	this.usePounds(usePounds);
	
	return this;
};


/**
 * Used for calculation.
 * @default false
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.usePounds = function(usePounds) {
	this.measurement = (usePounds === true ? 'inches/pounds' : 'centimeters/kilograms');
	return this;
};

		
/**
 * Calculates the BMI and sets the BMI-Object
 * @returns {BMI}
 */
BMI.prototype.calc = function() {
	// calculating the BMI
	this.index = this.getIndex();
	
	// calculating the specific Range-Table
	var thisRange = getRange(this);
	
	// updating the Result
	_.each(thisRange, function(v,k) {
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
 * Returns only the BMI-Value
 * @returns {Number}
 * @example 
 * 
 * BMI(180,80).getIndex()
 * // => 24.7
 * 
 */
BMI.prototype.getIndex = function() {
	return (this.measurement === 'inches/pounds' ? 
					(this.mass / this.height / this.height) * 703 : 
					(this.mass / Math.pow(this.height/100,2))
	).toFixed(1);
};


/**
 * Returns the personalized Range Table
 * @returns {Object} RangeTable with Names as Keys and BMI-Ranges as Values
 * @example 
 * 
 * bmi(180,80).getRangeTable()
 * // => {'Very severely underweight': '16', 'Severely underweight': '16-17', ...}
 * // Keep in Mind, that the first element is lower than and the last element is greater or equal
 * 
 */
BMI.prototype.getRangeTable = function() {
	var thisRange = getRange(this);
	return mapMessagesToRanges(thisRange);
};


/**
 * Setter for Age
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.setAge = function(age) {
	this.age = age;
	return this;
};


/**
 * Setter for Gender
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
	
	return this;
};


/**
 * Setter for Height
 * @param {integer} age
 * @returns {BMI}
 */
BMI.prototype.setHeight = function(height) {
	this.height = height;
	return this;
};


/**
 * Setter for Mass
 * @param {integer} mass
 * @returns {BMI}
 */
BMI.prototype.setMass = function(mass) {
	this.mass = mass;
	return this;
};





/**
 * Module-Constructor
 * @private
 * @param {integer} height
 * @param {float} mass
 * @param {bool} usePounds
 * @returns {BMI}
 */
function constructor(height, mass, usePounds) {
	return new BMI(height, mass, usePounds);
}


/**
 * Maps the Messages as Key for Ranges
 * @param {Ranges} rangeObject
 * @returns {Object}
 * @example 
 * mapMessagesToRanges({1: 16, 2: '16-17', ...}
 *  // => {'Very severely underweight': '16', 'Severely underweight': '16-17', ...}
 */
function mapMessagesToRanges(rangeObject) {
	_.each(rangeObject, function(v,k) {
		rangeObject[defaultMessages[k]] = v;
		delete rangeObject[k];
	});
	return rangeObject;
}

/**
 * identify the specific indexes,
 * if the gender is known
 * 
 * @param {BMI} BMIObject
 * @returns {Range|null} Returns the Range which will overwrite the defaultRange
 * @example
 * 
 * identifyRange(bmi(180,80).setGender('m')
 * // => {2: '17-20', 3: '20-25'}
 * 
 */
function identifyRange(BMIObject) {
	var identifiedRange = {};
	
	if (BMIObject.gender !== 'unknown') {
		if (BMIObject.age >= 16) {
			_.each(specificRanges[BMIObject.gender].age, function(v,k) {
				var ageRange = k.split('-').map(function(val) { return parseInt(val); });
				if (BMIObject.age >= ageRange[0] && BMIObject.age <= ageRange[1]) {
					identifiedRange = v;
				}
			});			
		} else {
			var copyMaleObj = specificRanges[BMIObject.gender];
			delete copyMaleObj.age;
			identifiedRange = copyMaleObj;
		}
	}
	return identifiedRange;
}

/**
 * Merges DefaultRanges with Patient-specific-Ranges
 * and returns the result
 * @param {BMI} BMIObject
 * @returns {Object}
 * @example
 * 
 * getRange(bmi(180,80).setGender('m'))
 * // => {0: '16', 1: '16-17', 2: '17-20', 3: '20-25',
 * //     4: '25-30', 5: '30-35', 6: '35-40', 7: '40'}
 * // index 2 and 3 from DefaultRange are replaced
 * 
 */
function getRange(BMIObject) {
	return _.assign(defaultRange, identifyRange(BMIObject));
}





module.exports = constructor;