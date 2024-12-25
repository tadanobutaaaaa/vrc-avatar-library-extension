import type { PlasmoCSConfig } from "plasmo";
import { createRoot } from 'react-dom/client';

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

//plasmoのエラー対策 特に意味はなし
const EmptyElement: React.FC = () => {
    return <></>
}

type CheckboxProps = {
    defaultStatus: boolean
    itemId: string
}

const CheckboxWithLabel = ({ defaultStatus, itemId }: CheckboxProps) => {
    const handleChange = (checked: boolean, productId: string) => {
        console.log(checked)
        chrome.storage.local.set({[productId]: checked})
    }
    return (
        <input 
        type="checkbox"
        style={{
            width: "17px",
            height: "17px",
        }}
        defaultChecked={defaultStatus}
        onChange={(e) => {handleChange(e.target.checked,itemId)}}
        ></input>
    )
}

window.addEventListener("load", () => {
    const elements = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
    for(let i = 0; i < elements.length; i++) {
        const element = elements[i].getElementsByClassName("flex gap-8 desktop:gap-16 border-b border-border300 pb-16")

        const imagehref = elements[i].querySelector("a:first-child").getAttribute("href")
        const itemId = imagehref.replace("https://booth.pm/ja/items/","")

        chrome.storage.local.get([itemId], (result) => {
            let isChecked: boolean
            if(Object.keys(result).length !== 0) {
                isChecked = result[itemId]
            } else {
                isChecked = true
                chrome.storage.local.set({[itemId]: true})
            }
            const checkboxContainer = document.createElement("div")
            element[0].before(checkboxContainer)
            
            const root = createRoot(checkboxContainer)
            root.render(
                <CheckboxWithLabel defaultStatus={isChecked} itemId={itemId}/>
            ) 
        })
    }
})

export default EmptyElement

