const findAndReplaceReducerFromComponents = (components, replaceReducer) => {
  const innermostComponentWithReducer = [...components]
    .reverse()
    .find(component => component && component.reducer)

  if (innermostComponentWithReducer) {
    // console.log(innermostComponentWithReducer.displayName + ' has a reducer. replacing.')
    replaceReducer(innermostComponentWithReducer.reducer)
  }
}

module.exports = findAndReplaceReducerFromComponents
