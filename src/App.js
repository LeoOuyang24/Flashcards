import logo from './logo.svg';
import './App.css';
import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'
import {FlashcardsGame} from './flashcards'
import {WriteGame} from './writeGame'
import {getCards,prng} from './util.js'


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
    <label for="startIndex">Flashcard to start at:
      <input style={{width: "10vw"}}type="number" min="1" name="index" id="startIndex"/>
    </label>
      <div style={{marginLeft: "10px",fontSize: "12px",marginTop:"1vh"}}>Randomize? 
          <input type = "checkbox" name="randomize" title="Randomize the order of the cards."
          onClick={ () => {
            let inp = document.getElementById("startIndex")
            inp.disabled = !inp.disabled
            document.getElementById("seed").disabled = !inp.disabled
          }
        }/> 
        <input type="date" name="seed" id="seed" disabled={true} title="Set a date to seed the rng. Choose the same date for the same random set every time."/>
      </div>

      <br/>
      <div className="optionsMenu">
        {levels}
      </div>
      <div className="optionsMenu">
        {/*<MenuOption name="write" title="Write something using HSK terms" message="Write"/> uncomment this to enable write game*/}
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
            cardAmount: -1,
            startIndex: 1,
            game: 0} //0 = first screen, 1 = flashcards, 2 = write
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(event)
  {
    event.preventDefault()
    this.setState({startIndex: event.target.index.value ? parseInt(event.target.index.value) : 1})
    this.setState({shuffle: event.target.randomize.checked })
    this.setState({game: 1})
    //this.setState({game: event.target.write.checked ? 2 : 1}) <-- uncomment for write game
    this.setState({charOnly: event.target.charOnly.checked})
    this.setState({seed: event.target.seed.value ? new Date(event.target.seed.value).getTime() : Date.now()})

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
      startIndex = {this.state.startIndex} 
      shuffle = {this.state.shuffle}
      charOnly = {this.state.charOnly}
      levels = {this.state.levels}
      seed = {this.state.seed}/>
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

