import { json } from "@remix-run/node";
import { prisma } from "../db.server"
import { NavLink, useLoaderData } from "@remix-run/react";

export async function loader() {
	const data = await prisma.User.findMany()
	return json({data})
  }

export default function Login() {
	const data = useLoaderData();

	console.log(data);

	return (
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
					<button className="border-2 p-1 min-w-min rounded border-black">Login</button>
					<NavLink to="/create">
						<button className="border-2 p-1 min-w-min rounded  border-black">Create Account</button>
					</NavLink>
				</div>
			</div>
		</div>
	);
}