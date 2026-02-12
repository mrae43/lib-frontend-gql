import { useState } from 'react';
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';

const App = () => {
	const [page, setPage] = useState('authors');

	return (
		<div>
			<div>
				<Link to={'/'}>
					<button onClick={() => setPage('authors')}>authors</button>
				</Link>
				<Link to={'/books'}>
					<button onClick={() => setPage('books')}>books</button>
				</Link>
				<Link to={'/add_book'}>
					<button onClick={() => setPage('add')}>add book</button>
				</Link>
				<Link to={'/login'}>
					<button onClick={() => setPage('login')}>login</button>
				</Link>
			</div>
			<Routes>
				<Route path='/' element={<Authors show={page === 'authors'} />} />
				<Route path='/books' element={<Books show={page === 'books'} />} />
				<Route path='/add_book' element={<NewBook show={page === 'add'} />} />
				<Route path='/login' element={<LoginForm show={page === 'login'} />} />
			</Routes>
		</div>
	);
};

export default App;
