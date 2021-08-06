import { createStore } from 'redux';
function reducer(state = { number: 0 }) {
    return state;
}
let store = createStore(reducer);
export default store;