import logo from './logo.svg';
import './App.css';
import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'
import {FlashcardsGame} from './flashcards'
import {WriteGame} from './writeGame'


function MenuOption(props)
{
  return ( 
        <div className="option">
          <input type = "checkbox" name={props.name} title={props.title}/>
          <br/>
          {props.message}
        </div> 
        )
}

function FirstScreen(props) //home page
{
  let levels = []
  for (let i = 1; i <= 6; ++i)
  {
    levels.push(<MenuOption name={"HSK" + i} message={"HSK" + i}/>)
  }
  return (
  <form onSubmit={props.handleSubmit}>
    <label for="cardNumber"> How many flashcards to study?
      <input type="number" min="5" name="amount" id="numOfCards" disabled={false}/>
     </label>
     All Terms
     <input type="checkbox" name="all" title="Study all terms" onClick={() => {
      let input = document.getElementById("numOfCards")
      input.disabled = !input.disabled
    }}/>
     <br/>
     <br/>
    <label for="startIndex">Flashcard to start at:
      <input type="number" min="1" name="index"/>
    </label>
      <br/>
      <div className="optionsMenu">
        {levels}
      </div>
      <div className="optionsMenu">
        {/*<MenuOption name="write" title="Write something using HSK terms" message="Write"/> uncomment this to enable write game*/}
        <MenuOption name="randomize" title="Shuffle the order of the flashcards" message="Randomize?"/>
        <MenuOption name="charOnly" title="Study individual characterse only" message="Characters Only"/>
      </div>
      <br/>
      <br/>
      <input type="submit"/>

  </form>)
}

export class App extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {
            cardAmount: 10,
            startIndex: 1,
            game: 0} //0 = first screen, 1 = flashcards, 2 = write
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(event)
  {
    event.preventDefault()

    this.setState({cardAmount: event.target.amount.value ? parseInt(event.target.amount.value) : event.target.all.checked ? -1 : 10}) //do the value provided, or -1 (all flashcards) if "all cards" was checked, or 10 if no input at all
    this.setState({startIndex: event.target.index.value ? parseInt(event.target.index.value) : 1})
    this.setState({shuffle: event.target.randomize.checked })
    this.setState({game: 1})
    //this.setState({game: event.target.write.checked ? 2 : 1}) <-- uncomment for write game
    this.setState({charOnly: event.target.charOnly.checked})
    let levels = []

    for (let i =1; i <= 6; ++i)
    {
      if (event.target["HSK" + i].checked)
      {
        levels.push(i)
      }
    }
    this.setState({levels: levels })
  }
  render()
  {
    let game = undefined
    if (this.state.game == 1)
    {
      game = <FlashcardsGame
      cardAmount={this.state.cardAmount} 
      startIndex = {this.state.startIndex} 
      shuffle = {this.state.shuffle}
      charOnly = {this.state.charOnly}
      levels = {this.state.levels}/>
    }
    else if (this.state.game == 2)
    {
      game = <WriteGame link={this.state.link}  cardAmount={this.state.cardAmount} startIndex = {this.state.startIndex}/>
    }
    else
    {
      game = <FirstScreen handleSubmit={this.handleSubmit}/>
    }
    return (  
    <div  className="App">
      <header className="App-header">
      {game}
      </header>
    </div>
    )
  }
}

