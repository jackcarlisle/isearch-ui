import { BUSY_SEARCHING } from '../../src/constants/actionTypes';
import { expect } from 'chai';
import * as actions from '../../src/actions/search-results';
import simple from 'simple-mock';
import * as graphqlService from '../../src/services/graphql';
import mockResults from '../../src/utils/mock-search-results';

describe('actions', function () {
  afterEach(function (done) {
    simple.restore();
    done();
  });
  describe('search results', function () {
    describe('startSearch', function () {
      it('should dispatch an action to set loading to true', function (done) {
        // GIVEN
        const dispatch = simple.mock();
        // const state = simple.mock();
        simple.mock(graphqlService, 'query');
        const query = {passengers: [
          {
            birthday: '1986-07-14'
          },
          {
            birthday: '1986-07-14'
          }
        ]};
        // WHEN
        actions.startSearch(query)(dispatch);
        // THEN
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.arg.type).to.equal(BUSY_SEARCHING);
        done();
      });
      it('should dispatch an action fetchQuerySearchResults when graphql returns a json object', function (done) {
        // GIVEN
        const dispatch = simple.mock();
        const json = {
          data: {
            viewer: {
              searchResultId: {
                id: 12345
              }
            }
          }
        };
        simple.mock(graphqlService, 'query');
        graphqlService.query.resolveWith(json);
        // WHEN
        actions.startSearch()(dispatch);
        // THEN
        graphqlService.query.lastCall.returned.then(json => {
          expect(dispatch.lastCall.arg.name).to.equal('fetchQuerySearchResults_anonymousFn');
        });
        done();
      });
    });
    describe('fetchQuerySearchResults', function () {
      it('should dispatch an action fetchQuerySearchResults if no items have been returned from the graphql query', function (done) {
        // GIVEN
        const dispatch = simple.mock();
        const json = {
          data: {
            viewer: {
              searchResult: {
                items: []
              }
            }
          }
        };
        simple.mock(graphqlService, 'query');
        graphqlService.query.resolveWith(json);
        // WHEN
        actions.fetchQuerySearchResults()(dispatch);
        // THEN
        graphqlService.query.lastCall.returned.then(json => {
          expect(dispatch.lastCall.arg.name).to.equal('fetchQuerySearchResults');
        });
        done();
      });
      it('should dispatch an action receiveSearchResult if items have been returned from the graphql query', function (done) {
        // GIVEN
        const dispatch = simple.mock();
        const json = mockResults;
        simple.mock(graphqlService, 'query');
        graphqlService.query.resolveWith(json);
        // WHEN
        actions.fetchQuerySearchResults()(dispatch);
        // THEN
        graphqlService.query.lastCall.returned.then(json => {
          expect(dispatch.lastCall.arg.name).to.equal('receiveSearchResult');
        });
        done();
      });
    });
  });
});