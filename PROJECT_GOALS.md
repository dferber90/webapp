# CRS-Webpack
The goal of this project is to provide a base for building modern, huge web apps.

## Goals

[ ] Superfast initial and later render
  [ ] Server-Side Rendering
  [ ] Gradual loading (additional CSS & JS is loaded on transition to new routes)
  [ ] Multiple Entry Points
  [ ] On first load, server provides everything client needs (only 1 Round Trip)
[ ] Realtime
  [ ] RPC
  [ ] Publish/Subscribe: Live updates for subscribed data
  [ ] Optimistic UI (UI updates before server answers requests)
[ ] Modular architecture
  [ ] Components define their data needs
  [ ] Few mocks required for testing
[ ] Good developer experience
  [ ] Universal Code (shared components, routes, methods)
  [ ] "UI is just a function" (UI can be rerendered anytime from one global store)
