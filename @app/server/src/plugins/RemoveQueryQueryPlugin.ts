import { Plugin } from "postgraphile";

const RemoveQueryQueryPlugin: Plugin = (builder) => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    if (context.scope.isRootQuery) {
      // eslint-disable-next-line no-unused-vars
      const { query: _query, ...rest } = fields;
      // Drop the `query` field
      return rest;
    } else {
      return fields;
    }
  });
};

export default RemoveQueryQueryPlugin;
