import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import {
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
} from "type-graphql";

@ObjectType("Foo")
class GraphQLFoo {
  @Field((type) => Boolean)
  bar: boolean;
}

@Resolver((of) => GraphQLFoo)
class FooResolver {
  @Query((returns) => GraphQLFoo)
  foo(): GraphQLFoo {
    return new GraphQLFoo();
  }

  @FieldResolver((returns) => Boolean, { nullable: true })
  bar(): boolean | null {
    return null;
  }
}

(async () => {
  const schema = await buildSchema({
    resolvers: [FooResolver],
    emitSchemaFile: "./schema.graphqls",
  });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4242 },
  });
  console.log(`Server ready at ${url}`);
})();
