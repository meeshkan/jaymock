declare namespace jaymock {
    type ExtensionName = string | {[key: string]: Function};
    type Functions = {[key: string]: Function};
    type Instance = {template: jaymock.Template, functions: jaymock.Functions}
    interface Template {
        [key: string]: string | number | Template;
    }
    interface Populated {
        [key: string]: unknown | Array<Populated> | Populated;
    }
    interface Method {
        /**
        Instantiates an empty `JayMock` object.
        */
        (): {template: jaymock.Template, functions: jaymock.Functions}

        /**
        Populates the template object with fake data.
        @param template - A [`template`](https://github.com/unmock/jaymock#template) object to populate.
        @returns An `object` populated with fake data.
        */
        populate(template: jaymock.Template): jaymock.Populated;

        /**
        Adds a custom data generation function that can be called in the `populate` `template` object using the value of its `name`.
        @param name - A `string` used to refer to the `body` function.
        @param body - A `function` that can be referred to in the `template` object.
        */
        extend(name: jaymock.ExtensionName, body?: Function): void;

        /**
        Sets `Faker.js`'s language locale.
        @param locale - `Faker.js` locale.
        */
        setFakerLocale(locale: string): void;

        /**
        Sets `Faker.js`'s randomness seed.
        @param seed - `Faker.js` randomness seed.
        */
        setFakerSeed(seed: number): void;
    }
}

declare function jaymock(): jaymock.Method;

export = jaymock;