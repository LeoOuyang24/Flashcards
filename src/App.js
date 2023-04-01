import logo from './logo.svg';
import './App.css';
import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'
import {FlashcardsGame} from './flashcards'
import {WriteGame} from './writeGame'


function FirstScreen(props)
{
  return (
  <form onSubmit={props.handleSubmit}>
    <label for="cardNumber"> How many flashcards to study?
      <input type="number" min="5" name="amount"/>
     </label>
     <br/>
     <br/>
    <label for="startIndex">Flashcard to start at:
      <input type="number" min="1" name="index"/>
    </label>
      <br/>
      <br/>
    <label> Write
      <input type = "checkbox" name="write"/>
    </label>
    <label> Randomize?
      <input type = "checkbox" name="randomize"/>
    </label>
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
            link:"https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json/hsk-level-4.json",
            game: 0} //0 = first screen, 1 = flashcards, 2 = write
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(event)
  {
    event.preventDefault()
    this.setState({cardAmount: event.target.amount.value ? parseInt(event.target.amount.value) : 10})
    this.setState({startIndex: event.target.index.value ? parseInt(event.target.index.value) : 1})
    this.setState({shuffle: event.target.randomize.checked })
    this.setState({game: event.target.write.checked ? 2 : 1})
  }
  render()
  {
    let game = undefined
    if (this.state.game == 1)
    {
      game = <FlashcardsGame link={this.state.link} cardAmount={this.state.cardAmount} startIndex = {this.state.startIndex} shuffle = {this.state.shuffle}/>
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

