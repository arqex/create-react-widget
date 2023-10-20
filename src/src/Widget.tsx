import reactLogo from '/assets/react.svg'
import viteLogo from '/assets/vite.svg'
import styles from './Widget.module.css'

function Widget() {
  console.log('Hola');
  return (
    <div className={styles.widget}>
      <div className={styles.logos}>
        <a href="https://vitejs.dev" target="_blank">
          <img data-testid="vite" src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img data-testid="react" src={reactLogo} className={styles.logo + ' ' + styles.react} alt="React logo" />
        </a>
      </div>
      <h1 data-testid="title" className={styles.title}>create-react-widget</h1>
      <div className={styles.card}>
        <p>
          Edit <code>src/Widget.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default Widget
