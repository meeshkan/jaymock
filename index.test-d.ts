import {expectType} from 'tsd';
import jaymock = require('.');

const jm = jaymock();

expectType<jaymock.Populated>(jm.populate({
    name: 'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})',
    ssn: 'chance.ssn',
    knownAddresses: {
        street: 'address.streetAddress',
        city: 'address.city',
        zipCode: 'address.zipCode',
        _repeat: 2
    },
    _repeat: 10
}));
expectType<void>(jm.extend('fn', () => 'unicorn'));
expectType<void>(jm.extend({'fn': () => 'unicorn'}));
expectType<void>(jm.setFakerLocale('fr'));
expectType<void>(jm.setFakerSeed(1337));