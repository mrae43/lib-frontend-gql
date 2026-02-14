import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useApolloClient, useSubscription } from '@apollo/client/react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendation from './components/Recommendation';
import { BOOK_ADDED } from './queries';
import { addBookToCache } from './utils/apolloCache';

const App = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem('library-user-token'),
	);

	const client = useApolloClient();

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			if (!data || !data.data || !data.data.bookAdded) {
				console.warn('Unexpected data shape');
				return;
			}
			const addedBook = data.data?.bookAdded;
			window.alert(`New book "${addedBook.title}" is added to the library`);
			addBookToCache(client.cache, addedBook);
		},
	});

	const onLogout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	const notify = (message) => {
		setErrorMessage(message);
		setTimeout(() => {
			setErrorMessage(null);
		}, 10000);
	};

	return (
		<div>
			<nav>
				<Link to={'/'}>
					<button type='button'>authors</button>
				</Link>
				<Link to={'/books'}>
					<button type='button'>books</button>
				</Link>
				{token && (
					<>
						<Link to={'/add_book'}>
							<button type='button'>add book</button>
						</Link>
						<Link to={'/recommend'}>
							<button type='button'>recommend</button>
						</Link>
						<button onClick={onLogout}>logout</button>
					</>
				)}
				{!token && (
					<Link to={'/login'}>
						<button type='button'>login</button>
					</Link>
				)}
				{errorMessage && (
					<div style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</div>
				)}
			</nav>

			<Routes>
				<Route path='/' element={<Authors />} />
				<Route path='/books' element={<Books />} />
				{/* Protected Routes */}
				<Route
					path='/add_book'
					element={
						token ? <NewBook setError={notify} /> : <Navigate to={'/login'} />
					}
				/>
				<Route
					path='/recommend'
					element={token ? <Recommendation /> : <Navigate to={'/login'} />}
				/>
				<Route
					path='/login'
					element={<LoginForm setError={notify} setToken={setToken} />}
				/>
			</Routes>
		</div>
	);
};

export default App;
