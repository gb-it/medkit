![Charite Logo](https://upload.wikimedia.org/wikipedia/commons/5/51/Logo_Charite.svg)

This Package provides tools for medical purposes. Developed by Charité Berlin.

Main Developer: [Sören Sauerbrei](https://github.com/Sauerbrei)

# [![npm version](https://badge.fury.io/js/medkit.svg)](https://badge.fury.io/js/medkit.svg) Reference

- [medkit](#medkit)
  - [`bmi(height, mass, [usePounds])`](#bmi)
    - [`bmi.setHeight(value)`](#bmisetheight)
    - [`bmi.setMass(value)`](#bmisetmass)
    - [`bmi.setAge(value)`](#bmisetage)
    - [`bmi.setGender(value)`](#bmisetgender)
    - [`bmi.usePounds(value)`](#bmiusepounds)
    - [`bmi.getRangeTable()`](#bmigetrangetable)
    - [`bmi.calc()`](#bmicalc)
  

## medkit

### `bmi(height, mass, [usePounds])`
Constructor

```js
const bmi = require('medkit').bmi;
bmi(180,80);
// => BMI {
//    index: null,
//    message: null,
//    gender: 'unknown',
//    age: null,
//    height: 180,
//    mass: 80,
//    measurement: 'kilograms/centimeters'
// }
```

#### `bmi.setHeight(value)`

Sets the patient's height
* `value` must be integer in centimeter or inch.

Note that this parameter is mandatory and may be set via the [constructor](#bmi)



#### `bmi.setMass(value)`

Sets the patient's age.
* `value` must be integer.

Based on the age the results may differ.

#### `bmi.setGender()`

Sets the patient's gender.
* `value` mixed
    * male
         * `char` m
         * `integer` 0
         * `string` male
         * `bool` false
    * female
         * `char` f
         * `char` w
         * `integer` 1
         * `string` female
         * `bool` true

Will be converted to `string` male|female. If none of the above matches, then it's unknown. Based on the gender the results may differ.

```js
bmi().setGender('m');      //male
bmi().setGender('false');  //male
bmi().setGender(1);        //female
```

#### `bmi.usePounds()`

Indicates if you want to use pounds/inches or kilograms/centimeters.
* `value` bool

Note that this parameter may be set via the [constructor](#bmi) and is initially set to `false`.
Will change the `measurement` automatically.

#### `bmi.getRangeTable()`

Will return the personalized BMI-Ranges with labels. 

```js
const bmi = require('medkit').bmi;
bmi(180,80).getRangeTable();
// => {
//    'Very severely underweight': '16',
//    'Severely underweight': '16-17',
//    'Underweight': '17-18.5',
//    'Healthy': '18.5-25',
//    'Overweight': '25-30',
//    'Obese Class I': '30-35',
//    'Obese Class II': '35-40',
//    'Obese Class III': '40'
// }
```

#### `bmi.calc()`

Will calculate the BMI and the comeout range. Will return the BMI Object with updated values.

```js
bmi(180,80).setGender('m').setAge(33).calc();
// => BMI {
//    index: 24.7,
//    message: 'Healthy',
//    gender: 'male',
//    age: 33,
//    height: 180,
//    mass: 80,
//    measurement: 'kilograms/centimeters'
// }
```

