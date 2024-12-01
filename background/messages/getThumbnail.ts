import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getInformation } from "~templates/getInformation"

const handler: PlasmoMessaging.MessageHandler<string> = async (req) => {
    console.log("処理が開始しました")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getInformation
        })
    })
    console.log("正常に処理が終わりました")
}

export default handler
