import core from 'mathjs/core';

const math = core.create();
math.import(require('mathjs/lib/function/arithmetic'));
math.import(require('mathjs/lib/expression'));

export default math;
