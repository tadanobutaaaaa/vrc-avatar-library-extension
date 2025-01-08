import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getInformation } from "~templates/getInformation"

let timerId = null
let onUpdatedListener = null

const handler: PlasmoMessaging.MessageHandler<string> = async (req) => {
    onUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (changeInfo.status === "complete" && tab.url.includes("https://accounts.booth.pm/library")) {
            if (timerId !== null) {
                clearTimeout(timerId)
                timer()
            }
            chrome.scripting.executeScript({
                target: { tabId },
                func: getInformation
            })
        }
    }

    chrome.tabs.onUpdated.addListener(onUpdatedListener)
    timer()
}

function timer() {
    timerId = setTimeout(() => {
        if (onUpdatedListener) {
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            console.log("処理を停止しました")
            onUpdatedListener = null
        }
    }, 2000)
}

export default handler