'use strict';

import {
  RECEIVE_SEARCH_RESULT,
  BUSY_SEARCHING,
  // TAG_ADD_TAGS,
  TAG_REMOVE_TAG,
  TAG_ADD_SINGLE_TAG,
  FILTER_ON_CLICK,
  TILES_ADD_TILES,
  SET_SEARCH_STRING,
  UPDATE_DISPLAYED_ITEMS,
  SEARCH_ERROR,
  SET_AUTOCOMPLETE_ERROR,
  SET_AUTOCOMPLETE_OPTIONS,
  SET_AUTOCOMPLETE_IN_SEARCH,
  CLEAR_SEARCH_STRING
  // SHOW_ADD_MESSAGE,
  // HIDE_ADD_MESSAGE,
 } from '../constants/actionTypes';

import { mockTiles } from './utils/mockData.js';
import { shuffleMockedTilesIntoResultSet } from './utils/helpers.js';
import _ from 'lodash';

export const initialState = {
  displayedItems: [],
  items: [],
  bucketCount: 0,
  status: undefined,
  loading: false,
  tags: [],
  filterVisibleState: {},
  tiles: [],
  addMessageVisible: false,
  searchString: '',
  error: '',
  autocompleteError: '',
  autocompleteOptions: [],
  inAutoCompleteSearch: false // use to show loading spinner
};

export default function search (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_SEARCH_RESULT:
      const packages = state.displayedItems.filter(item => item.type === 'packageOffer'); // remove all articles and filter tiles
      const tiles = a.packageOffer.provider.reference
      const packageItems = _.uniqBy(_.union(action.items, packages), (a) => {
        if (a.packageOffer) a.packageOffer.provider.reference;
        else if (a.tile) a.tile.id;
      }); // check for duplicates
      const displayedItems = shuffleMockedTilesIntoResultSet(packageItems, state.tiles); // add filters back in
      const items = _.uniqBy(_.union(state.items, action.items), (a) => a.packageOffer.provider.reference); // add to packages store as well
      return {
        ...state,
        displayedItems,
        items,
        loading: false,
        error: ''
      };
    case UPDATE_DISPLAYED_ITEMS:
      const updatedTiles = shuffleMockedTilesIntoResultSet(action.items, state.tiles); // add the remaining tiles back in!
      return {
        ...state,
        displayedItems: updatedTiles
      };
    case BUSY_SEARCHING:
      return {
        ...state,
        loading: true
      };
    case SEARCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    // case TAG_ADD_TAGS:
    //   /*
    //   * use this action if there are an initial set of tags passed
    //   * through when the page is first loaded
    //   */
    //   return {
    //     ...state,
    //     tags: action.tags
    //   };
    case TAG_ADD_SINGLE_TAG:
      return {
        ...state,
        tags: _.uniqBy([...state.tags, action.tag], 'displayName')
      };
    case TAG_REMOVE_TAG:
      const newTags = state.tags.filter(tag => {
        return tag.displayName !== action.displayName;
      });
      return {
        ...state,
        tags: newTags,
        error: ''
      };
    case FILTER_ON_CLICK:
      return {
        ...state,
        filterVisibleState: {
          ...state.filterVisibleState,
          [action.displayName]: false
        },
        tiles: state.tiles.filter(tile => tile.displayName !== action.displayName)
      };
    case TILES_ADD_TILES:
      const tileArray = action.tileArray === undefined ? mockTiles : action.tileArray;
      const filterVisibleState = tileArray.reduce((obj, tile) => {
        if (tile.type === 'filter') {
          obj[tile.displayName] = true;
        }
        return obj;
      }, {});
      return {
        ...state,
        filterVisibleState,
        tiles: tileArray
      };
    case SET_SEARCH_STRING:
      return {
        ...state,
        searchString: action.searchString
      };
    case CLEAR_SEARCH_STRING:
      return {
        ...state,
        searchString: ''
      };
    case SET_AUTOCOMPLETE_ERROR:
      return {
        ...state,
        autocompleteError: action.error,
        inAutoCompleteSearch: false
      };
    case SET_AUTOCOMPLETE_OPTIONS:
      return {
        ...state,
        autocompleteOptions: action.items,
        inAutoCompleteSearch: false
      };
    case SET_AUTOCOMPLETE_IN_SEARCH:
      return {
        ...state,
        inAutoCompleteSearch: true
      };
    // case SHOW_ADD_MESSAGE:
    //   return ({
    //     ...state,
    //     addMessageVisible: true
    //   });
    // case HIDE_ADD_MESSAGE:
    //   return ({
    //     ...state,
    //     addMessageVisible: false
    //   });
    default:
      return state;
  }
}
