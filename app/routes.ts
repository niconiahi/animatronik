import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  layout("routes/dapp.tsx", [
    route("showcase", "routes/dapp.showcase.tsx"),
    route("add", "routes/dapp.add.tsx"),
  ]),
] satisfies RouteConfig
