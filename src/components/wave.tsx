import style from './wave.module.css'

export default function Wave() {
    return <div className={style.main}>
        <div className={style.box}>
            <div className={style.boxInner}></div>
        </div>
    </div>
}