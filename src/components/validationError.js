import {useCallback} from 'react'
import {useSelector} from 'react-redux'

const ValidationError = () => {
	const {error} = useSelector(state => state.auth)

	return (
		error !== null && <h1>{error}</h1>
	)
}

export default ValidationError