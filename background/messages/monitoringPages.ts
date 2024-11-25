import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getInformation } from "~templates/getInformation"

const handler: PlasmoMessaging.MessageHandler<string> = async (req) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.url.includes("https://accounts.booth.pm/library")) {
            console.log("complete")
            chrome.scripting.executeScript({
                target: { tabId },
                func: getInformation
            })
        }
    })
}

export default handler
