# React ENS Address Component

The Address component is a drop-in React component for your dapps. Anytime you need to take an address as an input, you can use the React ENS Address Component instead to resolve ENS names or provide feedback with reverse records.

![Default component vie](./src/doc/basic.png)

![Default component vie](./src/doc/reverse.png)

Please refer to `src/routes/Test.js` for examples.

Demo: http://localhost:3000/Test
E2E test: `cypress/integration/address.spec.js`

### Installation

React ENS Address Component can be installed via npm:

```bash
$ yarn add @ensdomains/react-ens-address
```

```bash
$ npm install --save @ensdomains/react-ens-address
```

### Basic usage

```
import AddressInput from '@ensdomains/react-ens-address'

<AddressInput provider={window.web3 || window.ethereum} />
```

#### Parameters:

- presetValue - sets a default value for the input
- provider - Web3 provider **(required)**
- placeholder - set custom placeholder. Default: 'Enter Ethereum name or address'
- showBlockies - show digital image based on address (similar to github). Default: true
- DefaultIcon: Component - Icon to show on the left when nothing has been typed. Default: null
- onError - callback. Invokes every time error is occurs or invalid name is typed. When typed name is corrected, invokes with null after error.
- onSuccess - callback. The same as onError callback, but invokes when address or name resolved.
- className - any custom class for styling. Already implemented `small` class renders component in small size

![Default component vie](./src/doc/small.png)

#### Styling

All styling made in `style.css`. It can be take as a start point.
`.cmp-address` - reserved class for that component.
`.cmp-address.small` - for small type of component. Overriding other classes under that parent you can safety style a component.
