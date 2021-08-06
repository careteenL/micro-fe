let store = await import('teamb/store');
let Dropdown = await import('teamb/Dropdown');
let LoginModal = await import('./LoginModal');
import isArray from 'is-array';
console.log(store);
export default `(Homepage[${Dropdown.default}][${LoginModal.default}][${isArray.name}])`;