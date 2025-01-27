import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/sessions";


export const action: ActionFunction = async ({request}) => {
    const formData = await request.clone().formData();

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));
    const errors = {} as Record<string, string>;

    const exists = await prisma.user.findUnique({
        where: {
            email: email
        },
    })

    if(exists?.email){
        errors.email = "Email already taken"
    }

    if (!email.includes("@")) {
        errors.email = "Invalid email address";
      }
    
    if (password.length < 8 || confirmPassword.length < 8) {
        errors.password = "Password should be at least 8 characters";
    }

    if(password !== confirmPassword){
        errors.password = "Passwords should match";
    }

    if (Object.keys(errors).length > 0) {
        return json({ errors });
    }

    const user = await authenticator.authenticate("create-user", request);
    const session = await getSession(request.headers.get("cookie"));

    
    session.set("user", user.toString());

    
    if (user){
        throw redirect("/", {
            headers: { "Set-Cookie": await commitSession() },
        });session
    }


    return {
        errors,
        success: true
    };
};

export default function Create() {
    const actionData = useActionData<typeof action>();
    const errors = actionData?.errors;

	return (
        <Form key="create" id="create-form" method="post">
            <div className="flex flex-col items-center h-screen justify-center border" id="create">
                <div className="border-2 w-[50%] min-h-[400px] flex flex-col justify-center items-center rounded border-black">
                    <h2>Create Account</h2>
                        <div className="w-[50%]">
                            <label htmlFor="firstName" className="">First Name</label>
                            <div className="border">
                                <div className="w-[100%]">
                                    <input type="text" name="firstName" id="firstName" className="pl-1 w-[100%] border border-black" placeholder="John"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <label htmlFor="lastName" className="">Last Name</label>
                            <div className="border">
                                <div className="w-[100%]">
                                    <input type="text" name="lastName" id="lastName" className="pl-1 w-[100%] border border-black" placeholder="Smith"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <label htmlFor="email" className="">Email</label>
                            <div className="border">
                                <div className="w-[100%]">
                                    <input type="text" name="email" id="email" className="pl-1 w-[100%] border border-black" placeholder="example@example.com"/>
                                    {errors?.email && <div className="text-red-600">{errors?.email}</div> }
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <label htmlFor="password" className="">Password</label>
                            <div className="border">
                                <div className="">
                                    <input type="password" name="password" id="password" className="pl-1 w-[100%] border border-black" placeholder="******"/>
                                    {errors?.password && <div className="text-red-600">{errors?.password}</div> }
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <label htmlFor="confirmPassword" className="">Confirm Password</label>
                            <div className="border">
                                <div className="">
                                    <input type="password" name="confirmPassword" id="confirmPassword" className="pl-1 w-[100%] border border-black" placeholder="******"/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 mt-2 w-full justify-center">
                            <button type="submit" className="border-2 p-1 min-w-min rounded  border-black">Create</button>
                        </div>
                </div>
            </div>
        </Form>
	);
}