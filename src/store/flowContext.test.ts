import Localization from '../services/Localization';
import Constants from './constants';
import { v4 as generateUUID } from 'uuid';
import reducer, {
    contactFields as contactFieldsReducer,
    definition as definitionReducer,
    dependencies as dependenciesReducer,
    groups as groupsReducer,
    initialState,
    localizations as localizationsReducer,
    resultNames as resultNamesReducer,
    nodes as nodesReducer,
    updateDefinition,
    updateDependencies,
    updateLocalizations,
    updateResultNames,
    updateNodes,
    RenderNodeMap
} from './flowContext';
import { configProviderContext } from '../testUtils';
import { FlowDefinition } from '../flowTypes';
import { Types } from '../config/typeConfigs';

const boringFlow = require('../../__test__/flows/boring.json') as FlowDefinition;
const emptyFlow = require('../../__test__/flows/empty.json') as FlowDefinition;

describe('flowContext action creators', () => {
    describe('updateDefinition', () => {
        it('should create an action to update definition state', () => {
            const expectedAction = {
                type: Constants.UPDATE_DEFINITION,
                payload: {
                    definition: boringFlow
                }
            };

            expect(updateDefinition(boringFlow)).toEqual(expectedAction);
        });
    });

    describe('updateDependencies', () => {
        it('should create an action to update dependencies state', () => {
            const dependencies = [emptyFlow];
            const expectedAction = {
                type: Constants.UPDATE_DEPENDENCIES,
                payload: {
                    dependencies
                }
            };

            expect(updateDependencies(dependencies)).toEqual(expectedAction);
        });
    });

    describe('updateLocalizations', () => {
        it('should create an action to update localizations state', () => {
            const iso = 'spa';
            const localizations = [
                Localization.translate(
                    boringFlow.nodes[0].actions[0],
                    iso,
                    configProviderContext.languages,
                    boringFlow[iso]
                )
            ];
            const expectedAction = {
                type: Constants.UPDATE_LOCALIZATIONS,
                payload: {
                    localizations
                }
            };

            expect(updateLocalizations(localizations)).toEqual(expectedAction);
        });
    });

    describe('updateResultNames', () => {
        it('should create an action to update resultNames state', () => {
            const resultNames = [{ name: 'run.results.color', description: 'Result for "color"' }];
            const expectedAction = {
                type: Constants.UPDATE_RESULT_NAMES,
                payload: {
                    resultNames
                }
            };

            expect(updateResultNames(resultNames)).toEqual(expectedAction);
        });
    });
});

describe('flowContext reducers', () => {
    describe('definition reducer', () => {
        const reduce = action => definitionReducer(undefined, action);

        it('should return initial state', () => {
            expect(reduce({})).toEqual(initialState.definition);
        });

        it('should handle UPDATE_DEFINITION', () => {
            const action = updateDefinition(emptyFlow);
            expect(reduce(action)).toEqual(emptyFlow);
        });
    });

    describe('dependencies reducer', () => {
        const reduce = action => dependenciesReducer(undefined, action);

        it('should return initial state', () => {
            expect(reduce({})).toEqual(initialState.dependencies);
        });

        it('should handle UPDATE_DEPENDENCIES', () => {
            const dependencies = [emptyFlow];
            const action = updateDependencies(dependencies);

            expect(reduce(action)).toEqual(dependencies);
        });
    });

    describe('localizations reducer', () => {
        const reduce = action => localizationsReducer(undefined, action);

        it('should return initial state', () => {
            expect(reduce({})).toEqual(initialState.localizations);
        });

        it('should handle UPDATE_LOCALIZATIONS', () => {
            const iso = 'spa';
            const localizations = [
                Localization.translate(
                    boringFlow.nodes[0].actions[0],
                    iso,
                    configProviderContext.languages,
                    boringFlow[iso]
                )
            ];
            const action = updateLocalizations(localizations);

            expect(reduce(action)).toEqual(localizations);
        });
    });

    describe('resultNames reducer', () => {
        const reduce = action => resultNamesReducer(undefined, action);

        it('should return initial state', () => {
            expect(reduce({})).toEqual(initialState.resultNames);
        });

        it('should handle UPDATE_RESULT_NAMES', () => {
            const resultNames = [{ name: 'run.results.color', description: 'Result for "color"' }];
            const action = updateResultNames(resultNames);

            expect(reduce(action)).toEqual(resultNames);
        });
    });

    describe('nodes reducer', () => {
        const reduce = action => nodesReducer(undefined, action);

        it('should return initial state', () => {
            expect(reduce({})).toEqual(initialState.nodes);
        });

        it('should handle UPDATE_NODES', () => {
            const nodes: RenderNodeMap = {
                nodeA: {
                    node: { uuid: 'nodeA', actions: [], exits: [] },
                    ui: { position: { left: 100, top: 100 } },
                    inboundConnections: {}
                }
            };
            const action = updateNodes(nodes);

            expect(reduce(action)).toEqual(nodes);
        });
    });
});
