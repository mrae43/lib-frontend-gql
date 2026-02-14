import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_BOOK } from '../queries';
import { addBookToCache } from '../utils/apolloCache';

const NewBook = ({ setError, notify }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [published, setPublished] = useState(0);
	const [genre, setGenre] = useState('');
	const [genres, setGenres] = useState([]);

	const [addBook] = useMutation(ADD_BOOK, {
		update: (cache, response) => {
			const addedBook = response.data.addBook;
			addBookToCache(cache, addedBook, 'all');
			notify(`New book "${addedBook.title}" is added to the library`);
		},
	});

	const submit = async (event) => {
		event.preventDefault();

		try {
			await addBook({ variables: { title, author, published, genres } });
			console.log('add book...');
			setTitle('');
			setPublished('');
			setAuthor('');
			setGenres([]);
			setGenre('');
		} catch (error) {
			setError(error.message);
		}
	};

	const addGenre = () => {
		setGenres(genres.concat(genre));
		setGenre('');
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type='number'
						value={published}
						onChange={({ target }) => setPublished(Number(target.value) || 0)}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type='button'>
						add genre
					</button>
				</div>
				<div>genres: {genres.join(' ')}</div>
				<button type='submit'>create book</button>
			</form>
		</div>
	);
};

export default NewBook;
