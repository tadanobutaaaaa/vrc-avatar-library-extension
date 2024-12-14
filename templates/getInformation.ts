export function getInformation() {
    function mainProcessing() {
        //すべての商品を取得する
        const elements = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
        for(let i = 0; i < elements.length; i++) {
            //画像のリンクを取得する
            const imageSrc = elements[i].querySelector("img:first-child").getAttribute('src')

            //商品のURLを取得する -> 商品のIDのみを取得する
            const imagehref = elements[i].querySelector("a:first-child").getAttribute("href")
            const itemId = imagehref.replace("https://booth.pm/ja/items/","")
            
            console.log(imageSrc)
            console.log(itemId)

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
            console.log(fileList)
            //google storageを使用する機能を書く
            //chrome.storage.local.set()
        }

        const currentUrl = new URL(window.location.href)
        let pageNumber = currentUrl.searchParams.get('page')
        console.log(currentUrl.href)

        if (pageNumber == null) {
            pageNumber = '1'
        }
        console.log(pageNumber)

        //次のページに行くボタンが有るかの判定
        const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
        if (nextButton.length === 0) {
            //なければ処理を終了する
            console.log("次のページは存在しません")
        }
        else {
            //あればボタンをクリックし次のページに進む
            nextButton[0].click()
        }
    }
    //自然に見えるように&アクセスが集中にしないように調整
    setTimeout(mainProcessing, 1000)
}