import {
    WalletConnectionStatus,
    useWallet,
    useWalletManager
} from "@noahsaso/cosmodal"
import { useCallback, useState, useEffect } from "react"
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { decodeSignature } from "@cosmjs/amino"
import keccak256 from "keccak256"
import { Directus } from "@directus/sdk";
import { MyCollections, Articles, DirectusUsers } from "../../helpers/directusType";
import { stringify } from "querystring";

const url = "https://loop-markets.directus.app/"
const directus = new Directus<MyCollections>(url, {
    auth: {
        mode: "json",
        autoRefresh: true,
    },
});

// const apiUrl = 'http://localhost:8001/'
const apiUrl = 'https://juno-signup-api.herokuapp.com/'

declare global {
    interface Window extends KeplrWindow { }
}

// type Articles = {
//     id: string;
//     title: string;
// }

// type DirectusUsers = {
//     email: string;
//     password: string;
//     id: string;
//     signature: string;
//     role: string;
// }

// type MyCollections = {
//     articles: Articles;
//     directus_users: DirectusUsers;
// };

export default function Login() {
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
    const [textPassword, setTextPassword] = useState("empty")
    const [status, setStatus] = useState("")
    const [articles, setArticles] = useState({})
    const [accessToken, setAccessToken] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [authenticated, setAuthenticated] = useState(false)
    const [userId, setUserId] = useState<string>()

    useEffect(() => {
        console.log("userId Changed", userId)
        const fetchData = async () => {
            console.log("fetchData")
            let isAuthenticated = authenticated
            try {
                await directus.auth
                    .refresh()
                    .then((res) => {
                        // console.log(res)
                        setAuthenticated(true);
                        isAuthenticated = true
                    })
                    .catch(() => { });
                if (!isAuthenticated) {
                    console.log("isAuthenticated", isAuthenticated)
                    await authenticate()
                }
                // const response = await directus.items("articles").readByQuery({
                //     fields: ['id', 'title'],
                //     sort: ['id'],
                // });
                // console.log("response", response)
                // setArticles(response.data ?? {})
            } catch (e) {
                console.log("fetchData Error: ", e)
            }
        }
        if (userId) {
            fetchData().catch(console.error)
        }
    }, [userId]);

    useEffect(() => {
        console.log("address useEffect")
        const fetchUserId = async () => {
            let userId = address ? await userExists(address) : undefined
            console.log("user Id", userId)
            if (authenticated) {
                const currentId = (await directus.users.me.read({ fields: ['id'] })).id
                console.log("currentId", currentId)
                if (currentId !== userId || !userId) {
                    console.log("logout", currentId, userId)
                    await directus.auth.logout()
                    window.location.reload();
                }
            }
            setUserId(userId)
        }

        setText(keccak256((address + "LOOP JUNO")).toString('hex'))
        setTextPassword(keccak256((address + "LOOP JUNO PASSWORD1")).toString('hex'))
        if (address) {
            fetchUserId().catch(console.error)
        }
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

    const resetPassword = async () => {
        if (!address || !signingCosmWasmClient || !newPassword) return

        if (!checkPassword(newPassword)) return

        try {
            let passwordResetNonce
            await fetch(`${apiUrl}getPasswordResetNonce?publicKey=${address}`)
                .then(response => response.json()).then(res => {
                    if (res.passwordResetNonce) {
                        passwordResetNonce = res.passwordResetNonce
                    } else {
                        passwordResetNonce = undefined
                    }
                })

            let signature
            if (chainInfo && passwordResetNonce) {
                let client = await wallet?.getClient(chainInfo)
                signature = client ? await client.signArbitrary("juno", address, `Please sign transaction. Nonce: ${passwordResetNonce}`) : undefined
            }

            if (signature) {
                await fetch(`${apiUrl}resetPassword?publicKey=${address}&pubKeyAsArray=${publicKey?.data}&signature=${signature ? decodeSignature(signature).signature : null}&password=${newPassword}`)
                    .then(response => response.json()).then(res => console.log("res", res))
                if (authenticated) {
                    await directus.auth.logout()
                }
                window.location.reload();
            }
        } catch (e) {
            console.log("resetPassword Error: ", e)
        }
    }

    async function userExists(address: string): Promise<string | undefined> {
        console.log("userExists before require")
        if (!address || !signingCosmWasmClient) return undefined
        console.log("userExists after require")
        try {
            let response
            await fetch(`${apiUrl}userExists?publicKey=${address}`)
                .then(response => response.json()).then(res => {
                    if (res.id) {
                        console.log("User exists with ID: ", res.id)
                        response = res.id
                    } else {
                        console.log("User does not exists.")
                        response = undefined
                    }
                })
            console.log("response", response)
            return response
        } catch (e) {
            console.log("resetPassword Error: ", e)
        }
    }

    const logOut = async () => {
        console.log("log out")
        if (authenticated) {
            await directus.auth.logout()
        }
        disconnect()
        window.location.reload();
    }

    function checkPassword(password : string) : Boolean {
        let strongPassword = new RegExp("/(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{';'?>.<,])(?!.*\\s).*$/")

        if(strongPassword.test(password)) {
            console.log("strong password")
            setStatus("")
            return true
        } else {
            console.log("weak password")
            setStatus("Password must be 8 characters with at least 1 uppercase, 1 smallcase and 1 special character")
            return false
        }
    }

    const signUp = useCallback(async () => {
        if (!address || !signingCosmWasmClient || !password) return
        // setStatus("Loading...")

        if (!checkPassword(password)) return
        
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

            await fetch(`${apiUrl}signUp?publicKey=${address}&pubKeyAsArray=${publicKey?.data}&signature=${signature ? decodeSignature(signature).signature : null}&password=${password}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    console.log("first then response: ", response)
                    throw new Error('something went wrong')
                }).then(res => console.log("res", res)).catch(err => console.log("errpr", err))
            window.location.reload();

        } catch (err) {
            console.log("error", err)
            setStatus(`Error: ${err instanceof Error ? err : `${err}`}`)
        }
    }, [address,/* contractAddress,*/ text, signingCosmWasmClient, publicKey, password])

    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center">
            <div className="flex flex-col items-stretch gap-2 max-w-[90vw] max-h-[90vh]">
                <br />
                <br />
                <p>
                    Authenticated: <b>{authenticated ? "true" : "false"}</b>
                </p>
                {/* <p>
                    Articles: <b>{JSON.stringify(articles)}</b>
                </p> */}
                {walletStatus === WalletConnectionStatus.Connected ? (
                    <>
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

                        {userId === undefined &&
                            <>
                                <button
                                    onClick={signUp}
                                    className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70 mt-4"
                                >
                                    Sign Up
                                </button>

                                <input
                                    type="text"
                                    placeholder="Password"
                                    className="px-4 py-2 rounded-md outline"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </>
                        }

                        {userId !== undefined &&
                            <>
                                <button
                                    onClick={resetPassword}
                                    className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70 mt-4"
                                >
                                    Reset Password
                                </button>

                                <input
                                    type="text"
                                    placeholder="New Password"
                                    className="px-4 py-2 rounded-md outline"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                />
                            </>
                        }

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