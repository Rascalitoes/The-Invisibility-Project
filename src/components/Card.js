import React, { Component } from 'react';

export default class Card extends Component {
  constructor(props){
    super(props);

    this.state={
      meta: false,
    }

  }

  render() {
    return (
      <div className = {'tile ' + (this.state.meta && 'meta')} onClick={()=>{this.setState({meta: !this.state.meta})}}>
        {!this.state.meta ? 
          <p className = "quote"> 
            {this.props.quote}
          </p>
        :
        <div className = 'text'>
            <p> {this.props.author}</p>
            <p>  {this.props.source} </p>
        </div>   
        }
      </div>
    );
  }
}
