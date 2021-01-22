import React, { Component } from 'react';

export default class Form extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            author: '',
            quote: '',
            source: '',
            date: '',
            keywords: '',
            user: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name]: value    });
    }
    
    handleSubmit() {
        alert('Thank you for submitting a new (in)vsibility');
    }
    
    
  render() {

    return (
      <div className = "newEntryForm">
        <p id="formHeader">Enter a new (In)Visibility:</p>
        <form onSubmit={this.handleSubmit} target="_blank"> 
            
            <label>Author:<br/>    
            <input type="text" name="author" id="author" size="50" required
            onChange={this.handleInputChange}  
            value={this.state.author} 
            /><br/>
            </label>
            
            <label>Quote:<br/>    
            <textarea name="quote" id="quote" rows="5" cols="42" required
            onChange={this.handleInputChange}  
            value={this.state.quote}     
            ></textarea><br/>
            </label>
                
            <label>Source:<br/>   
            <input type="text" name="source" id="source" size="50" required
            onChange={this.handleInputChange}  
            value={this.state.source}   
            /><br/>
            </label>
        
            <label>Date:<br/> 
            <input type="text" name="date" id="date" size="50" required
            onChange={this.handleInputChange}  
            value={this.state.date}   
            /><br/>
            </label>
            
            <label>Keywords (comma-separate):<br/>
            <input type="text" name="keywords" id="keywords" size="50" 
            value={this.state.keywords}    
            onChange={this.handleInputChange} required
            /><br/>
            </label>
            
            <label>User:<br/>
            <input type="text" name="user" id="user" size="50"
            onChange={this.handleInputChange}  
            value={this.state.user}                   
            /><br/><br/>
            </label>
            
            <input type="submit" value="Submit"/>
        </form>
    </div>
    );
  }
}


