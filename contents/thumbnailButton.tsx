import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendToBackground } from "@plasmohq/messaging";
import { createRoot } from "react-dom/client";
import type { PlasmoCSConfig } from "plasmo";
import React from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

function goToHomePage() {
    const currentUrl = new URL(window.location.href)
    const LibraryUrl = "https://accounts.booth.pm/library/gifts"

    if(String(currentUrl).indexOf(LibraryUrl) === 0) {
        window.location.href = LibraryUrl
    } else {
        window.location.href = "https://accounts.booth.pm/library"
    }
}

const getThumbnail = async() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, 1000)
    await fetch("http://localhost:8080/health", {
        mode: "cors",
        method: "GET",
        signal: controller.signal
    }).then((response) => {
        goToHomePage()
        clearTimeout(timeoutId)
        if (response.ok) {
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
        toast.error(
            <>
                「VRC-Avatar-Library.exe」が開かれていません<br />
                再度、開いてから処理を開始してください。
            </>
        )
    })
}

//plasmoのエラー対策 特に意味はなし 
const EmptyElement: React.FC = () => {
    return <></>
}

const CustomButton = () => {
    return (
        <>
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
            <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable
                theme="colored"
                transition={Bounce}
            />
        </>
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