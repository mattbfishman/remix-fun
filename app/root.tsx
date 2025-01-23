import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Outlet,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";
import { getSession } from "./services/sessions";
import UserContext, { User } from "./context/userContext";
import { useState } from "react";


export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("user");

  return {user}
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];


export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider value={{user, loggedIn: false, setUser}}>
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
