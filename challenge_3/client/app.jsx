class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			checkingOut: false
		};
		this.toggleCheckout = this.toggleCheckout.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.submitData = this.submitData.bind(this);
	}

	toggleCheckout() {
		this.setState({checkingOut: true})
	}

	updateName(event) {
		this.setState({name: event.target.value})
	}
	updateEmail(event) {
		this.setState({email: event.target.value})
	}
	updatePassword(event) {
		this.setState({password: event.target.value})
	}

	submitData() {

		var data = {name: this.state.name, email: this.state.email, password: this.state.password};
		console.log('click ' + data)
		fetch('http://localhost:3000/submit', {
			method: "POST",
			headers: {
      	'Content-Type': 'application/json'
    	},
			body: JSON.stringify(data)
		}).then(function(response) {
			console.log('sent ' + data)
		})
	}


	render() {
		return (
			<div>
				<NavBar/>
				<h1> Your current cart </h1> 
				{ !this.state.checkingOut 
					? <button onClick={this.toggleCheckout}> Checkout </button>
					: <FirstForm updateName={this.updateName} updateEmail={this.updateEmail} updatePassword={this.updatePassword} submitData={this.submitData}/>
					}
			</div>
		)
	}
}

const NavBar = () => {
	return (
		<div className="navbar">
			Stuff goes here
		</div>
		)
}

const FirstForm = (props) => {
		return (
			<form>
				<input id="name" type="text" placeholder="name" onChange={props.updateName}></input>
				<input id="email" type="text" placeholder="email address" onChange={props.updateEmail}></input>
				<input id="password" type="password" onChange={props.updatePassword}></input>
				<button type="submit" onClick={ (e) => {
					e.preventDefault();
					props.submitData();	
				}}>Next </button>
			</form>
		)
}

ReactDOM.render(<App />, document.getElementById('app'))