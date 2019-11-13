# jaymock

> Minimal fake JSON test data generator.

[![Install Size](https://packagephobia.now.sh/badge?p=@unmock/jaymock)](https://packagephobia.now.sh/result?p=@unmock/jaymock)

## Install

```
~ ❯❯❯ npm install jaymock
```

## Usage

```js
const jaymock = require('jaymock')

const data = {
  firstName: 'name.firstName',
  lastName: 'name.lastName',
  ssn: 'ssn',
  address: {
    streetAddress: 'address.streetAddress',
    city: 'address.city',
    zipCode: 'address.zipCode'
  },
  emails: 'internet.email',
  ipAddress: 'internet.ip',
  _repeat: 2
}

const jm = jaymock()

const randExp = require('randexp').randexp
jm.extend('ssn', () => randExp(/^\d{3}-\d{2}-\d{4}$/)) // Add custom functions using `jaymock.extend`

const fakeData = jm.populate(data)
/*
  [
    {
      firstName: 'Marguerite',
      lastName: 'Will',
      ssn: '076-86-6001',
      address: {
        streetAddress: '4509 Abernathy Port',
        city: 'Port Charles',
        zipCode: '26322'
      },
      emails: 'Missouri64@yahoo.com',
      ipAddress: '44.210.55.248'
    },
    {
      firstName: 'Fredrick',
      lastName: 'McClure',
      ssn: '610-42-4980',
      address: {
        streetAddress: '56363 Goyette Station',
        city: 'West Floydmouth',
        zipCode: '73634-6751'
      },
      emails: 'Aurore58@hotmail.com',
      ipAddress: '237.7.221.162'
    }
  ]
*/
```