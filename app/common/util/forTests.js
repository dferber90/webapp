export default function () {
  if (__SERVER__) return 'server'
  if (__CLIENT__) return 'client'
  return 'none of the above'
}
