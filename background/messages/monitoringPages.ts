import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getInformation } from "~templates/getInformation"

let timerId = null
let onUpdatedListener = null

const handler: PlasmoMessaging.MessageHandler<string> = async (req) => {
    onUpdatedListener = (tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.url.includes("https://accounts.booth.pm/library")) {
            console.log("complete")
            chrome.scripting.executeScript({
                target: { tabId },
                func: getInformation
            })
        }
    }

    chrome.tabs.onUpdated.addListener(onUpdatedListener)
    console.log("監視状態に入ります")

    timer()
}

function timer() {
    if (timerId !== null) {
        clearTimeout(timerId)
        console.log('タイマーをリセットしました')
    }
    timerId = setTimeout(() => {
        console.log("タイマーが終了しました")
        if (onUpdatedListener) {
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            console.log("処理を停止しました")
            onUpdatedListener = null
        }
    }, 1000)

    console.log("タイマーを開始しました")
}

export default handler