import type { PlasmoCSConfig } from "plasmo";
import { createRoot } from 'react-dom/client';

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

//plasmoのエラー対策 特に意味はなし
const EmptyElement: React.FC = () => {
    return <></>
}


const CheckboxWithLabel = () => {
    return (
        <></>
    )
}

window.addEventListener("load", () => {
    const elements = document.getElementsByClassName("mb-16 bg-white p-16 desktop:rounded-8 desktop:py-24 desktop:px-40")
    for(let i = 0; i < elements.length; i++) {
        const element = elements[i].getElementsByClassName("flex gap-8 desktop:gap-16 border-b border-border300 pb-16")

        const shadowHost = document.createElement("div")
        document.body.appendChild(shadowHost)

        const shadowRoot = shadowHost.attachShadow({mode: "open"})

        //const checkboxContainer = document.createElement("div")
        //checkboxContainer.style.cssText = `
        //    position: absolute;
        //    left: 10px;`
        
        //const targetElement = element[0] as HTMLElement
        //targetElement.style.position = "relative"
        //targetElement.appendChild(checkboxContainer)
        
        const root = createRoot(shadowRoot)
        // Providerがレイアウトを崩す
        root.render(
            <></>
        )
    }
})

export default EmptyElement

