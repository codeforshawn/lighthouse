/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

const Audit = require('../../../audits/metrics/speed-index.js');
const assert = require('assert');
const Runner = require('../../../runner.js');
const options = Audit.defaultOptions;

const pwaTrace = require('../../fixtures/traces/progressive-app-m60.json');
const pwaDevtoolsLog = require('../../fixtures/traces/progressive-app-m60.devtools.log.json');

describe('Performance: speed-index audit', () => {
  it('works on a real trace', () => {
    const artifacts = Object.assign(Runner.instantiateComputedArtifacts(), {
      traces: {defaultPass: pwaTrace},
      devtoolsLogs: {defaultPass: pwaDevtoolsLog},
    });

    const settings = {throttlingMethod: 'provided'};
    return Audit.audit(artifacts, {options, settings}).then(result => {
      assert.equal(result.score, 1);
      assert.equal(result.rawValue, 605);
    });
  }, 10000);

  it('scores speed index of 845 as 100', () => {
    const artifacts = {
      traces: {},
      devtoolsLogs: {},
      requestSpeedIndex() {
        return Promise.resolve({timing: 845});
      },
    };

    return Audit.audit(artifacts, {options}).then(result => {
      assert.equal(result.score, 1);
      assert.equal(result.rawValue, 845);
    });
  });
});
