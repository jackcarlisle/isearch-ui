import {
  RECEIVE_SEARCH_RESULT,
  BUSY_SEARCHING,
  // TAG_ADD_TAGS,
  TAG_REMOVE_TAG,
  RESET_TAGS,
  SEARCH_ERROR,
  TAG_ADD_SINGLE_TAG,
  FILTER_ON_CLICK,
  SET_SEARCH_STRING,
  TILES_ADD_TILES,
  SET_AUTOCOMPLETE_ERROR,
  SET_AUTOCOMPLETE_OPTIONS,
  SET_AUTOCOMPLETE_IN_SEARCH,
  CLEAR_SEARCH_STRING,
  UPDATE_HEADER_TITLES,
  SAVE_SOCKET_CONNECTION_ID,
  SET_FINGERPRINT,
  SAVE_SEARCH_RESULT_ID,
  SAVE_BUCKET_ID,
  UPDATE_DISPLAYED_ITEMS,
  CLEAR_FEED,
  TILES_REMOVE_TILE
} from '../../src/constants/actionTypes';

import { expect } from 'chai';
import reducer, { initialState } from '../../src/reducers/search';
import mockResults from '../../src/utils/mock-search-results.json';
import { mockTiles } from '../../src/reducers/utils/mockData.js';
import mockItem from '../../src/utils/mock-item.js';
// import { shuffleTilesIntoResults } from '../../src/reducers/utils/helpers.js';

const mockItems = [mockResults.items[0]]; // an array with one packageOffer

const initialStateWithTiles = {
  ...initialState,
  tiles: mockTiles
};

describe('Search Reducer', () => {
  it('should return the initial state', (done) => {
    const state = reducer(undefined, {});
    expect(state).to.deep.equal(initialState);
    done();
  });
  it('SET_FINGERPRINT: should save the fingerprint', done => {
    const action = {type: SET_FINGERPRINT, fingerprint: '123456789012345'};
    const state = reducer(undefined, action);
    const expectedState = {
      ...initialState,
      fingerprint: action.fingerprint
    };
    expect(state).to.deep.equal(expectedState);
    done();
  });
  describe('Search actions', () => {
    it(`RECEIVE_SEARCH_RESULT:-> adds items from action to the items
        state and if the number of displayedItems is less than 5 will
        set it to the first 5 elements of items. Also sets loading to false`, (done) => {
      const action = {type: RECEIVE_SEARCH_RESULT, items: mockItems};
      const state = reducer(undefined, action);
      const items = mockItems.concat(mockTiles);
      const expectedState = {
        ...initialState,
        items,
        displayedItems: items.slice(0, 5),
        loading: false
      };
      expect(state).to.deep.equal(expectedState);
      expect(state.loading).to.be.false;
      done();
    });
    it(`RECEIVE_SEARCH_RESULT-> sets displayedItems to the existing state if
      it has length greater than 5`, (done) => {
      const initialStateWithItems = {
        ...initialState,
        items: mockItems,
        displayedItems: mockItems
      };
      const action = {
        type: RECEIVE_SEARCH_RESULT,
        items: mockItems
      };
      const state = reducer(initialStateWithItems, action);
      expect(state.loading).to.be.false;
      expect(state.items).to.deep.equal(mockItems);
      expect(state.displayedItems).to.deep.equal(mockItems);
      done();
    });
    it(`UPDATE_DISPLAYED_ITEMS: -> adds items from action to the displayedItems
        state`, (done) => {
      const action = {type: UPDATE_DISPLAYED_ITEMS, items: mockItems};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        displayedItems: mockItems
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`CLEAR_FEED: -> sets the items and displayedItems to empty
        state`, (done) => {
      const action = {type: CLEAR_FEED};
      const state = reducer(undefined, action);
      expect(state).to.deep.equal(initialState);
      done();
    });
    it('BUSY_SEARCHING -> sets loading to true', (done) => {
      const action = {type: BUSY_SEARCHING, isBusy: true};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        loading: true
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`SEARCH_ERROR: sets loading to false and sets the error state to
        action.error`, (done) => {
      const action = {type: SEARCH_ERROR, error: 'error'};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        loading: false,
        error: 'error'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('SET_SEARCH_STRING -> updates the searchString in the state', (done) => {
      const action = {type: SET_SEARCH_STRING, searchString: 'hello'};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        searchString: 'hello'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('CLEAR_SEARCH_STRING -> sets the searchString to empty in the state', (done) => {
      const action = {type: CLEAR_SEARCH_STRING};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        searchString: ''
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('SAVE_SEARCH_RESULT_ID -> saves the search result id', (done) => {
      const action = {type: SAVE_SEARCH_RESULT_ID, id: '12345'};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        resultId: '12345'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('SAVE_BUCKET_ID -> saves the buckeId', (done) => {
      const action = {type: SAVE_BUCKET_ID, id: '12345'};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        bucketId: '12345'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
  });
  describe('Tag and Tile actions', () => {
    it(`TAG_ADD_SINGLE_TAG -> adds action.tag to the state if it doesnt already
        exist`, (done) => {
      const initialStateWithTags = {
        ...initialState,
        tags: [{ displayName: 'hello' }]
      };
      const action = {type: TAG_ADD_SINGLE_TAG, tag: {displayName: 'world'}, isInitialTag: false};
      const state = reducer(initialStateWithTags, action);
      const expectedState = {
        ...initialState,
        tags: [{ displayName: 'hello' }, {displayName: 'world'}],
        isInitialTag: false
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('TAG_ADD_SINGLE_TAG -> doesnt add the tag if it already exists', (done) => {
      const initialStateWithTags = {
        ...initialState,
        tags: [{ displayName: 'hello' }]
      };
      const action = {type: TAG_ADD_SINGLE_TAG, tag: {displayName: 'hello'}, isInitialTag: false};
      const state = reducer(initialStateWithTags, action);
      const expectedState = {
        ...initialState,
        tags: [{ displayName: 'hello' }],
        isInitialTag: false
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('TAG_ADD_SINGLE_TAG -> if isInitialTag is true creates a tags array and sets it to the tags state', (done) => {
      const action = {type: TAG_ADD_SINGLE_TAG, tag: {displayName: 'hello'}};
      const initialStateWithTags = {
        ...initialState,
        isInitialTag: true
      };
      const state = reducer(initialStateWithTags, action);
      const expectedState = {
        ...initialState,
        tags: [{ displayName: 'hello' }],
        isInitialTag: false
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('TAG_REMOVE_TAG -> removes action.tag from the tags array', (done) => {
      const initialStateWithTags = {
        ...initialState,
        tags: [{ displayName: 'hello' }]
      };
      const action = {type: TAG_REMOVE_TAG, displayName: 'hello'};
      const state = reducer(initialStateWithTags, action);
      const expectedState = {
        ...initialState,
        tags: []
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('RESET_TAGS -> sets tags array to action.tags', (done) => {
      const initialStateWithTags = {
        ...initialState,
        tags: [{ displayName: 'hello' }],
        isInitialTag: false
      };
      const action = {type: RESET_TAGS, tags: [{displayName: 'test', id: 'id'}]};
      const state = reducer(initialStateWithTags, action);
      const expectedState = {
        ...initialState,
        tags: [{displayName: 'test', id: 'id'}],
        isInitialTag: true
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`FILTER_ON_CLICK -> updates the filter visible state and removes the tile
        from the tiles array`, (done) => {
      const action = {type: FILTER_ON_CLICK, displayName: 'Wifi'};
      const initialStateWithFilters = {
        ...initialStateWithTiles,
        filterVisibleState: {
          'Wifi': true
        }
      };
      const state = reducer(initialStateWithFilters, action);
      const expectedState = {
        ...initialState,
        filterVisibleState: {
          'Wifi': false
        },
        tiles: mockTiles.filter(tile => tile.displayName !== 'Wifi')
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`TILES_ADD_TILES -> adds the tiles to the state and sets the
        filterVisibleState`, (done) => {
      const action = {type: TILES_ADD_TILES};
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        tiles: mockTiles,
        filterVisibleState: {
          'Wifi': true,
          'Kids': true,
          'All inclusive': true
        }
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it('TILES_REMOVE_TILE -> removes a tile from the displayed items', (done) => {
      const initialStateWithItems = {
        ...initialState,
        displayedItems: [mockItem]
      };
      const action = {type: TILES_REMOVE_TILE, id: 'e73e4919e237887f70f6024011502243'};
      const state = reducer(initialStateWithItems, action);
      console.log(state);
      const expectedState = {
        ...initialState,
        displayedItems: []
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
  });
  describe('Autocomplete actions', () => {
    it(`SET_AUTOCOMPLETE_OPTIONS -> updates the autocompleteOptions state with
        the items and sets inAutocompleteSearch to false`, (done) => {
      const action = { type: SET_AUTOCOMPLETE_OPTIONS, items: [{}] };
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        autocompleteOptions: [{}],
        inAutoCompleteSearch: false
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`SET_AUTOCOMPLETE_ERROR -> updates the autocompleteError state with
        the error`, (done) => {
      const action = { type: SET_AUTOCOMPLETE_ERROR, error: 'error' };
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        autocompleteError: 'error',
        inAutoCompleteSearch: false
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
    it(`SET_AUTOCOMPLETE_IN_SEARCH -> sets the inAutoCompleteSearch state to
        true`, (done) => {
      const action = { type: SET_AUTOCOMPLETE_IN_SEARCH };
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        inAutoCompleteSearch: true
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
  });
  describe('Header Title update action', () => {
    it(`UPDATE_HEADER_TITLES -> updates the adult, child and duration title
        states`, (done) => {
      const action = { type: UPDATE_HEADER_TITLES };
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        numberOfAdultsTitle: 2,
        numberOfChildrenTitle: 0,
        durationTitle: '1 uge',
        numberOfAdults: 2,
        numberOfChildren: 0,
        duration: '1 uge'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
  });
  describe('Web socket connection id save action', () => {
    it(`SAVE_SOCKET_CONNECTION_ID -> saves action.id as socketConnectionId`, (done) => {
      const action = { type: SAVE_SOCKET_CONNECTION_ID, id: '12345' };
      const state = reducer(undefined, action);
      const expectedState = {
        ...initialState,
        socketConnectionId: '12345'
      };
      expect(state).to.deep.equal(expectedState);
      done();
    });
  });
});
