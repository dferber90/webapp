function loadStylesFromComponents(components) {
  const stylesOfComponents = components
    .filter(component => component && !!component.styles)
    .map(component => component.styles)

  // use a map to remove duplicate module ids
  const stylesMap = new Map()
  stylesOfComponents.forEach(componentStyles => {
    componentStyles.forEach(componentStyle => {
      componentStyle.forEach(([moduleId, styleContent]) => stylesMap.set(moduleId, styleContent))
    })
  })
  return Array.from(stylesMap.values()).reduce((prev, cur) => prev + '\n\n' + cur, '')
}

module.exports = loadStylesFromComponents
