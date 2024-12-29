import { ActionFunction, redirect } from "@remix-run/node";
// import { prisma } from "../db.server"
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { loginAuth } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/sessions";

// export async function loader() {
// 	// const data = await prisma.User.findMany()
// 	return json({data})
// }

export const action: ActionFunction = async ({request}) => {
    const user = await loginAuth.authenticate("login", request);
    const session = await getSession(request.headers.get("cookie"));
    
    session.set("user", user.toString());

    
    if (user){
        throw redirect("/", {
            headers: { "Set-Cookie": await commitSession(session) },
        });
    }


    return {
        success: true
    };
};

export default function Login() {
	const data = useLoaderData();

	console.log(data);

	return (
		<Form key="login" id="login-form" method="post">

			<div className="flex flex-col items-center h-screen justify-center border" id="login">
				<div className="border-2 w-[50%] min-h-[300px] flex flex-col justify-center items-center rounded border-black">
					<h2>Login</h2>
					<div className="w-[50%]">
						<label htmlFor="email" className="">Email</label>
						<div className="border">
							<div className="w-[100%]">
								<input type="text" name="email" id="email" className="pl-1 w-[100%] border border-black" placeholder="example@example.com"/>
							</div>
						</div>
					</div>
					<div className="w-[50%]">
						<label htmlFor="password" className="">Password</label>
						<div className="border">
							<div className="">
								<input type="password" name="password" id="password" className="pl-1 w-[100%] border border-black" placeholder="******"/>
							</div>
						</div>
					</div>
					<div className="flex flex-row gap-2 mt-2 w-full justify-center">
						<button type="submit" className="border-2 p-1 min-w-min rounded border-black">Login</button>
						<NavLink to="/create">
							<button className="border-2 p-1 min-w-min rounded  border-black">Create Account</button>
						</NavLink>
					</div>
				</div>
			</div>
		</Form>
	);
}