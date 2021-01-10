import React, { Component } from 'react';

export default class Filter extends Component {
  constructor(props){
    super(props);

    this.state={
      meta: false,
    }

  }
    


  render() {
    return (
      
    <div id="sidebarContainer">
       
        
       <form className = "display">
            <fieldset  id = "searchBox">
               <legend id = "h1"> Search:</legend>
                <p><input type="text" className="searchTerm" size="50" placeholder="Search"/></p>
                <input type = "submit" id = "submitbtn" value = "Search"/>
            </fieldset>
            
        </form>
      
        
        
        <form className = "display" id = "metadataFilter">
            <fieldset>
                <legend id = "h2">Filter Metadata: </legend>
                <p><input type ="checkbox" id= "option1"/> Author</p>
                <p><input type ="checkbox" id= "option2"/> Source </p>
                <p><input type ="checkbox" id= "option3"/> Origin</p>
                <input type = "submit" id = "submitbtn" value = "Refresh"/>
            </fieldset>
            
        </form>
        
        
         <form className = "display" id = "tileNumber">
            <fieldset>
                <p>Current tiles:</p>
                <legend id = "h3">Select Number of Tiles to Display: </legend>
                <p><input type="text" className="searchTerm" size="50" placeholder="Search"/></p>
                <input type = "submit" id = "submitbtn" value = "Select"/>
            </fieldset>
            
        </form>
        
    </div>
    );
  }
}
