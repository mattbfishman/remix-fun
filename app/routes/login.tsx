import { ActionFunction, redirect } from "@remix-run/node";
// import { prisma } from "../db.server"
import { Form, NavLink, useActionData } from "@remix-run/react";
import { loginAuth } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/sessions";

export const action: ActionFunction = async ({request}) => {
	let user, session;
    try {
		user = await loginAuth.authenticate("login", request);
		session = await getSession(request.headers.get("cookie"));
	} catch (e) {
		return {
			errors: { login: 'Email or Password is incorrect'},
			success: false
		};

	}
    
    if (user){
		session.set("user", JSON.stringify(user));
        throw redirect("/", {
            headers: { "Set-Cookie": await commitSession(session) },
        });
    }

    return {
		errors:  { login: 'Email or Password is incorrect'},
        success: false
    };
};

export default function Login() {
	const actionData = useActionData<typeof action>();
	const errors = actionData?.errors;

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
					{errors?.login && <div className="text-red-600">{errors?.login}</div> }
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