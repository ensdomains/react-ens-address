import React, {
  useState,
  useEffect,
  useRef,
  isValidElementType,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { setup as setupENS } from './ens'
import _ from 'lodash'
import {
  getEthAddressType,
  isAddress,
  ETH_ADDRESS_TYPE,
} from './utils/address.js'
import Loader from './Loader.js'
import { SingleNameBlockies } from './Blockies.js'
import warningImage from './assets/warning.svg'

import './style.css'

const ENS_NOT_FOUND = 'ENS name not found'

function Address(props) {
  const [resolvedAddress, setResolvedAddress] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isResolvingInProgress, setIsResolvingInProgress] = useState(false)
  const [error, setError] = useState(null)
  const [ENS, setENS] = useState(null)
  const currentInput = useRef()

  const inputDebouncerHandler = async (input) => {
    try {
      const result = await resolveName(input)
      if (input === currentInput.current) {
        setError(null)
        const { address, type, name } = result
        if (type === ETH_ADDRESS_TYPE.name) {
          setResolvedAddress(address)
        } else if (type === ETH_ADDRESS_TYPE.address) {
          setResolvedAddress(name)
        }

        props.onResolve(result)
        props.onError(null)
      }
      //if newest continue, otherwise ignore
    } catch (error) {
      setError(error.toString())
      setResolvedAddress(null)

      props.onResolve({
        address: input,
        name: null,
        type: null,
      })
      props.onError(error)
    }
  }

  const inputDebouncer = _.debounce(inputDebouncerHandler, 500)

  useEffect(() => {
    async function setup() {
      const options = {}
      if(props.ensAddress){
        options.ensAddress = props.ensAddress
      }
      if (props.provider) {
        options.customProvider = props.provider
      }
      const { ens } = await setupENS(options)
      setENS(ens)
    }
    setup()
  }, [props.provider])

  const handleInput = useCallback(
    async (address) => {
      if (!address || address.length === 0) {
        setInputValue('')
        setError(null)
        setResolvedAddress(null)

        if (inputDebouncer) {
          inputDebouncer.cancel()
        }
      }

      setInputValue(address)
      if (inputDebouncer) {
        inputDebouncer(address)
      }
    },
    [inputDebouncer]
  )

  useEffect(() => {
    if (props.presetValue.length !== 0) {
      handleInput(props.presetValue)
    }
  }, [props.presetValue, handleInput])

  if (!ENS) {
    return <Loader className="loader" />
  }

  const handleResolver = async (fn) => {
    try {
      setIsResolvingInProgress(true)
      setResolvedAddress(null)
      return await fn()
    } catch (error) {
      if (error && error.message && error.message === ENS_NOT_FOUND) return
      throw error
    } finally {
      setIsResolvingInProgress(false)
    }
  }

  const resolveName = async (inputValue) => {
    // update latest input resolving
    currentInput.current = inputValue
    const addressType = getEthAddressType(inputValue)

    if (addressType === ETH_ADDRESS_TYPE.name) {
      return await handleResolver(async () => ({
        input: inputValue,
        address: await ENS.getAddress(inputValue),
        name: inputValue,
        type: 'name',
      }))
    } else if (addressType === ETH_ADDRESS_TYPE.address) {
      return await handleResolver(async () => ({
        input: inputValue,
        name: (await ENS.getName(inputValue)).name,
        address: inputValue,
        type: 'address',
      }))
    }

    throw 'Incorrect address or name'
  }

  const isResolveNameNotFound = () => {
    return (
      !resolvedAddress &&
      inputValue &&
      !isResolvingInProgress &&
      getEthAddressType(inputValue) !== ETH_ADDRESS_TYPE.address
    )
  }

  const showBlockies = () => {
    if (props.showBlockies) {
      let address

      if (isAddress(inputValue)) {
        address = inputValue
      } else if (isAddress(resolvedAddress)) {
        address = resolvedAddress
      }

      if (address) {
        return (
          <SingleNameBlockies
            address={address.toLowerCase()}
            imageSize={30}
            className="blockies"
          />
        )
      }
    }
  }

  return (
    <div className={`cmp-address-wrapper ${props.className}`}>
      <div
        className={`cmp-address  ${resolvedAddress ? 'resolved' : ''} ${
          error ? 'error' : ''
        }`}
      >
        <div className="input-wrapper">
          <div className="indicator">
            {isResolvingInProgress && <Loader className="loader" />}
            {!isResolvingInProgress && showBlockies()}
            {isResolveNameNotFound() && (
              <img
                alt="warning icon"
                src={warningImage}
                className="icon-wrapper error-icon"
              />
            )}
            {props.DefaultIcon && !inputValue && <DefaultIcon />}
          </div>
          <input
            value={inputValue}
            onChange={(e) => handleInput(e.currentTarget.value)}
            placeholder={props.placeholder}
            spellCheck={false}
            name="ethereum"
          />
        </div>
        <div className="info-wrapper">
          {resolvedAddress && <div className="resolved">{resolvedAddress}</div>}
        </div>
      </div>
    </div>
  )
}

Address.propTypes = {
  provider: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  showBlockies: PropTypes.bool,
  DefaultIcon: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(
        `Invalid prop 'component' supplied to 'Route': the prop is not a valid React component`
      )
    }
  },
  onError: PropTypes.func,
  onResolve: PropTypes.func,
  className: PropTypes.string,
}

Address.defaultProps = {
  presetValue: '',
  placeholder: 'Enter Ethereum name or address',
  showBlockies: true,
  DefaultIcon: null,
  className: '',
  onError: function () {},
  onResolve: function () {},
}

export default Address
