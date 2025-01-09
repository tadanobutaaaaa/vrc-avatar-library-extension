import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getInformation } from "~templates/getInformation"

function processPage() {
    console.log("処理が開始しました")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getInformation
        })
    })
}

function checkGoServer(intervalId: NodeJS.Timeout) {
    fetch("http://localhost:8080/health", {
        mode: "cors",
        method: "GET",
    }).then((response) => {
        console.log("Goサーバーの状態を確認します")
        if (response.ok) {
            console.log("Goサーバーの接続を確認できました")
            processPage()
            clearInterval(intervalId)
        } else {
            console.error("Goのサーバーが開いていません")
        }
    })
    .catch((error) => {
        console.log("Goのサーバーが開いていません")
    })
}

const handler: PlasmoMessaging.MessageHandler<string> = (req) => {
    const intervalId = setInterval(() => checkGoServer(intervalId), 2000);
    setTimeout(() => {
        clearInterval(intervalId);
    }, 6000);
}

export default handler
