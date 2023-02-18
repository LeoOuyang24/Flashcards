import logo from './logo.svg';
import './App.css';
import {read} from './read.js'
import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'

export class Flashcards  extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      cards: [], //total set of we are studying flashcards
      studyTerms: [], //current set we are studying
      curTerm: 0,
      showTerm: true, //show the term vs the definition
      incorrect: []
    }
      fetch("https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json/hsk-level-4.json").then(res => 
          res.json()).catch(err => console.log(err)).then(json => 
          {
          let temp =json.slice(props.startIndex - 1,props.startIndex - 1 + props.cardAmount);
          this.setState({cards: temp,studyTerms:temp});
        })
    this.swapTerm = this.swapTerm.bind(this);

  }
  changeTerm(positive)
  {
    this.setState({showTerm: true})
    if (!positive)
    {
      if (this.state.studyTerms[this.state.curTerm] == this.state.incorrect[this.state.incorrect.length - 1]) //when we go backwards we pop incorrect terms off
      {
        this.state.incorrect.pop()
      }
    }
    this.setState((state,props) => ({curTerm: Math.max(0,this.state.curTerm + 2*(positive) - 1)}))
  }
  swapTerm() //swap between all cards to incorrect cards
  {
      if (this.state.incorrect.length > 0)
      {
        this.setState({studyTerms: this.state.incorrect,
                      incorrect: [],
                       showTerm: true,
                      curTerm: 0})
      }
      else
      {
        alert("No incorrect terms!")
      }
  }
  render()
  {
    let terms = this.state.studyTerms
    if (!terms || !terms.length || terms.length <= 0 )
    {
      return (<div>
        FAILED TO LOAD SET
      </div>)
    }
    else
    {
      let display = null
      if (this.state.curTerm >= terms.length)
      {
        display = (<div>
                    <Text text = {"Score: " + parseInt((1 - this.state.incorrect.length/this.state.studyTerms.length)*10000/100) + "%"}/>
                    <Text text = {"Total incorrect: " + this.state.incorrect.length + "/" + this.state.studyTerms.length}/>
                  </div>)
      }
      else
      {
        display = <Term term={terms[this.state.curTerm]} showTerm={this.state.showTerm}/>
      }
      return (
        <div>
            <div className="counter">
              {this.state.curTerm + 1}/{terms.length}
              <div className="incorrect">
                Wrong: {this.state.incorrect.length} ({parseInt(( this.state.incorrect.length/terms.length)*10000/100)}%) {/*amount wrong, percentage is rounded*/}
              </div>
            </div>
            <div className = "defs">
              {display}
            </div>
            <div className = "buttons">
              <button onClick = {() => this.setState({showTerm: !this.state.showTerm})}>
                {this.state.showTerm ? " Term" : " Definition"}
              </button>
              <button style={{backgroundColor:"green"}} onClick={() => this.changeTerm(true)}>
                !
              </button>
              <button style={{backgroundColor:"red"}} onClick={() => {this.state.incorrect.push(terms[this.state.curTerm]);this.changeTerm(true)}}>
                ?
              </button>
              <button onClick={() => {this.changeTerm(false)}}>
                ⏎
              </button>
              <button onClick={this.swapTerm}>
                Study Incorrect Terms
              </button>
            </div>
        </div>
      );
    }
  }
}

export class App extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {
            cardAmount: 10,
            startIndex: 1,
            startCards: false}
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(event)
  {
    event.preventDefault()
    this.setState({cardAmount: event.target[0].value ? parseInt(event.target[0].value) : 10})
    this.setState({startIndex: event.target[1].value ? parseInt(event.target[1].value) : 1})
    this.setState({startCards: true})
  }
  render()
  {
    return (  
    <div  className="App">
      <header className="App-header">
      {this.state.startCards ? <Flashcards cardAmount={this.state.cardAmount} startIndex = {this.state.startIndex}/> :(
        <form onSubmit={this.handleSubmit}>
        <label for="cardNumber"> How many flashcards to study?
          <input type="number" min="5"/>
         </label>
         <br/>
         <br/>
        <label for="startIndex">Flashcard to start at:
          <input type="number" min="1"/>
        </label>
          <br/>
          <br/>
          <input type="submit"/>
        </form>)}
        {/*<Flashcards/>*/}
      </header>
    </div>
    )
  }
}

