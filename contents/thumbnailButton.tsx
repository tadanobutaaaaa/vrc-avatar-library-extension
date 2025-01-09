import { sendToBackground } from "@plasmohq/messaging";
import { createRoot } from "react-dom/client"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library", 
    "https://accounts.booth.pm/library?page=1",
    "https://accounts.booth.pm/library/gifts?page=1"]
}

const getThumbnail = async() => {
    try{
        await sendToBackground({
            name: "getThumbnail",
            body: {
                status: true
            }
        })
        /*
        await sendToBackground({
            name: "monitoringPages",
            body: {
                status: true
            }
        })
        */
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
    <a href="vrc-avatar-library://open">
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
    </a>
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