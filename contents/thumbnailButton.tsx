import { sendToBackground } from "@plasmohq/messaging";
import { createRoot } from "react-dom/client"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

const getThumbnail = async() => {
    const currentUrl = new URL(window.location.href)
    const LibraryUrl = "https://accounts.booth.pm/library"

    if(String(currentUrl).indexOf(LibraryUrl) === 0) {
        window.location.href = LibraryUrl
    } else {
        window.location.href = "https://accounts.booth.pm/gifts"
    }
    
    try{
        sendToBackground({
            name: "getThumbnail",
            body: {
                status: true
            }
        })
        await sendToBackground({
            name: "monitoringPages",
            body: {
                status: true
            }
        })
    } catch (error) {
        console.log("実行できませんでした:", error)
    }
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
    >処理開始</button>)
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