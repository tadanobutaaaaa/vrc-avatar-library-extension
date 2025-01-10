import { ToastContainer, toast } from 'react-toastify'
import { sendToBackground } from "@plasmohq/messaging"
import { createRoot } from "react-dom/client"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

function goToHomePage() {
    const currentUrl = new URL(window.location.href)
    const LibraryUrl = "https://accounts.booth.pm/library"

    if(String(currentUrl).indexOf(LibraryUrl) === 0) {
        window.location.href = LibraryUrl
    } else {
        window.location.href = "https://accounts.booth.pm/gifts"
    }
}

const getThumbnail = async() => {
    chrome.storage.local.set({"start": true})
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, 2000)
    await fetch("http://localhost:8080/health", {
        mode: "cors",
        method: "GET",
        signal: controller.signal
    }).then((response) => {
        clearTimeout(timeoutId)
        console.log("Goサーバーの状態を確認します")
        if (response.ok) {
            console.log("Goサーバーの接続を確認できました")
            sendToBackground({
                name: "activeGolangServer",
                body: {
                    status: true
                }
            })
        }
    })
    .catch((error) => {
        clearTimeout(timeoutId)
        console.log("Goのサーバーが開いていません")
        sendToBackground({
            name: "getThumbnail",
            body: {
                status: true
            }
        })
        window.location.href = "vrc-avatar-library://open"
    })
    goToHomePage()
}

//plasmoのエラー対策 特に意味はなし 
const EmptyElement: React.FC = () => {
    return <></>
}

const CustomButton = () => {   
    return (
        <button
            style={{
            backgroundColor: "#38B2AC",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
            }}
            onClick={getThumbnail}
        >処理開始</button>
    )
}

window.addEventListener("load", () => {
    const target = document.querySelector("ul")
    if (!target) return

    const container = document.createElement("div")
    target.after(container)

    const root = createRoot(container)
    root.render(<CustomButton />)
})

export default EmptyElement