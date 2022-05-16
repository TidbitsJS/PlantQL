const graphql = require("graphql");
const _ = require("lodash");

const Plant = require("../models/plant");
const User = require("../models/user");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = graphql;

const PlantType = new GraphQLObjectType({
  name: "Plant",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    scientificName: { type: GraphQLString },
    family: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    plants: {
      type: new GraphQLList(PlantType),
      resolve(parent, args) {
        return Plant.find({ userId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    plant: {
      type: PlantType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Plant.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
