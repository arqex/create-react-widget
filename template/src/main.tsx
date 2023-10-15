import React from 'react'
import ReactDOM from 'react-dom/client'
import Widget from './Widget'

// The root node is received from the injector
export function render(root: HTMLElement) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Widget />
    </React.StrictMode>
  )
}

