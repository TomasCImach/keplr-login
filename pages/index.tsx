import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager
} from "@noahsaso/cosmodal"
import type { NextPage } from "next"
import { useCallback, useState, useEffect } from "react"
import {
  makeADR36AminoSignDoc,
  verifyADR36Amino
} from "@keplr-wallet/cosmos"
import { } from "@keplr-wallet/provider"
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { decodeSignature } from "@cosmjs/amino"
import keccak256 from "keccak256"
// import { getDirectusClient } from "../lib/directus";
import getConfig from "next/config";
import { Directus } from "@directus/sdk";

const { publicRuntimeConfig } = getConfig();
// const { url } = publicRuntimeConfig;
const url = "https://e36rwf6z.directus.app/"
const directus = new Directus(url, {
  auth: {
    mode: "cookie",
    autoRefresh: true,
  },
});

declare global {
  interface Window extends KeplrWindow { }
}

const Home: NextPage = () => {
  const { connect, disconnect } = useWalletManager()
  const {
    status: walletStatus,
    error,
    name,
    address,
    publicKey,
    signingCosmWasmClient,
    signingStargateClient,
    wallet,
    chainInfo
  } = useWallet()

  const [text, setText] = useState("empty")
  const [status, setStatus] = useState("")
  const [articles, setArticles] = useState({})
  const [accessToken, setAccessToken] = useState("")
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setText(keccak256((address + "LOOP JUNO")).toString('hex'))
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await directus.auth.static(accessToken);
        let refresh = await directus.auth
          .refresh()
          .then(() => {
            setAuthenticated(true);
          })
          .catch(() => { });
        if (!authenticated) {
          await authenticate()
        }
        const response = await directus.items("articles").readByQuery({
          fields: ['id', 'title'],
          sort: ['id'],
        });
        console.log("response", response)
        setArticles(response.data ?? {})
      } catch (e) {
        console.log("fetchData Error: ", e)
      }
    }

    fetchData().catch(console.error)
    // }, [accessToken]);
  }, [address]);

  const authenticate = async () => {
    try {
      console.log("authenticate please")
      if (!address) {
        // window.alert('Connect Wallet');
        return
      }
      const password = window.prompt('Password:');
      const email = address + "@fake.com"
      let login = password ? await directus.auth
        .login({ email, password })
        .then((res) => {
          console.log("login response: ", res)
          setAuthenticated(true);
        })
        .catch(() => {
          window.alert('Invalid credentials');
        }) : null;
    } catch (e) {
      console.log("authenticate Error: ", e)
    }
  }

  const logOut = async () => {
    console.log("log out")
    await directus.auth.logout();
    disconnect()
    window.location.reload();
  }

  // useEffect(() => {
  //   const authenticate = async () => {
  //     try {
  //       console.log("authenticate please")
  //       if (!address) {
  //         window.alert('Connect Wallet');
  //         return
  //       }
  //       const password = window.prompt('Password:');
  //       const email = address + "@fake.com"
  //       password ? await directus.auth
  //         .login({ email, password })
  //         .then(() => {
  //           setAuthenticated(true);
  //         })
  //         .catch(() => {
  //           window.alert('Invalid credentials');
  //         }) : null;
  //     } catch (e) {
  //       console.log("authenticate Error: ", e)
  //     }
  //   }
  //   if (!authenticated) {
  //     authenticate().catch(console.error)
  //   }
  // }, [address]);

  const signUp = useCallback(async () => {
    if (!address || !signingCosmWasmClient || !password) return
    // setStatus("Loading...")

    try {
      let signature
      if (chainInfo) {
        let client = await wallet?.getClient(chainInfo)
        signature = client ? await client.signArbitrary("juno", address, `Please sign transaction. Nonce: ${text}`) : undefined
      }
      // let verify = signature ? verifyADR36Amino(
      //   "juno",
      //   address,
      //   `Please sign transaction. Nonce: ${text}`,
      //   publicKey?.data ?? new Uint8Array([1, 2, 3]),
      //   decodeSignature(signature).signature
      //   // decodeSignature(signature.signature).signature
      // ) : false

      await fetch(`https://juno-signup-api.herokuapp.com/signUp?publicKey=${address}&pubKeyAsArray=${publicKey?.data}&signature=${decodeSignature(signature).signature}&password=${password}`)
        // await fetch(`http://127.0.0.1:8055/register-web3-user/signUp?publicKey=${address}&pubKeyAsArray=${publicKey?.data}&signature=${decodeSignature(signature).signature}&password=PASSWORDTEST123`)
        .then(response => response.json()).then(res => console.log("res", res))
      // console.log("verify", verify)
      // setStatus(verify ? "verified" : "not verified")
      window.location.reload();

    } catch (err) {
      console.error(err)
      setStatus(`Error: ${err instanceof Error ? err.message : `${err}`}`)
    }
  }, [address,/* contractAddress,*/ text, signingCosmWasmClient, publicKey, password])

  // const login = useCallback(async () => {
  //   console.log("address", address)
  //   if (!address) return
  //   try {
  //     const email = address + "@fake.com"
  //     console.log("email", email)
  //     const loginResponse = await directus.auth.login({ email, password });
  //     console.log("login response: ", loginResponse)
  //     setAccessToken(loginResponse.access_token)
  //   } catch (err) {
  //     console.error(err)
  //     setStatus(`Error: ${err instanceof Error ? err.message : `${err}`}`)
  //   }
  // }, [address, password])

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center">
      <div className="flex flex-col items-stretch gap-2 max-w-[90vw] max-h-[90vh]">
        <p>
          Authenticated: <b>{authenticated ? "true" : "false"}</b>
        </p>
        <p>
          Articles: <b>{JSON.stringify(articles)}</b>
        </p>
        {walletStatus === WalletConnectionStatus.Connected ? (
          <>
            <p>
              Text: <b>{text}</b>
            </p>
            <p>
              Name: <b>{name}</b>
            </p>
            <p>
              Address: <b>{address}</b>
            </p>
            <p>
              Public key:{" "}
              <b>
                {publicKey?.hex ?? '<empty>'}
              </b>
            </p>
            <button
              onClick={logOut}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70"
            >
              Disconnect
            </button>

            {/* <h2 className="text-lg mt-2">Message</h2>
            <textarea
              className="p-4 rounded-md outline font-mono"
              rows={10}
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
            /> */}

            <button
              onClick={signUp}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70 mt-4"
            >
              Sign Up
            </button>

            {/* <button
              onClick={login}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70 mt-4"
            >
              Log In
            </button> */}

            <input
              type="text"
              placeholder="Password"
              className="px-4 py-2 rounded-md outline"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />



            {status && (
              <pre className="overflow-scroll text-xs mt-2">{status}</pre>
            )}
          </>
        ) : (
          <>
            <button
              onClick={connect}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70"
            >
              Connect
            </button>
            {error ? (
              <p>{error instanceof Error ? error.message : `${error}`}</p>
            ) : undefined}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
