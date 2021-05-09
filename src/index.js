import lodash from 'lodash';
import * as fxjs from 'fxjs';
import * as S from 'fxjs/Strict';
import * as C from 'fxjs/Concurrency';
import * as L from 'fxjs/Lazy';

import moment from 'moment';

import ip from 'ip';
import * as ipUtil from 'ip-utils';

import './styles/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.lodash = lodash;
window.fxjs = fxjs;
window.S = S;
window.C = C;
window.L = L;

window.moment = moment;

window.ip = ip;

window.ipUtil = ipUtil;

ReactDOM.render(<App />, document.getElementById('root'));
