const graphql = require("graphql");
const argon2 = require("argon2");
const _ = require("lodash");

const Plant = require("../models/plant");
const User = require("../models/user");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
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
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    plants: {
      type: new GraphQLList(PlantType),
      resolve(parent, args) {
        return Plant.find({});
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        // wait for argon2 to be ready
        return argon2.hash(args.password).then((hashedPassword) => {
          const user = new User({
            name: args.name,
            userName: args.userName,
            email: args.email,
            password: hashedPassword,
          });

          return user.save();
        });
      },
    },

    addPlant: {
      type: PlantType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        scientificName: { type: new GraphQLNonNull(GraphQLString) },
        family: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // check if user exists
        return User.findById(args.userId).then((user) => {
          if (!user) {
            throw new Error("User not found");
          } else {
            let plant = new Plant({
              name: args.name,
              scientificName: args.scientificName,
              family: args.family,
              description: args.description,
            });

            return plant.save();
          }
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
