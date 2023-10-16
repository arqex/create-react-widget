function getStyleId(id: string){
  return id.replace(/[/\\]/g, '_');
}

class StylesUpdater {
  styleNodes: HTMLElement[] = [];
  cachedStyles = new Map();
  
  setStylesNode(node: HTMLElement){
    // multiple nodes are supported in case we want to try more than one widget
    // in the same page
    this.styleNodes.push(node);
    for( const [id, styles] of this.cachedStyles.entries() ){
      this.updateNode(node, id, styles);
    }
  }
  
  updateStyles(vid: string, syleNode: HTMLElement){
    const id = getStyleId(vid);
    const styles = syleNode.innerHTML;
    this.cachedStyles.set(id, styles);
    this.styleNodes.forEach( node => this.updateNode(node, id, styles) );
  }

  updateNode(node: HTMLElement, id: string, styles: string){
    let sheet = node.querySelector('#'+id);
    if( !sheet ){
      sheet = document.createElement('style');
      sheet.id = id;
      node.appendChild(sheet);
    }
    sheet.innerHTML = styles;
  }

  removeStyles(vid: string){
    const id = getStyleId(vid);
    this.cachedStyles.delete(id);
    this.styleNodes.forEach( node => node.querySelector('#'+id)?.remove());
  }
}

function createStyleUpdater() {
  const updater = new StylesUpdater();
  const config = { attributes: true, childList: true, subtree: true };
  const clbk: MutationCallback = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for( const node of mutation.addedNodes ) {
          const element = node as HTMLElement;
          const id = element.dataset?.viteDevId;
          if( id ){
            updater.updateStyles(id, element);
            element.innerHTML = '';
          }
          if( node.nodeType === 3 ) {
            const target = mutation.target as HTMLElement;
            if( target?.dataset?.viteDevId ){
              updater.updateStyles(target.dataset.viteDevId, target);
              target.innerHTML = '';
            }
          }
        }
        for( const node of mutation.removedNodes ) {
          const element = node as HTMLElement;
          const id = element.dataset?.viteDevId;
          if( id ){
            updater.removeStyles(id);
          }
        }
      }
    }
  }
  
  const observer = new MutationObserver(clbk);
  observer.observe(document.head, config);

  return updater;
}

// Create the updater now, so we can start listening before
// the widget start importing styles
const updater = createStyleUpdater();

export function setStylesNode(styleTag: HTMLElement | null) {
  if( !styleTag ) {
    return console.error('ReactWidget: styles placeholder not found');
  }

  updater.setStylesNode(styleTag);
}