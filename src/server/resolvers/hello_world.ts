import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  HelloWorld() {
    return "Hello World!";
  }
}
