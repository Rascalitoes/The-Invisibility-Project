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
          <p className = "quote" id="quote10"> 
            {this.props.quote}
          </p>
        :
          // <div className= "entry tile2" id="meta10">
        <div>
            <p className={'author', 'text'}> {this.props.author}</p>
            <p className={'sourceInfo', 'text'}>  {this.props.source} </p>
        </div>   
          // </div>
        }
      </div>
    );
  }
}
