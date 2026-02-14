import { ALL_BOOKS } from '../queries';

export const addBookToCache = (cache, bookToAdd, currentGenre) => {
	const variables =
		currentGenre === 'all' ? { genre: null } : { genre: currentGenre };
	cache.updateQuery({ query: ALL_BOOKS, variables }, ({ allBooks }) => {
		const bookExists = allBooks.some((book) => book.id === bookToAdd.id);

		if (bookExists) {
			return { allBooks };
		}

		return {
			allBooks: allBooks.concat(bookToAdd),
		};
	});
};
