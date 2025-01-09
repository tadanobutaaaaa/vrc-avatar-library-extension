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
        chrome.storage.local.set({"isUnchecked": false})
        window.location.reload()
    }
    return (
    <button
        style={{
            backgroundColor: "#ea5550",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            marginLeft: "8px",
            marginBottom: "15px",
        }}
        onClick={buttonProcess}
    >全てにチェックを付ける</button>
    )
}

const NotCheckedButton = () => {
    const buttonProcess = () => {
        chrome.storage.local.clear()
        chrome.storage.local.set({"isUnchecked": true})
        window.location.reload()
    }
    return (
    <button
        style={{
            backgroundColor: "#5383c3",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            marginLeft: "8px",
            marginBottom: "15px",
        }}
        onClick={buttonProcess}
    >全てのチェックを外す</button>
    )
}

const CheckboxWithLabel = ({ defaultStatus, itemId }: CheckboxProps) => {
    const handleChange = (checked: boolean, productId: string) => {
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
    const resetButton = document.createElement("div")
    elements[0].before(resetButton)

    const root = createRoot(resetButton)
    root.render(
        <>
            <ResetCheckboxButton />
            <NotCheckedButton />
        </>
    )
    chrome.storage.local.get(["isUnchecked"], (result) => {
        const isUnchecked = result["isUnchecked"]
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i].getElementsByClassName("flex gap-8 desktop:gap-16 border-b border-border300 pb-16")

            const itemName = elements[i].getElementsByClassName("text-text-default font-bold typography-16 !preserve-half-leading mb-8 break-all")
            const itemNameText = itemName[0].textContent

            chrome.storage.local.get([itemNameText], (itemResult) => {
                let isChecked: boolean
                if(Object.keys(itemResult).length !== 0) {
                    isChecked = itemResult[itemNameText]
                } else {
                    isChecked = !isUnchecked
                    chrome.storage.local.set({[itemNameText]: isChecked})
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
})

export default EmptyElement

