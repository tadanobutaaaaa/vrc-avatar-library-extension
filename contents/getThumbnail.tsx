import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec * 1000))

const getThumbnail = async () => {
    while (true) {
        const imageList: string[] = []
            const elements: HTMLCollection = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
            for(let i = 0; i < elements.length; i++) {
            //console.log(elements[i].getElementsByClassName("l-library-item-thumbnail"))
            const imageDiv: string = elements[i].querySelector("img:first-child").getAttribute('src')
            console.log(imageDiv)
            imageList.push(imageDiv)
        }
        const nextButton = document.getElementsByClassName("icon-arrow-open-right no-margin s-1x") as HTMLCollectionOf<HTMLButtonElement>
        if (nextButton.length === 0) {
            break
        }
    nextButton[0].click()
    await sleep(2)
    console.log(imageList, "これがリストの中身")
    }
}
const CustomButton = () => {
    /*
    try {
    const postImages = fetch("http://localhost:8000/booth/thumbnail",
        {
        mode: "cors",
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
        }
    )
    //const postImagesJson: JSON = postImages.json()
    } catch (err) {
    console.error(err)
    return
    }
    */
    return <button onClick={getThumbnail}>Custom button</button>
}

export default CustomButton