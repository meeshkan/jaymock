import {expectType} from 'tsd';
import jaymock = require('.');

expectType<{template: jaymock.Template, functions: jaymock.Functions}>(jaymock());
expectType<jaymock.Populated>(jaymock.populate({
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
expectType<void>(jaymock.extend('fn', () => 'unicorn'));
expectType<void>(jaymock.extend({'fn': () => 'unicorn'}));
expectType<void>(jaymock.setFakerLocale('fr'));
expectType<void>(jaymock.setFakerSeed(1337));