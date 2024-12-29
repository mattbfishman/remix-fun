import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export type User = {
  name: string;
  token: string;
};

export const authenticator = new Authenticator<User>();
export const loginAuth = new Authenticator<boolean>();

authenticator.use(
  new FormStrategy(async ({form}) => {
    const email = form.get("email");
    const password = form.get("password");
    const firstName = form.get("firstName");
    const lastName = form.get("lastName");
    const passwordHash = await bcrypt.hash((password as string), 10);

    
    const user = await prisma.User.create({
      data: {
        email, password: passwordHash, first_name: firstName, last_name: lastName
      }
    });
    return user;
  }),
  "create-user"
);

loginAuth.use(
  new FormStrategy(async ({form}) => {
    const email = form.get("email");
    const password = form.get("password");
    const passwordHash = await bcrypt.hash((password as string), 10);

    console.log(passwordHash);

    
    const user = await prisma.User.findUnique({
      where: {
        email: email
      }
    });


    console.log(user);
    if(user) {
      return true;
    }
    return false;
  }),
  "login"
);
