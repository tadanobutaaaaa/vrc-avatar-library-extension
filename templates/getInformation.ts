export function getInformation() {
    async function mainProcessing() {
        //現在のurlを取得する
        const currentUrl = new URL(window.location.href)
        let pageNumber = currentUrl.searchParams.get('page')
        if (pageNumber == null) {
            pageNumber = '1'
        }

        //すべての商品を取得する
        const pageList = [];
        const elements = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
        for(let i = 0; i < elements.length; i++) {
            //画像のリンクを取得する
            const imageSrc = elements[i].querySelector("img:first-child").getAttribute('src')

            //商品のURLを取得する -> 商品のIDのみを取得する
            const imagehref = elements[i].querySelector("a:first-child").getAttribute("href")
            const itemId = imagehref.replace("https://booth.pm/ja/items/","")

            const itemName = elements[i].getElementsByClassName("text-text-default font-bold typography-16 !preserve-half-leading mb-8 break-all")
            const itemNameText = itemName[0].textContent

            chrome.storage.local.get([itemNameText], (result) => {
                const checkboxStorage = result[itemNameText]
                console.log(checkboxStorage)
                if (checkboxStorage) {
                    chrome.storage.local.set({[itemNameText]: false})
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
                            "src": imageSrc,
                            "id": itemId,
                        }
                    })
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
        const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
        if (nextButton.length === 0) {
            //なければ処理を終了する
            const postJson = await chrome.storage.local.get(["postInformation"])
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
            setTimeout(() => {window.location.reload()}, 1000)
        }
        else {
            //あればボタンをクリックし次のページに進む
            nextButton[0].click()
        }
    }
    //自然に見えるように&アクセスが集中にしないように調整
    setTimeout(mainProcessing, 1000)
}