/* 
 * ================================================================
 * This Software is not for resale purposes. 
 * It is licensed under the Apache License 2.0 
 * ================================================================
 * @author Sören Sauerbrei - Charité Universitätsklinik Berlin
 * @copyright Copyright (c) 2017. All rights reserved.
 * @version 1.0
 * @description 
 * @example 
 */
var BMI = require('./index');
var BMI2 = require('./test');

console.time('BMI');
var one = BMI().setHeight(180).setMass(80).setGender('m').usePounds(false);
console.timeEnd('BMI');


console.time('BMI2');
var one = BMI2().setHeight(180).setMass(80).setGender('m').usePounds(false).calc();
console.timeEnd('BMI2');