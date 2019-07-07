import { Factory } from 'rosie';
import faker from 'faker';
import { mapCount, randomInteger } from '../utils';

Factory.define('user')
  .sequence('id')
  .attr('firstName', ['firstName', 'id'], function(fullNames, id) {
    const [firstName, _] = fullNames[id - 1].split(' ');
    return firstName;
  })
  .attr('lastName', ['lastName', 'id'], function(fullNames, id) {
    const [_, lastName] = fullNames[id - 1].split(' ');
    return lastName;
  });

export default (count = 10, params = {}) => mapCount(count, () => Factory.build('user', params));
