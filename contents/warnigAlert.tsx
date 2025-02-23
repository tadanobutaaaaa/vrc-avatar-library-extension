import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from 'react-dom/client'

export const config: PlasmoCSConfig = {
    matches: ["https://accounts.booth.pm/library*"]
}


//plasmoのエラー対策 特に意味はなし
const EmptyElement: React.FC = () => {
    return <></>
}

const WarningAlert = () => {
    return (
        <>
            <h1
                style={{
                    color: "white", // 文字色を白にして背景とのコントラストを強く
                    fontSize: "24px",
                    textAlign: "center",
                    backgroundColor: "#b92e34", // 赤背景にして警告の印象を強く
                    padding: "20px", // 内側の余白を設定
                    borderRadius: "8px", // 角を丸くして柔らかい印象に
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 影をつけて立体感を出す
                    width: "50%", // 横幅を調整して画面に収める
                    margin: "0 auto", // 水平中央揃え
                    lineHeight: "1.6", // 行間を広げて読みやすく
                    marginTop: "40px",
                }}
            >
                処理をしています<br />
                一切の操作をしないでください(予期しない動きをする可能性があります)
            </h1>
        </>
    )
}

window.addEventListener("load", () => {
    chrome.storage.local.get(["start"], (result) => {
        if (result.start) {
            const target = document.querySelector("main")
            if (!target) return

            const container = document.createElement("div")
            target.before(container)

            const root = createRoot(container)
            root.render(<WarningAlert />)
        }
    })
})

export default EmptyElement