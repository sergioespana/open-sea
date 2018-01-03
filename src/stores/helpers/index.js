export * as firebase from './firebase';
import fromPairs from 'lodash/fromPairs';
import omitBy from 'lodash/omitBy';
import startsWith from 'lodash/startsWith';
import toPairs from 'lodash/toPairs';

const startsWithChar = (char) => (val, key) => startsWith(key, char);

export const omitKeysWith = (obj, char = '_') => omitBy(obj, startsWithChar(char));

export const prefixKeysWith = (obj, char = '_') => fromPairs(toPairs(obj).map((pair) => [`${char}${pair[0]}`, pair[1]]));