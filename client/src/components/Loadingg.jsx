import loading from '../assets/loading.svg'
import styles from './css/loading.module.css'

export default function Loading() {
    return (
        <div className={styles.loader_container}>
            <img className={loading.loader} src={loading} alt='Loading' />
        </div>
    )
}
