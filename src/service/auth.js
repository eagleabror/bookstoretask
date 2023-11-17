import axios from './api'

const AuthService = {
	async userRegister(user) {
		const {data} = await axios.post('/signup', user)
		return data
	},
	async userLogin(user) {
		const {data} = await axios.get('/myself', {
			headers:{
				Key: user.key,
				Sign: user.sign
			}
		})
		return data
	},
	async bookGet(keys) {
		const {data} = await axios.get('/books', {
			headers:{
				Key: keys.key,
				Sign: keys.sign
			}
		})
		return data
	},
	async bookCreate(bookData, keys) {
		const {data} = await axios.post('/books', keys, {
			headers:{
				Key: bookData.key,
				Sign: bookData.sign
			}
		})
		return data
	},
	async bookDelete(keys, id) {
		const {data} = await axios.delete(`/books/${id}`, {
			headers:{
				Key: keys.key,
				Sign: keys.sign
			}
		})
		return data
	},
	async bookEdit(keys, id, edit) {
		const {data} = await axios.patch(`/books/${id}`, edit, {
			headers:{
				Key: keys.key,
				Sign: keys.sign
			}
		})
		return data
	},
}

export default AuthService