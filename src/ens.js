import { setupENS } from '@ensdomains/ui'

let ens = {}

export async function setup({
  reloadOnAccountsChange,
  customProvider,
  ensAddress,
}) {
  const { ens: ensInstance } = await setupENS({
    reloadOnAccountsChange,
    customProvider,
    ensAddress,
  })
  ens = ensInstance

  return { ens }
}

export default function getENS() {
  return ens
}
