import React from 'react'
import {
	View,
	Text,
	StatusBar,
	TextInput,
	Image,
	TouchableOpacity,
	Modal,
	Alert,
	AlertIOS,
	Platform,
} from "react-native";
import { MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';
import CustomButton from '../../components/Button'
const api = require('../../api/index');

export default class SetPassword extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		newPassword: '',
		cnfPassword: '',
		hidePassword: true,
		email: '',
		isDirty: false,
		emailError: ''
	};


	onChange = (name, value) => {
		if (this.state.cnfPassword == '' && this.state.newPassword == '') {
			this.setState({ passError: 'All fields are required!' })
		} else if (name === 'newPassword' && (value.length < 7 || value === '')) {
			this.setState({ passError: 'Password shouldn' + "'" + 't be less than 7 characters' })
		} else if (name === 'cnfPassword' && (this.state.newPassword != value)) {
			this.setState({ passError: 'Password Should be Same' })
		}

		else {
			this.setState({ emailError: '', passError: '' })
		}
		this.setState({ [name]: value, isDirty: true })

	}

	componentDidMount() {
		const email = this.props.navigation.getParam('userEmail')
		this.setState({ email })

	}


	fetchAPI = async () => {
		if (this.state.newPassword !== this.state.cnfPassword) {
			Alert.alert('Failed', "Password mismatched!");
		} else {
			await api.resetPassword({
				email: this.state.email,
				password: this.state.cnfPassword
			},
				(e, r) => {
					if (e) {
						Alert.alert(
							'Error', e,
							[
								{
									text: 'OK', onPress: () => this.setState({ loading: false })
								}
							]
						);
					} else {
						if (r.response_code == 2000) {
							Alert.alert(
								'Success', JSON.stringify(r.response_message),
								[
									{
										text: 'OK', onPress: () => this.setState({ loading: false })
									}
								]
							);
							this.props.navigation.navigate('Login');
						} else {
							Alert.alert(
								'Request failed', JSON.stringify(r.response_message),
								[
									{
										text: 'OK', onPress: () => this.setState({ loading: false })
									}
								]
							);
						}
					}
				})
		}
	}

	render() {
		const { emailError, isDirty } = this.state
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', marginHorizontal: 50, alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ alignItems: 'center', marginBottom: 40 }}>
					<Image
						style={{ width: 113, height: 73 }}
						source={require('../../assets/img/forget_password/forgot_password.png')}
					/>
					<Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15 }}>Set Password</Text>
				</View>

				<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
					<View style={{ flex: 0.15, alignItems: 'flex-end' }}>
						<MaterialCommunityIcons
							name="lock-reset"
							size={25}
							color="#d6d6d6"
						/>
					</View>
					<View style={{ flex: 0.85 }}>
						<TextInput
							style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
							value={this.state.newPassword}
							placeholder="New Password"
							onChangeText={(newPassword) => this.onChange('newPassword', newPassword)}
							autoCapitalize='none'
							autoCorrect={false}
							textColor="#000000"
							textContentType='password'
							secureTextEntry={this.state.hidePassword}
							returnKeyType='done'
							enablesReturnKeyAutomatically={true}
							selectTextOnFocus={true}
							spellCheck={false}
						/>
					</View>
				</View>

				<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 8 }}>
					<View style={{ flex: 0.15, alignItems: 'flex-end' }}>
						<MaterialCommunityIcons
							name="lock-reset"
							size={25}
							color="#d6d6d6"
						/>
					</View>
					<View style={{ flex: 0.85 }}>
						<TextInput
							style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
							value={this.state.cnfPassword}
							placeholder="Confirm Password"
							onChangeText={(cnfPassword) => this.onChange('cnfPassword', cnfPassword)}
							autoCapitalize='none'
							autoCorrect={false}
							textColor="#000000"
							textContentType='password'
							secureTextEntry={this.state.hidePassword}
							returnKeyType='done'
							enablesReturnKeyAutomatically={true}
							selectTextOnFocus={true}
							spellCheck={false}
						/>
					</View>
				</View>
				<Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 35 }}>{this.state.passError}</Text>
				<CustomButton
					disabled={emailError || !isDirty ? true : false}
					onClick={this.fetchAPI}
					text='SUBMIT'
				/>
			</View>
		);
	}
}