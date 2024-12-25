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

const ResetCheckboxButton = () => {
    const buttonProcess = () => {
        chrome.storage.local.clear()
        const allData = chrome.storage.local.get(null);
        console.log(allData);
        window.location.reload()
    }
    return (
    <button
        style={{
            backgroundColor: "#ea5550",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "15px",
        }}
        onClick={buttonProcess}
    >全てにチェックを付ける</button>
    )
}

const CheckboxWithLabel = ({ defaultStatus, itemId }: CheckboxProps) => {
    const handleChange = (checked: boolean, productId: string) => {
        console.log(checked)
        chrome.storage.local.set({[productId]: checked})
        console.log(chrome.storage.local.get([productId]))
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
    const resetButton = document.createElement("div")
    elements[0].before(resetButton)

    const root = createRoot(resetButton)
    root.render(
        <ResetCheckboxButton />
    )

    for(let i = 0; i < elements.length; i++) {
        const element = elements[i].getElementsByClassName("flex gap-8 desktop:gap-16 border-b border-border300 pb-16")

        const itemName = elements[i].getElementsByClassName("text-text-default font-bold typography-16 !preserve-half-leading mb-8 break-all")
        const itemNameText = itemName[0].textContent

        chrome.storage.local.get([itemNameText], (result) => {
            let isChecked: boolean
            if(Object.keys(result).length !== 0) {
                isChecked = result[itemNameText]
            } else {
                isChecked = true
                chrome.storage.local.set({[itemNameText]: true})
            }
            const checkboxContainer = document.createElement("div")
            element[0].before(checkboxContainer)
            
            const root = createRoot(checkboxContainer)
            root.render(
                <CheckboxWithLabel defaultStatus={isChecked} itemId={itemNameText}/>
            ) 
        })
    }
})

export default EmptyElement

