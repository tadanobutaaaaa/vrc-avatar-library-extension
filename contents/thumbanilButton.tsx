import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging";

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}

const getThumbnail = async() => {
    try{
        sendToBackground({
            name: "getThumbnail",
            body: {
                status: true
            }
        })
        await sendToBackground({
            name: "monitoringPages",
            body: {
                status: true
            }
        })
    } catch (error) {
        console.log("実行できませんでした:", error)
    }
}
const CustomButton = () => {
    return <button onClick={getThumbnail}>Custom button</button>
}

export default CustomButton;