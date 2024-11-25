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
/*
const imageList: string[] = []
    while (true) {
        const elements: HTMLCollection = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
        for(let i = 0; i < elements.length; i++) {
            //console.log(elements[i].getElementsByClassName("l-library-item-thumbnail"))
            const imageDiv: string = elements[i].querySelector("img:first-child").getAttribute('src')
            console.log(imageDiv)
            imageList.push(imageDiv)
        }
        const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
        if (nextButton.length === 0) {
            console.log("すべてのページを処理しました。")
            break
        }
        console.log(imageList,"リストの中身")
        nextButton[0].click()
        await new Promise(resolve => setTimeout(resolve, 3000))
    }
*/
export default handler
