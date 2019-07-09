import { validateName } from '@ensdomains/ui'
import { utils } from 'ethers'

export const ETH_ADDRESS_TYPE = {
  name: 'name',
  address: 'address',
  error: 'error'
}

export function isAddress(address) {
  try {
    utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}

export function getEthAddressType(address) {
  if (!address) return ETH_ADDRESS_TYPE.error

  if (isAddress(address)) {
    return ETH_ADDRESS_TYPE.address
  }

  try {
    validateName(address)
    return ETH_ADDRESS_TYPE.name
  } catch (e) {
    return ETH_ADDRESS_TYPE.error
  }
}
