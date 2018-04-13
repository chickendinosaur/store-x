'use strict';

import { Suite } from 'benchmark';
import 'lodash';

import { createReducer, createStore } from '../src';

const suite = new Suite();
const isBrowser = typeof window === 'object';

if (isBrowser) {
    // @ts-ignore
    window.Benchmark = Benchmark;
}

/*
Setup.
*/

const getInitialState1 = () => {
    return {
        a: null,
        b: null
    };
};

const actionMap1 = {
    a: (state, action) => {
        return {
            ...state,
            a: action.payload.updated
        };
    },
    b: (state, action) => {
        return {
            ...state,
            b: action.payload.updated
        };
    }
};

const reducer1 = createReducer('reducer1', getInitialState1, actionMap1);

const getInitialState2 = () => {
    return {
        c: null,
        d: null
    };
};

const actionMap2 = {
    c: (state, action) => {
        return {
            ...state,
            c: action.payload.updated
        };
    },
    d: (state, action) => {
        return {
            ...state,
            d: action.payload.updated
        };
    }
};

const reducer2 = createReducer('reducer2', getInitialState2, actionMap2);

const store = createStore([reducer1, reducer2]);

const subscriber = (state) => {
    return state;
};
store.addSubscriber(subscriber);

/*
Benchmark
*/

suite
    .add('createStore(reducer)', () => {
        createStore([reducer1, reducer2]);
    })
    .add('store.dispatchAction(action)', () => {
        store.dispatchAction({
            type: 'd',
            payload: {
                updated: true
            }
        });
    })
    .on('cycle', (event) => {
        let output = String(event.target);
        output = output.substring(0, output.indexOf('ops/sec') + 7);
        // tslint:disable-next-line
        console.log('\x1b[33m%s\x1b[0m', output);
    })
    .on('complete', () => {
        if (isBrowser) {
            window.close();
        }
    })
    // Run async
    .run({ async: false });