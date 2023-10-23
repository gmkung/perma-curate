import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/kleros/legacy-curate-xdai',
  }),
  cache: new InMemoryCache(),
});

export default client;
