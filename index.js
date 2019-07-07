const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'pisiavh=1'));
const session = driver.session();
import faker from 'faker';

import createUsers from './factory/users.factory';
import { randomInteger } from './utils';

const USERS_COUNT = 100;
const MIN_USERS_CONNECTION = 3;
const MAX_USERS_CONNECTION = 10;
const REL_ARRAY = [
  'REL1',
  'REL2',
  'REL3',
  'REL4',
  'REL5',
  'REL6',
  'REL7',
  'REL8',
  'REL9',
  'REL10',
  'REL11',
  'REL12',
  'REL13',
  'REL14',
  'REL15',
  'REL16',
  'REL17',
  'REL18',
  'REL19',
];

function uniquenessGenerator(count, getFieldFunction) {
  const set = new Set();
  while (set.size !== count) {
    const generatedValue = getFieldFunction();
    set.add(generatedValue);
  }
  return Array.from(set);
}

const fullNames = uniquenessGenerator(USERS_COUNT, () => {
  return `${faker.name.firstName()} ${faker.name.lastName()}`;
});

const users = createUsers(USERS_COUNT, { firstName: fullNames, lastName: fullNames });
const usersVars = users.map(item => `${item.firstName}${item.lastName}`.replace(/[^A-Za-z]/g, ''));

const usersCypher = users.map(
  item =>
    `(${item.firstName.replace(/[^A-Za-z]/g, '')}${item.lastName.replace(
      /[^A-Za-z]/g,
      '',
    )}:Person {name: '${item.firstName.replace(/[^A-Za-z]/g, '')} ${item.lastName.replace(/[^A-Za-z]/g, '')}'})`,
);

// console.log(`CREATE${usersCypher.join(', ')}`);

console.log(`CREATE ${usersCypher.join(',')}`);

const resultPromise = session.run(`CREATE ${usersCypher.join(',\n')}`);
resultPromise
  .then(result => {
    session.close();

    // const singleRecord = result.records[0];
    // const node = singleRecord.get(0);

    // console.log(result);
    driver.close();
  })
  .catch(error => {
    console.log(error);
  });
