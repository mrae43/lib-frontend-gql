import { useQuery, useMutation } from '@apollo/client/react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react';

const Authors = (props) => {
	const [author, setAuthor] = useState('');
	const [bornTo, setBornTo] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);
	const result = useQuery(ALL_AUTHORS);
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	const submit = async (event) => {
		event.preventDefault();
		console.log('Edit Author birth year...');

		setErrorMessage(null);

		const born = Number(bornTo);
		if (!author.trim() || isNaN(born)) {
			setErrorMessage('Author name and birth year are required');
			return;
		}

		try {
			await editAuthor({ variables: { name: author, setBornTo: born } });
			setAuthor('');
			setBornTo('');
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	if (!props.show) {
		return null;
	}
	if (result.loading) return <div>loading...</div>;
	if (result.error) return <div>error: {result.error.message}</div>;
	const authors = result.data.allAuthors;

	return (
		<div>
			{errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.id}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<h2>Set birthyear</h2>
				<form onSubmit={submit}>
					<div>
						name
						<input
							value={author}
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						born
						<input
							value={bornTo}
							onChange={({ target }) => setBornTo(target.value)}
						/>
					</div>
					<button type='submit'>update author</button>
				</form>
			</div>
		</div>
	);
};

export default Authors;
