import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router } from 'react-router-dom';

const client = new ApolloClient({
	link: new HttpLink({
		uri: 'http://localhost:4000',
	}),
	cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Router>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</Router>
	</StrictMode>,
);
