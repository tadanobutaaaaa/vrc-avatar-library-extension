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

let timerId = null
let onUpdatedListener = null

function mainProcess() {
    onUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (changeInfo.status === "complete" && tab.url.startsWith("https://accounts.booth.pm/library")) {
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
    console.log("タイマーを開始しました")
    timerId = setTimeout(() => {
        if (onUpdatedListener) {
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            console.log("すべての処理を停止しました")
            onUpdatedListener = null
        }
    }, 2000)
}

const handler: PlasmoMessaging.MessageHandler<string> = (req) => {
    chrome.storage.local.set({"start": true})
    processPage()
    mainProcess()
}

export default handler
