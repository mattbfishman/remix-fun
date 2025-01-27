import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import {User} from "~/context/userContext";

export const authenticator = new Authenticator<User>();
export const loginAuth = new Authenticator<User | boolean>();

authenticator.use(
  new FormStrategy(async ({form}) => {
    const email = form.get("email") as string;
    const password = form.get("password");
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const passwordHash = await bcrypt.hash((password as string), 10);

    await prisma.user.create({
      data: {
        email, password: passwordHash, first_name: firstName, last_name: lastName
      }
    });
  
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
    
    if(res){
      return {
        email: user?.email,
        firstName: user?.first_name,
        lastName: user?.last_name
      };
    }
    return false;
  }),
  "login"
);
