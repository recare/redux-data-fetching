import reducer from '../lib/graphql-data-reducer';

describe('reducer', () => {
  describe('Differents types resources merging', () => {
    it('should differientates users and providers', () => {
      let result = reducer({
        users: [{
          id: "1",
          name: "Mark",
          age: 20,
          friends: [{
            id: "1"
          }]
        }],
        credentials: {
          token: "salut"
        },
        requestHistory: [{
          id: "0",
          method: "get"
        }, {
          id: "1",
          method: "post"
        }]
      }, {
        type: "GRAPHQL_DATA_RECEIVED",
        payload: {
          users: [{
            id: "0",
            name: "Alan"
          }, {
            id: "1",
            name: "Mark",
            friends: [{
              id: "0"
            }]
          }],
          providers: [{
            id: "0",
            name: "Facebook"
          }, {
            id: "1",
            name: "Google"
          }],
          profile: {
            roles: ["admin"]
          }
        }
      });
      expect(result).toEqual({
        users: [{
          id: "1",
          name: "Mark",
          age: 20,
          friends: [{
            id: "1"
          }]
        }, {
          id: "0",
          name: "Alan"
        }],
        credentials: {
          token: "salut"
        },
        requestHistory: [{
          id: "0",
          method: "get"
        }, {
          id: "1",
          method: "post"
        }],
        providers: [{
          id: "0",
          name: "Facebook"
        }, {
          id: "1",
          name: "Google"
        }],
        profile: {
          roles: ["admin"]
        }
      });
    });
  });
  describe('Resources removal', () => {
    it('Removes nested resources', () => {
      let state = {
        profile: {
          friends: [{
            id: 5,
            name: "Alan"
          }, {
            id: 10,
            name: "Mark",
          }, {
            id: 15,
            name: "Aaron"
          }],
          token: "mytoken"
        },
        appointments: [{
          id: 1,
          debutHour: 12
        }]
      };

      let removeRequest = {
        profile: {
          friends: [{id: 5}, {id: 15}],
          token: true
        },
        appointments: [{id: 1}]
      };

      let result = reducer(state, {type: "GRAPHQL_DATA_REMOVED", payload: removeRequest});
      expect(result).toEqual({
        profile: {
          friends: [{
            id: 10,
            name: "Mark"
          }]
        },
        appointments: []
      });
    });
    it('Handles non existing resources', () => {
      let state = {
        profile: {
          friends: [{
            id: 5,
            name: "Alan"
          }, {
            id: 10,
            name: "Mark"
          }, {
            id: 15,
            name: "Aaron"
          }],
          token: "mytoken"
        },
        appointments: [{
          id: 1,
          debutHour: 12
        }]
      };

      let removeRequest = {
        user: {
          token: true
        },
        profile: {
          token: true
        }
      };

      let result = reducer(state, {type: "GRAPHQL_DATA_REMOVED", payload: removeRequest});
      expect(result).toEqual({
        profile: {
          friends: [{
            id: 5,
            name: "Alan"
          }, {
            id: 10,
            name: "Mark"
          }, {
            id: 15,
            name: "Aaron"
          }],
        },
        appointments: [{
          id: 1,
          debutHour: 12
        }]
      });
    });
  });
});
