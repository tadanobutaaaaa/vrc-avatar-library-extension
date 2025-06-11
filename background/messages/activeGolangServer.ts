import type { PlasmoMessaging } from "@plasmohq/messaging"

function getInformation() {
    async function mainProcessing() {
        //現在のurlを取得する
        const currentUrl = new URL(window.location.href)
        let pageNumber = currentUrl.searchParams.get('page')
        if (pageNumber == null) {
            pageNumber = '1'
        }

        //すべての商品を取得する
        const pageList = []
        const elements = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
        for(let i = 0; i < elements.length; i++) {
            //画像のリンクを取得する
            const imageSrc = elements[i].querySelector("img:first-child").getAttribute('src')

            //商品のURLを取得する -> 商品のIDのみを取得する
            const imagehref = elements[i].querySelector("a:first-child").getAttribute("href")
            const itemId = imagehref.replace("https://booth.pm/ja/items/","")

            //フォルダの郡を取得する
            const fileNameGroup = elements[i].getElementsByClassName("mt-16 desktop:flex desktop:justify-between desktop:items-center")

            const fileList: string[] = []
            for(let j = 0; j < fileNameGroup.length; j++) {
                //フォルダの名前を取得する
                const fileName = fileNameGroup[j].getElementsByClassName("typography-14 !preserve-half-leading")
                //文字だけを取得する
                const fileText = fileName[0].textContent
                const fileReplaceZip = fileText.replace(".zip", "")
                fileList.push(fileReplaceZip)
            }

            pageList.push({
                [String(fileList)]: {
                    "id": itemId,
                    "src": imageSrc,
                }
            })
        }

        const result = await chrome.storage.local.get(["postInformation"])
        if (Object.keys(result).length === 0) {
            await chrome.storage.local.set({
                "postInformation": {
                    [pageNumber]: pageList,
                },
            })
        } else if(pageList.length !== 0) {
            const currentData = result.postInformation;
            const updateData = {
                ...currentData,
                [pageNumber]: pageList,
            }

            await chrome.storage.local.set({
                "postInformation": updateData,
            })
        }

        //次のページに行くボタンが有るかの判定
        console.log("次のページに行くボタンを探します")
        const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
        if (nextButton.length === 0) {
            //なければ処理を終了する
            console.log("処理を終了します")
            const postJson = await chrome.storage.local.get(["postInformation"])
            console.log("postJson : ", postJson.postInformation)
            fetch("http://localhost:8080/send/fileImages", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postJson.postInformation),
            }).catch((error) => {
                console.error("エラーが発生しました", error)    
            })
            chrome.storage.local.remove(["postInformation"])
        }
        else {
            //あればボタンをクリックし次のページに進む
            console.log("次のページに進みます")
            nextButton[0].click() //TODO: デバッグ用
        }
    }
    //自然に見えるように&アクセスが集中にしないように調整
    setTimeout(mainProcessing, 1500) //TODO: デバッグ用
}

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
    console.log("タイマーを開始しました")
    timerId = setTimeout(() => {
        if (onUpdatedListener) {
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            console.log("すべての処理を停止しました")
            onUpdatedListener = null
        }
    }, 3000)
}


const handler: PlasmoMessaging.MessageHandler = (req) => {
    processPage()
    mainProcess()
}

export default handler