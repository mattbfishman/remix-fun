import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import {User} from "~/context/userContext";

export const authenticator = new Authenticator<User>();
export const loginAuth = new Authenticator<boolean>();

authenticator.use(
  new FormStrategy(async ({form}) => {
    const email = form.get("email") as string;
    const password = form.get("password");
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const passwordHash = await bcrypt.hash((password as string), 10);

    const user = await prisma.user.create({
      data: {
        email, password: passwordHash, first_name: firstName, last_name: lastName
      }
    });


    console.log(user);
    console.log('the user is');

  
    return {
      firstName: firstName,
      lastName: lastName,
      email: email
    };
  }),
  "create-user"
);

loginAuth.use(
  new FormStrategy(async ({form}) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });

    if(!user){
      return false;
    }

    const inputPassword = user?.password ? user?.password : '';
    const res = await bcrypt.compare(password, inputPassword);
  
    return res;
  }),
  "login"
);
