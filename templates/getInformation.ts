export function getInformation() {
    const imageList: string[] = []

    const elements: HTMLCollection = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
    for(let i = 0; i < elements.length; i++) {
        //console.log(elements[i].getElementsByClassName("l-library-item-thumbnail"))
        const imageDiv: string = elements[i].querySelector("img:first-child").getAttribute('src')
        console.log(imageDiv)
        imageList.push(imageDiv)
    }
    const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
    console.log("確認用")
    if (nextButton.length === 0) {
        console.log("次のページは存在しません")
    } 
    else {
        console.log(imageList,"リストの中身")
        nextButton[0].click()
    }
}